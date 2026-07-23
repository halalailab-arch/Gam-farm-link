# Asset notes

## Real brand assets (in place)

The official TAF Africa Global logo and 13 project photographs were supplied
by the owner and now power the site:

- `assets/img/logo.png` — official logo, white background removed for use on
  dark surfaces (original preserved as `assets/img/logo-full.jpg`).
- `assets/img/photo-*.jpg` — real photography used across the hero, project
  cards, services rows and about page.

## Still placeholder — search the HTML for `PLACEHOLDER` / `REPLACE`

- `assets/img/ceo.svg` — monogram stand-in; replace with the CEO's official
  portrait when available.
- Homes-delivered statistic on the homepage (currently 5,000+).
- Contact details: office addresses, phone numbers and email addresses are
  representative and must be confirmed by the company.
- Two projects cards are marked "REPRESENTATIVE PROJECT" — rename them to the
  actual developments shown in those photos.
- The contact form is front-end only; point it at a real endpoint
  (e.g. Formspree or the company CRM) before launch.

Fonts (Playfair Display, Manrope) are bundled locally under `assets/fonts/`
— no external requests at runtime; the site is fully self-contained.
