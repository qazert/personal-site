# Content still to replace

The CV attached to the build request could not be reached from the build
environment, and miguelpedroso.com is blocked by the network policy here. So the
structure, design and behaviour of this site are real, and a number of the facts
in it are not.

Everything below lives in `content/site.ts`. Nothing else needs editing.

## Must replace before the site goes live

**Case studies** (`caseStudies`) - all four are fictional. Ledgerline,
Northbeam Health, Atlas Freight and Cadence are invented companies with
invented problems, invented approaches and invented outcomes. Replace client
names, titles, summaries, the problem and approach narrative, and every number
in `outcomes`. Each entry carries `placeholder: true` so they are easy to find.

**Testimonials** (`testimonials`) - three invented quotes attributed to three
invented people. Use real quotes from real clients with their permission, or
delete the section. Fabricated testimonials are worse than no testimonials, and
this site is aimed at companies evaluating whether to trust you.

**Client list** (`clients`) - six invented names rendered as monogram lockups.
Replace with real clients. If a client has a mark in
[Simple Icons](https://simpleicons.org), set its slug on `icon` and the real
logo renders instead of the monogram.

**Proof numbers** (`home.proof.stats`) - "9 years", "30+", "4" are guesses.

**Employment history** (`about.experience`) - the two pre-2022 rows say
"PLACEHOLDER Company". The dates and the notes are guesses too.

**Contact details** (`site.email`, `site.socials`) - `hello@miguelpedroso.com`
and the three profile URLs are assumed, not verified.

**Location** (`site.location`) - assumed to be Lisbon.

## Worth reviewing, not necessarily wrong

- `home.headline` and `home.subhead` - the site's central promise. Written to be
  specific and short. Change it if it does not match how you sell.
- `services.offerings` - four engagements with timelines and scope. The shapes
  are conventional for independent product design; the specifics should match
  what you actually offer.
- `about.intro` - written around "complex software for expert users under time
  pressure". If your positioning is different, this is the paragraph to rewrite.
- `home.faq` - answers commit you to a two working day reply, fixed pricing and
  no hourly billing. Make sure you are happy being held to that.

## Images

`public/` currently holds 17 generated placeholder plates: soft graphite and
paper gradients in the brand palette. They are there so the layout, aspect
ratios and loading behaviour are real, not because they are good.

Replace each file at the same path and roughly the same dimensions:

| Path | Size | What it should be |
| --- | --- | --- |
| `home/hero.jpg` | 1600x1400 | Hero visual. Work, workspace or portrait. |
| `home/system.jpg` | 1400x1000 | Supports the first benefit tile. |
| `home/craft.jpg` | 1200x900 | Currently unused. Delete or use it. |
| `work/<slug>-cover.jpg` | 1760x1100 | Case study cover, 16:10. |
| `work/<slug>-01.jpg`, `-02.jpg` | 1680x1120 | Case study detail shots, 3:2. |
| `about/portrait.jpg` | 1200x1500 | Portrait, 4:5. |
| `og.jpg` | 1200x630 | Social sharing card. |

`npm run images` regenerates the placeholders if you need them again.
