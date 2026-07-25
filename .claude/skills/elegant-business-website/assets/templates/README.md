# Page templates

These are the actual production pages from the TAF Africa Global site, kept
whole so you can see how every component is assembled in context rather than
guessing from a description.

Map them onto the new site like this:

| Template | Becomes | Contains |
|---|---|---|
| `home.html` | `index.html` | hero, video band, stats counters, legacy split, featured cards, service cards, quote band, CTA |
| `about.html` | `about.html` | page hero, timeline, values grid, leadership split, presence list, CTA |
| `portfolio.html` | `projects.html` (rename to fit) | page hero, filter bar, 8 project cards, CTA |
| `services.html` | `services.html` | page hero, alternating detail rows, three-step process, CTA |
| `contact.html` | `contact.html` | page hero, validated form, office cards |

## Before they work

Every `assets/img/*.jpg` reference points at TAF's photography, which is not
bundled here (it is the client's property). Replace each `src` with the new
business's photos or with SVG artwork you generate in the new palette. The one
image that does ship is `../pattern.svg`, the subtle chevron texture used behind
the inner page heroes; copy it to `<site>/assets/img/pattern.svg`.

`logo.png` references likewise need the new business's logo.

## Before they ship

Search the finished site for leftovers: `TAF`, `Gambia`, `Njie`, `Dalaba`,
`Brufut`, `Yundum`, `Diaspora`, `Africa Global`. Any hit means content that was
never rewritten, which is the single most damaging mistake in a re-skin.

The `<!-- PLACEHOLDER ... -->` and `<!-- REPLACE: ... -->` comments mark the
spots where TAF's own unverified data sat. Keep that habit: mark anything you
invent so the client can correct it.
