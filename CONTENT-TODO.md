# Content status

The site is now written from the CV (July 2026). Names, dates, roles, projects,
skills, tools, education and contact details are real. Nothing on the site
claims something the CV does not support.

Everything lives in `content/site.ts`. Nothing else needs editing to change copy.

## The one thing that is not real: imagery

`public/` holds generated placeholder plates, soft graphite and paper gradients
in the brand palette. They exist so layout and loading behaviour are real, not
because they are good. Replace each at the same path:

The three projects on the home page are the first three in `workItems`, shown
as a scroll-driven stack. Reordering that array reorders the stack.

| Path | Size | What it should be |
| --- | --- | --- |
| `work/part-exchange.jpg` | 1760x1100 | Part-exchange workflows, Web and iOS |
| `work/incident-reporting.jpg` | 1760x1100 | Incident reporting tool |
| `work/assembly-line.jpg` | 1760x1100 | Assembly-line navigation |
| `work/supply-chain.jpg` | 1760x1100 | Supply chain visibility |
| `work/nutrition.jpg` | 1760x1100 | Nutrition brand redesign |
| `work/confederacao.jpg` | 1760x1100 | Confederação Musical Portuguesa identity |
| `home/hero.jpg` | 1600x1400 | Hero visual |
| `home/system.jpg` | 1400x1000 | Supports the first benefit tile |
| `about/portrait.jpg` | 1200x1500 | Portrait, 4:5 |
| `og.jpg` | 1200x630 | Social sharing card |

`home/craft.jpg` is generated but unused. Delete it or find it a home.

`npm run images` regenerates the placeholders.

## Worth a second read before publishing

**Confidentiality.** The work grid names BMW, Critical Techworks, Decode and
Confederação Musical Portuguesa, and describes each project only to the depth
the CV already does. If your agreement with Critical Techworks is stricter than
your own CV, tighten `workItems` in `content/site.ts`.

**"10% increase in adoption"** is from the CV, attached to the part-exchange
project. It is the only hard number left on the site, and it is on the first
card of the home page stack, so make sure you are happy standing behind it in
an interview.

**`home.availability`** currently reads "Working on industrial software at
Critical Techworks". It is a status line, not an availability signal. Change or
remove it if your situation changes.

**Testimonials are gone.** The earlier draft invented three. There are none now
because there are no real ones. If you collect quotes from colleagues at
Critical Techworks or Decode, that section is worth rebuilding.

## Not built

No case study detail pages. `/projects` is a grid of six and the cards are
deliberately not links, so nothing points at a page that does not exist. If you
later write the projects up, `WorkCard` becomes a link again and a
`/projects/[slug]` route comes back.
