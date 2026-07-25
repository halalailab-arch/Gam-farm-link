# Page blueprints and component inventory

Section-by-section recipes for each page, using the classes already defined in `styles-template.css`. Reuse these classes; do not invent parallel ones.

## Component inventory (what the template CSS gives you)

| Class | What it is |
|---|---|
| `.site-header` / `.nav-wrap` / `.nav-links` / `.nav-toggle` | Fixed translucent header that solidifies on scroll; mobile dropdown menu |
| `.brand` / `.brand-mark` / `.brand-text` | Logo chip + two-line name lockup |
| `.hero` / `.hero-art` / `.hero-kicker` / `.hero-actions` | Full-bleed photo hero with dark gradient overlay, pill kicker, buttons |
| `.page-hero` + `.pattern` + `.crumbs` | Shorter dark hero for inner pages with breadcrumb |
| `.stats-band` / `.stat` / `[data-count]` | Dark stats strip with animated counters |
| `.section` / `.section-head` / `.eyebrow` / `.lead` | Standard section rhythm; gold uppercase eyebrow label |
| `.split` / `.split-media` / `.float-tag` | Two-column image + text; floating year/fact tag (becomes caption bar under 620px) |
| `.card` + `.project-card` / `.project-media` / `.badge` / `.project-loc` | Portfolio cards with image zoom on hover, status badge, location row |
| `.filter-bar` / `.filter-btn` + `data-tags` on cards | Client-side portfolio filtering (wired in main-template.js) |
| `.services-grid` / `.service-card` / `.service-icon` | Icon cards with gold left-edge hover accent |
| `.svc-row` / `.svc-media` / `.svc-copy` | Alternating image/text detail rows with diamond-bullet lists |
| `.quote-section` / `blockquote` / `.quote-attrib` / `.avatar` | Dark testimonial/founder quote with circular portrait |
| `.timeline` / `.tl-item` / `.tl-year` | Vertical gold-line company history |
| `.values-grid` / `.value-card` | Numbered mission/vision/values or how-we-work steps |
| `.countries` / `.country-list` / `.country-item` | Presence/locations chips |
| `.cta-banner` | Gradient call-to-action banner with button |
| `.video-section` / `.video-frame` | Dark band with responsive 16:9 embed (use youtube-nocookie) |
| `.contact-layout` / `.contact-form` / `.form-grid` / `.form-field` / `.form-status` | Contact form with validation states |
| `.office-card` / `.office-lines` | Dark office/contact info cards |
| `.site-footer` / `.footer-top` / `.footer-links` / `.footer-contact` / `.footer-bottom` | Rich four-column footer |
| `.reveal` (+ `.reveal-d1/2/3`) | Scroll-in animation with stagger delays |
| `.btn-gold` / `.btn-outline` / `.btn-dark` / `.link-arrow` | Button and inline-link styles |

## Home page

1. `hero`: full-bleed best photo, kicker pill ("Industry · Since YEAR"), headline with one `<em>` accent word, one-line support text, two buttons (gold primary to portfolio, outline to about).
2. Optional `video-section` if the business has a film.
3. `stats-band`: 3 or 4 counters (years, locations, clients/units, headline vision). Comment-mark unverified numbers.
4. `split` legacy/intro: photo with `float-tag` (founding year) + eyebrow, h2, two short paragraphs, `link-arrow` to About.
5. Featured portfolio: `section-head` + three `project-card`s + dark button to the full portfolio page.
6. Services preview: three `service-card`s.
7. `quote-section`: founder quote with real portrait if available.
8. `cta-banner` + footer.

## About page

1. `page-hero` with breadcrumb and a belief-driven headline ("Three decades of building trust.").
2. `split` (align start): `timeline` of 4 to 6 milestones on the left, sticky photo with future-vision `float-tag` on the right.
3. `values-grid`: Mission / Vision / Values cards, written plainly.
4. Leadership `split`: founder photo (framed, captioned) + short bio. Circular-crop a face shot for the home quote avatar.
5. Locations/presence section if relevant.
6. `cta-banner` + footer.

## Portfolio / Projects page

1. `page-hero` with a promise-driven line.
2. `filter-bar` (All + locations + categories) over a `project-grid` of 6 to 9 cards. Every card: photo, status `badge`, `project-loc`, name, two-sentence blurb, Enquire link. `data-tags` must match filter values.
3. `cta-banner` + footer.

## Services page

1. `page-hero`.
2. One `svc-row` per service (3 to 5), numbered eyebrows ("01 · Development"), photo, paragraph, three diamond bullets. Rows auto-alternate sides.
3. "How we work" via `values-grid` as 3 numbered steps.
4. `cta-banner` + footer.

## Contact page

1. `page-hero` inviting one clear action.
2. `contact-layout`: form (name, email, phone, interest select, message; front-end validation via main-template.js) beside one `office-card` per location with tel:/mailto: links and hours.
3. Footer (no cta-banner; the page is the CTA).

## Copy voice guide

Write as the company, first person plural, plain and confident.

- Short declaratives beat subordinate-clause stacks. "We build to last and we hand over on time."
- Numbers as digits, one claim per sentence.
- Headlines: 4 to 8 words, sentence case with a period. "Communities designed for life."
- Eyebrows: 2 to 3 word noun phrases. "Featured Developments", "Where We Build".
- Buttons: verb-led, 2 to 4 words. "Explore Our Projects", "Talk to Our Team".
- Never: em/en dashes, "seamless", "elevate", "isn't just", "end-to-end", exclamation marks, ALL-CAPS emphasis in body copy.
- Localize gently: use the country's real place names, currency, and a local-sounding example name in form placeholders.
