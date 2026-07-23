# Asset notes

The build environment's network policy blocked `tafafricaglobal.com` and
`web.archive.org`, so the official logo and site photography could not be
downloaded. Everything visual is currently custom SVG artwork in the brand's
spirit (deep green + gold).

## To swap in the real brand assets

Every slot is marked in the source with a comment:

- `assets/img/logo.svg` — replace with the official TAF Africa Global logo
  (keep the filename, or update the `<img class="brand-mark">` references).
- `assets/img/hero-home.svg` — replace with a real hero photograph
  (`index.html`, `about.html`).
- `assets/img/project-*.svg` — replace with real project photos
  (TAF City, Dalaba Estate, Brufut Gardens, Abuja, Lagos, diaspora villas).
- `assets/img/ceo.svg` — replace with the CEO's official portrait.

Search the HTML for `REPLACE` and `PLACEHOLDER` comments — they also mark
unverified statistics (homes delivered) and contact details (addresses,
phone numbers, emails) that need the company's real figures.

Fonts (Playfair Display, Manrope) are bundled locally under `assets/fonts/`
— no external requests at runtime; the site is fully self-contained.
