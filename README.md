# miguelpedroso.com

Portfolio site for Miguel Pedroso, product designer. Next.js App Router,
Tailwind v4, self-hosted Open Sans, Motion for interaction.

> Copy is written from the CV and is real. Imagery is still placeholder.
> See [CONTENT-TODO.md](./CONTENT-TODO.md).

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

## Where things live

| Path | What |
| --- | --- |
| `content/site.ts` | Every word on the site. Copy changes happen here and nowhere else. |
| `app/` | Routes: home, `/projects`, `/about`, `/contact`. |
| `components/site/` | Header, footer, page header, CTA band. |
| `components/ui/` | Button and the scroll reveal wrapper. |
| `app/globals.css` | Design tokens: colour, radius, elevation, type utilities. |
| `public/` | Images. Placeholder plates until real exports land. |

## Design tokens

Defined once in `app/globals.css` as CSS variables, exposed to Tailwind through
`@theme inline`.

- **Colour** `#101010` ink on `#FFFFFF` paper. The accent is the ink itself and
  inverts in dark mode, so a filled control is always maximum contrast against
  the page. `--danger` is separate and semantic: errors must not read as accent.
- **Glass** the floating navigation uses `.glass`: a blur plus saturation, a
  bright top edge and a soft inner floor. A web approximation of a refractive
  material, not a port of any native effect. It falls back to a solid panel
  under `prefers-reduced-transparency` and where `backdrop-filter` is missing.
- **Footer** inverts the page, ink ground in light mode and paper in dark, and
  closes with the name set to the full container width and cropped by the page
  edge. `--sig-ratio` in `globals.css` is the measured width-to-font-size ratio
  of that string in bold Open Sans; `npm run interactions` asserts the result
  still spans the footer, so the constant cannot drift silently.
- **Radius** one scale, one rule: buttons and tags are pills, inputs `12px`,
  cards `16px`, media panels `24px`.
- **Theme** light and dark are both first class. `data-theme` is set on `<html>`
  before first paint by `components/site/ThemeScript.tsx`, defaulting to the
  system preference with a manual override stored in `localStorage`.

## Motion

Every animation is entry, feedback or state transition. There is no decorative
motion and no scroll hijacking. All of it collapses under
`prefers-reduced-motion`, and a `<noscript>` rule in `app/layout.tsx` makes the
reveal-on-scroll content visible when JavaScript does not run.

## Contact form

`app/api/contact/route.ts` validates the submission and forwards it to whatever
webhook you set in `CONTACT_FORWARD_URL` (Formspree, Zapier, a Slack incoming
webhook, your own mailer). Copy `.env.example` to `.env.local` and fill it in.

Until that variable is set the endpoint answers `501` and the form shows its
error state with a mailto fallback. It never pretends a message was delivered.

## Tooling

```bash
npm run images       # regenerate the placeholder plates in /public
npm run shots        # screenshot every page, audit for layout defects
npm run interactions # drive theme toggle, mobile menu, project stack, contact form
npm run preview      # build a single-file, self-contained clickable preview
```

`npm run shots` walks every route at 1440px and 390px in both themes and reports
horizontal overflow, wrapped CTA labels, undersized touch targets and console
errors. Start the server first (`npm run build && npm start`), or pass a URL:
`node scripts/shots.mjs https://staging.example.com`.
