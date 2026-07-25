---
name: elegant-business-website
description: Build a premium multi-page static business website (plain HTML/CSS/JS, no build step) by re-skinning a proven editorial design system with bundled fonts, scroll animations, portfolio filters and full mobile responsiveness. Use this skill whenever the user asks to build, redesign, or mock up a website for a business, company, brand, agency, studio, portfolio, real estate firm, restaurant, exporter, or any professional web presence, and whenever they say things like "make it look professional", "elegant website", "landing page for my company", "redesign this site", or "something the client can't resist", even if they never say the word "static".
---

# Elegant Business Website

This skill packages a complete, working design system taken from a real client redesign (TAF Africa Global, a Pan-African property developer) that the client shipped to production. You are not designing from scratch; you are re-skinning a system that already survived a demanding review cycle. That is what makes the output look studio-made rather than generated.

Two constraints define the whole approach:

- **No build step.** Every page opens by double-clicking the HTML and deploys unchanged to GitHub Pages or Netlify. Clients can open it on their phone within seconds of you sending a link, which is what actually closes the sale.
- **Nothing loads from the internet at runtime.** Fonts are bundled locally. This keeps the site fast, private, and working offline. Hotlinked Google Fonts are the single most common way these builds get sloppy.

## Step 0: Gather what makes this business specific

Before writing code, establish:

1. **Name, industry, what they sell, and where.** A law firm and a surf school should not feel the same. Place names, currency, and local detail are most of what makes copy feel real.
2. **Brand colors**, sampled from their logo if one exists.
3. **Pages.** Default set: Home, About, Portfolio/Projects, Services, Contact. Cut freely; three strong pages beat five thin ones. Rename to fit (a coffee exporter wants "Our Coffees", not "Projects").
4. **Real assets.** Ask for the logo and 8 to 15 photos early. Real photography is the biggest single difference between "template" and "irresistible". Until they arrive, generate bespoke SVG artwork in the brand palette rather than leaving gaps, and mark every one with `<!-- REPLACE: ... -->`. Mark invented statistics and contact details the same way, and list them all in an `ASSETS.md` so nothing fake ships silently.

## Step 1: Copy the system, then re-skin it

Start from the bundled files rather than writing markup by hand:

```
assets/styles-template.css   ->  <site>/css/styles.css
assets/main-template.js      ->  <site>/js/main.js
assets/templates/*.html      ->  <site>/{index,about,portfolio,services,contact}.html
assets/pattern.svg           ->  <site>/assets/img/pattern.svg
```

The templates are the actual production pages, so every component is already wired: sticky header, mobile dropdown, hero, stats counters, project cards with filters, service rows, quote band, timeline, contact form, footer. Your job is to replace content and tokens, not structure.

**Re-skin by editing only the `:root` block** at the top of `styles.css`. The palette formula that makes this feel premium:

- **A very dark anchor**, near-black but tinted toward the brand hue, for the hero, one mid-page band, and the footer. (TAF: forest green `#041F17` through `#186A54`.)
- **A warm metallic accent** used sparingly on eyebrows, buttons, badges, and thin rules, never on large surfaces. (TAF: gold `#C9A227`.)
- **A cream field**, never pure white. This is what makes it read editorial instead of corporate. (`#F8F5EE`.)
- **Ink text tinted toward the brand hue**, never pure black.

Keep that structure and shift the hues: navy and brass for law, charcoal and terracotta for architecture, espresso and copper for coffee, ink and sage for wellness. Change `--font-display` and `--font-body` if the industry calls for it, but keep the serif-display-plus-clean-sans pairing.

Then bundle the fonts (this is why the site stays self-contained):

```bash
python3 scripts/bundle_fonts.py <site>/assets/fonts \
  --display "Playfair Display:ital,wght@0,500;0,600;0,700;1,500" \
  --body "Manrope:wght@400;500;600;700;800"
```

Link `assets/fonts/fonts-local.css` before `css/styles.css` in every page head.

## Step 2: Rewrite every word

The templates ship with TAF's real estate copy. Leaving any of it in is the fastest way to look careless, so replace all visible text, `<title>`, meta descriptions, alt text, and form placeholders.

Read `references/page-blueprints.md` for the section-by-section recipe of each page, the full component inventory (which class does what), and the copy voice guide. Follow those layouts instead of inventing new ones; the rhythm of dark band, cream band, cream-2 band is doing real work.

Three rules that carry most of the quality:

- **No em dashes or en dashes anywhere**, including comments and meta tags. Use a comma, a colon, or a new sentence. This is the most reliable tell of machine-written copy, and clients notice it. Grep for `—` and `–`; the count must be zero.
- **Avoid the other tells**: "isn't just X, it's Y", triads of parallel fragments, "seamless", "elevate", "end-to-end", "at its core". Write what a founder would actually say out loud: "We keep our word, we build properly and we deliver when we said we would."
- **Hero stays short.** One headline of four to eight words with a single italicized accent word, one line of support text, two buttons. Long paragraphs belong further down the page.

## Step 3: Verify in a real browser, then look at it

Never call a site done from reading code. Run the bundled check:

```bash
node scripts/verify_site.js <site_dir> <screenshot_dir>
```

It serves the site locally and, across eight widths from 320px to 1680px, asserts no em dashes, no external dependencies, no broken local paths, no console or request errors, and no horizontal overflow, saving desktop and mobile screenshots as it goes. It exits non-zero on failure.

Passing is necessary, not sufficient: open the screenshots and judge them. Automated checks cannot see an overlay covering a photo's subject, a cramped grid, or a hero that pushes its buttons below the fold. Fix what looks wrong, then send the screenshots to the user.

Also exercise the interactive parts once by hand or in Playwright: open the mobile menu and navigate, click each portfolio filter and count the visible cards, submit the contact form empty (expect a validation message) and filled (expect success).

## Step 4: Ship

- Deploy by pushing the site folder as the root of a `gh-pages` branch:
  `git push origin "$(git subtree split --prefix <site_dir> HEAD)":refs/heads/gh-pages --force`
  Then the owner enables Pages once: Settings, Pages, deploy from branch `gh-pages`, root.
- Add `<meta name="theme-color" content="<dark anchor>">` and a favicon made from the logo.
- Tell the user plainly that the contact form is front-end only and needs pointing at Formspree or their CRM before real launch, and hand them the `ASSETS.md` list of everything still to confirm.

## Where re-skins usually go wrong

- **Leftover template content.** A stray "Yundum, The Gambia" or "Diaspora Villas" in a coffee site destroys the illusion instantly. Search the site for the old brand's words before shipping.
- **Filling every page to the same length.** Cut sections the business has no substance for. Whitespace is part of the look.
- **Pure white and pure black "because it's cleaner".** It flattens the editorial feel. Keep cream and tinted ink.
- **Overlay tags covering photo subjects on phones.** The stylesheet already converts `.float-tag` into a caption bar under the image below 620px; keep that pattern for any new overlay you add.
- **A logo that vanishes on the dark header.** If the artwork is dark on white, put it on the small white rounded chip (`.brand-mark` already does this) rather than badly knocking out the background.
