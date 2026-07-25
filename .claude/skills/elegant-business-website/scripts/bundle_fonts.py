#!/usr/bin/env python3
"""Download Google Fonts and rewrite them for local, self-contained use.

A site that hotlinks fonts breaks offline, leaks visitors to a third party, and
fails its own request checks. This bundles the latin subset into the site so it
has zero external dependencies at runtime.

Usage:
    python3 bundle_fonts.py <output_dir> [--display "Playfair Display:wght@500;600;700"]
                                         [--body "Manrope:wght@400;500;600;700;800"]

Writes <output_dir>/*.woff2 and <output_dir>/fonts-local.css. Link that CSS
BEFORE styles.css in every page head. The src paths are relative to the CSS
file's own directory, which is the bug people hit when they hand-roll this.
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")


def fetch(url: str) -> bytes:
    result = subprocess.run(
        ["curl", "-sS", "--max-time", "40", "-A", UA, url],
        capture_output=True, check=True,
    )
    return result.stdout


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("output_dir")
    ap.add_argument("--display", default="Playfair Display:ital,wght@0,500;0,600;0,700;1,500")
    ap.add_argument("--body", default="Manrope:wght@400;500;600;700;800")
    args = ap.parse_args()

    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)

    families = "&".join(f"family={f.replace(' ', '+')}" for f in (args.display, args.body))
    css = fetch(f"https://fonts.googleapis.com/css2?{families}&display=swap").decode()

    blocks = re.findall(r"/\*\s*(\S+)\s*\*/\s*(@font-face\s*\{[^}]+\})", css)
    if not blocks:
        print("No @font-face blocks returned. Check the family names.", file=sys.stderr)
        return 1

    local_faces = []
    for subset, block in blocks:
        if subset != "latin":  # latin-ext/cyrillic/vietnamese are dead weight for most sites
            continue
        family = re.search(r"font-family:\s*'([^']+)'", block).group(1)
        style = re.search(r"font-style:\s*(\w+)", block).group(1)
        weight = re.search(r"font-weight:\s*(\d+)", block).group(1)
        url = re.search(r"url\((https://[^)]+)\)", block).group(1)

        filename = f"{family.replace(' ', '')}-{weight}{'i' if style == 'italic' else ''}.woff2"
        (out / filename).write_bytes(fetch(url))

        face = re.sub(r"src:[^;]+;", f"src: url('{filename}') format('woff2');", block)
        face = re.sub(r"unicode-range:[^;]+;\s*", "", face)
        local_faces.append(face)

    (out / "fonts-local.css").write_text("\n".join(local_faces) + "\n")
    print(f"Bundled {len(local_faces)} font files into {out}/ (link fonts-local.css before styles.css)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
