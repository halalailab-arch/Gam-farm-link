// Verify a finished static site the way a reviewer would, in a real browser.
//
// Catches the failures that are invisible when reading code: hotlinked fonts,
// stray em dashes, broken relative paths, console errors, and horizontal
// overflow on small phones. Run this before showing the site to anyone.
//
// Usage:
//   npm install playwright-core   (once, anywhere; or reuse an existing install)
//   node verify_site.js <site_dir> [screenshot_dir]
//
// Exits non-zero if any check fails, so it can gate a "done" claim.

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const siteDir = process.argv[2];
const shotDir = process.argv[3] || null;
const CHROMIUM = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1280, 1680];

if (!siteDir || !fs.existsSync(siteDir)) {
  console.error('Usage: node verify_site.js <site_dir> [screenshot_dir]');
  process.exit(2);
}

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon', '.json': 'application/json',
};

(async () => {
  const failures = [];
  const all = walk(siteDir);
  const htmlFiles = all.filter(f => f.endsWith('.html'));
  const codeFiles = all.filter(f => /\.(html|css|js)$/.test(f));
  const rel = f => path.relative(siteDir, f);

  // Static checks first: cheap, and they explain browser failures you would see later.
  const dashes = codeFiles
    .map(f => [rel(f), (fs.readFileSync(f, 'utf8').match(/[—–]/g) || []).length])
    .filter(([, n]) => n > 0);
  if (dashes.length) failures.push(`em/en dashes: ${dashes.map(([f, n]) => `${f}:${n}`).join(', ')}`);

  const external = [];
  for (const f of codeFiles) {
    const txt = fs.readFileSync(f, 'utf8');
    const re = /(?:href|src|url\()\s*=?\s*["'(]*(https?:\/\/[^"')\s>]+)/g;
    let m;
    while ((m = re.exec(txt)) !== null) {
      const url = m[1];
      if (/youtube|youtu\.be|maps\.google|player\.vimeo/.test(url)) continue; // embeds are deliberate
      if (/\.(css|js|woff2?|ttf|otf)([?#]|$)/.test(url) || /fonts\.(googleapis|gstatic)|cdn\./.test(url)) {
        external.push(`${rel(f)} -> ${url.slice(0, 70)}`);
      }
    }
  }
  if (external.length) failures.push(`external dependencies (bundle these locally): ${external.slice(0, 4).join('; ')}`);

  const broken = [];
  for (const f of htmlFiles) {
    const txt = fs.readFileSync(f, 'utf8');
    const re = /(?:href|src)\s*=\s*["']([^"'#]+)["']/g;
    let m;
    while ((m = re.exec(txt)) !== null) {
      const ref = m[1];
      if (/^(https?:|mailto:|tel:|javascript:|data:|#)/.test(ref)) continue;
      if (!fs.existsSync(path.resolve(path.dirname(f), ref.split('?')[0]))) {
        broken.push(`${rel(f)} -> ${ref}`);
      }
    }
  }
  if (broken.length) failures.push(`broken local references: ${broken.slice(0, 4).join('; ')}`);

  // Serve locally so relative paths behave exactly as they will when deployed.
  const port = 8800 + Math.floor(Math.random() * 900);
  const server = http.createServer((req, res) => {
    let p = path.join(siteDir, decodeURIComponent(req.url.split('?')[0]));
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    if (!fs.existsSync(p)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(fs.readFileSync(p));
  });
  await new Promise(r => server.listen(port, r));

  const browser = await chromium.launch({ executablePath: CHROMIUM });
  const errors = new Set();
  const overflow = [];

  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 500 ? 844 : 900 } });
    for (const f of htmlFiles) {
      const name = rel(f);
      const page = await ctx.newPage();
      page.on('console', m => { if (m.type() === 'error') errors.add(`${name}@${width}: ${m.text().slice(0, 80)}`); });
      page.on('pageerror', e => errors.add(`${name}@${width}: ${e.message.slice(0, 80)}`));
      page.on('requestfailed', r => {
        if (!/youtube|youtu\.be|vimeo|maps\.google/.test(r.url())) {
          errors.add(`${name}@${width} request failed: ${r.url().slice(0, 80)}`);
        }
      });
      try {
        await page.goto(`http://localhost:${port}/${name}`, { waitUntil: 'networkidle', timeout: 25000 });
        // Reveal-on-scroll hides content from full-page screenshots; show it all.
        await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')));
        await page.waitForTimeout(250);
        const over = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (over > 1) overflow.push(`${name}@${width}px overflows by ${over}px`);
        if (shotDir && (width === 390 || width === 1280)) {
          fs.mkdirSync(shotDir, { recursive: true });
          const tag = width === 390 ? 'mobile' : 'desktop';
          await page.screenshot({
            path: path.join(shotDir, `${name.replace(/[\/.]/g, '_')}-${tag}.png`),
            fullPage: true,
          });
        }
      } catch (e) {
        errors.add(`${name}@${width}: ${String(e).slice(0, 80)}`);
      }
      await page.close();
    }
    await ctx.close();
  }

  await browser.close();
  server.close();

  if (errors.size) failures.push(`browser errors: ${[...errors].slice(0, 5).join('; ')}`);
  if (overflow.length) failures.push(`horizontal overflow: ${overflow.slice(0, 5).join('; ')}`);

  console.log(`Checked ${htmlFiles.length} pages at ${WIDTHS.length} widths.`);
  if (failures.length) {
    console.log('\nFAILURES:');
    failures.forEach(f => console.log('  - ' + f));
    if (shotDir) console.log(`\nScreenshots: ${shotDir} (look at them before declaring done)`);
    process.exit(1);
  }
  console.log('All checks passed: no dashes, no external dependencies, no broken paths, no console errors, no overflow.');
  if (shotDir) console.log(`Screenshots: ${shotDir} (still look at them; layout taste is not automatable)`);
})();
