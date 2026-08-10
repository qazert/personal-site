/**
 * Builds a single self-contained HTML file that lets someone click through the
 * site without running it. Each route is captured from the real running build
 * after hydration, then replayed inside an iframe at a chosen device width.
 *
 *   node scripts/build-preview.mjs [baseUrl] [outFile]
 *
 * This is a preview harness, not a second implementation. The markup and the
 * stylesheet come from the real site; only navigation and theme are re-wired,
 * because React is not present in the replay. The scroll-driven project stack
 * is captured settled rather than replayed.
 */
import { chromium } from "@playwright/test";
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BASE = process.argv[2] ?? "http://127.0.0.1:3100";
const OUT = process.argv[3] ?? "preview.html";

const ROUTES = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

const esc = (s) => s.replace(/<\/script>/gi, "<\\/script>");

/* ---------- stylesheet, with the Inter latin subset inlined ---------- */
async function buildCss() {
  const cssDir = ".next/static/chunks";
  const cssFile = (await readdir(cssDir)).find((f) => f.endsWith(".css"));
  let css = await readFile(path.join(cssDir, cssFile), "utf8");

  const mediaDir = ".next/static/media";
  // Whatever family is in use, keep only its latin weight-axis face.
  const latin = (await readdir(mediaDir)).find((f) =>
    /-latin-wght-normal.*\.woff2$/.test(f),
  );
  if (!latin) throw new Error("No latin variable face found in .next/static/media");
  const font = await readFile(path.join(mediaDir, latin));
  const dataUri = `data:font/woff2;base64,${font.toString("base64")}`;

  // The built CSS references fonts relatively, as ../media/<file>.woff2.
  // Keep the latin face, point it at the inlined bytes, and drop the subsets
  // this site never renders so the file stays small.
  css = css.replace(
    new RegExp(`url\\(['"]?\\.\\./media/${latin.replace(/\./g, "\\.")}['"]?\\)`, "g"),
    `url(${dataUri})`,
  );
  const family = latin.replace(/-latin-wght-normal.*$/, "");
  css = css.replace(
    new RegExp(`@font-face\\{[^}]*\\.\\./media/${family}-(?!latin-wght)[^}]*\\}`, "g"),
    "",
  );

  if (!css.includes("data:font/woff2")) {
    throw new Error("The font was not inlined; the preview would fall back silently.");
  }
  if (/\.\.\/media\//.test(css)) {
    throw new Error("Unresolved font references remain in the preview CSS.");
  }
  return css;
}

/* ---------- images, downscaled: these are placeholder gradients ---------- */
async function buildImages() {
  const files = [
    "home/hero.jpg",
    "home/system.jpg",
    "work/part-exchange.jpg",
    "work/incident-reporting.jpg",
    "work/assembly-line.jpg",
    "work/supply-chain.jpg",
    "work/nutrition.jpg",
    "work/confederacao.jpg",
    "about/portrait.jpg",
  ];
  const out = {};
  for (const f of files) {
    const buf = await sharp(path.join("public", f))
      .resize({ width: 420 })
      .jpeg({ quality: 62 })
      .toBuffer();
    out[`/${f}`] = `data:image/jpeg;base64,${buf.toString("base64")}`;
  }
  return out;
}

/* ---------- capture each route after hydration and after reveals ---------- */
async function capture() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
  });
  /* Captured with motion enabled so the project stack keeps its sticky layout.
     CSS sticky still stacks the cards in the replay; only the scale and tilt,
     which Motion drives, are missing. */
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const pages = {};

  for (const route of ROUTES) {
    const page = await context.newPage();
    await page.goto(BASE + route.path, { waitUntil: "networkidle" });

    // Walk the page so every scroll-reveal has fired before we snapshot.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 70));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 150));
    });

    pages[route.path] = await page.evaluate(() => {
      // Point every image back at its original path. The optimiser URLs and
      // srcsets cannot resolve once the page is detached from the server.
      for (const img of document.querySelectorAll("img")) {
        const src = img.getAttribute("src") ?? "";
        const match = src.match(/[?&]url=([^&]+)/);
        if (match) img.setAttribute("src", decodeURIComponent(match[1]));
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
        img.setAttribute("loading", "eager");
      }
      // Reveal wrappers and stack cards still carry the inline transform Motion
      // left behind. Strip it so nothing depends on Motion in the replay.
      for (const el of document.querySelectorAll('[style*="opacity"], [style*="transform"]')) {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
      }
      for (const s of document.querySelectorAll("script, noscript, link"))
        s.remove();
      return document.body.innerHTML;
    });

    await page.close();
  }

  await browser.close();
  return pages;
}

/* ---------- assemble ---------- */
const css = await buildCss();
const images = await buildImages();
const pages = await capture();

const html = `<title>miguelpedroso.com preview</title>
<style>
  /* Chrome tokens. The previewed site brings its own palette; this shell is
     deliberately a different, cooler neutral so the two never blur together. */
  :root {
    --shell: #eceef1;
    --shell-2: #f7f8fa;
    --shell-line: #d3d7de;
    --shell-text: #1b1e24;
    --shell-muted: #5c636f;
    --shell-dim: #858d9a;
    --shell-hover: #e2e5ea;
    --shell-active: #101010;
    --shell-dot: #d7dbe2;
    --chrome-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --shell-active: #f1f1f1;
      --shell: #17171a;
      --shell-2: #202024;
      --shell-line: #34343a;
      --shell-text: #ededf0;
      --shell-muted: #9a9aa4;
      --shell-dim: #6f6f7a;
      --shell-hover: #2b2b31;
      --shell-dot: #2a2a30;
    }
  }
  :root[data-theme="dark"] {
    --shell-active: #f1f1f1;
    --shell: #17171a;
    --shell-2: #202024;
    --shell-line: #34343a;
    --shell-text: #ededf0;
    --shell-muted: #9a9aa4;
    --shell-dim: #6f6f7a;
    --shell-hover: #2b2b31;
    --shell-dot: #2a2a30;
  }
  :root[data-theme="light"] {
    --shell-active: #101010;
    --shell: #eceef1;
    --shell-2: #f7f8fa;
    --shell-line: #d3d7de;
    --shell-text: #1b1e24;
    --shell-muted: #5c636f;
    --shell-dim: #858d9a;
    --shell-hover: #e2e5ea;
    --shell-dot: #d7dbe2;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    background: var(--shell);
    color: var(--shell-text);
    font-family: var(--chrome-font);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    padding: 10px 16px;
    background: var(--shell-2);
    border-bottom: 1px solid var(--shell-line);
    flex: none;
  }
  .brand {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--shell-muted);
    white-space: nowrap;
  }
  .group { display: flex; align-items: center; gap: 2px; }
  .group[data-role="routes"] { flex: 1 1 auto; }
  button.chip {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--shell-muted);
    font: inherit;
    font-size: 13px;
    padding: 7px 12px;
    border-radius: 7px;
    cursor: pointer;
    white-space: nowrap;
  }
  button.chip:hover { background: var(--shell-hover); color: var(--shell-text); }
  button.chip[aria-pressed="true"] { background: var(--shell-active); color: var(--shell-2); }
  button.chip:focus-visible { outline: 2px solid var(--shell-active); outline-offset: 2px; }
  .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--shell-dim);
    margin-right: 6px;
  }

  .stage {
    flex: 1;
    overflow: hidden;
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background:
      radial-gradient(circle at 1px 1px, var(--shell-dot) 1px, transparent 0) 0 0 / 22px 22px,
      var(--shell);
  }
  .holder {
    overflow: hidden;
    border: 1px solid var(--shell-line);
    border-radius: 10px;
    /* Matches the previewed page so the scrollbar gutter never shows through. */
    background: var(--frame-bg, #f1f1f1);
    box-shadow: 0 24px 70px rgb(16 18 24 / 0.22);
    flex: none;
  }
  .device { transform-origin: top left; }
  .device iframe { display: block; border: 0; width: 100%; height: 100%; }

  .toast {
    position: fixed;
    left: 50%;
    bottom: 22px;
    transform: translateX(-50%) translateY(8px);
    background: var(--shell-2);
    border: 1px solid var(--shell-line);
    color: var(--shell-text);
    font-size: 13px;
    padding: 10px 16px;
    border-radius: 8px;
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s, transform .2s;
  }
  .toast[data-show="true"] { opacity: 1; transform: translateX(-50%) translateY(0); }

  @media (prefers-reduced-motion: reduce) { .toast { transition: none; } }
</style>

<div class="bar">
  <span class="brand">miguelpedroso.com</span>
  <div class="group" data-role="routes" id="routes"></div>
  <div class="group"><span class="label">Width</span><span id="widths"></span></div>
  <div class="group"><button class="chip" id="theme">Dark</button></div>
</div>

<div class="stage" id="stage">
  <div class="holder" id="holder">
    <div class="device" id="device"><iframe id="frame" title="Site preview"></iframe></div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const PAGES = ${JSON.stringify(pages).replace(/<\/script>/gi, "<\\/script>")};
const IMAGES = ${JSON.stringify(images)};
const CSS = ${JSON.stringify(esc(css))};
const ROUTES = ${JSON.stringify(ROUTES)};
const WIDTHS = [
  { label: "Desktop", w: 1440 },
  { label: "Laptop", w: 1180 },
  { label: "Tablet", w: 834 },
  { label: "Mobile", w: 390 },
];

let route = "/";
let width = WIDTHS[0];
function currentTheme() {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "dark" || set === "light") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
let theme = currentTheme();

const frame = document.getElementById("frame");
const device = document.getElementById("device");
const holder = document.getElementById("holder");
const stage = document.getElementById("stage");
const toastEl = document.getElementById("toast");

function chip(text, pressed, onClick) {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = text;
  b.setAttribute("aria-pressed", String(pressed));
  b.addEventListener("click", onClick);
  return b;
}

function renderBar() {
  const routes = document.getElementById("routes");
  routes.replaceChildren(
    ...ROUTES.map((r) => chip(r.label, r.path === route, () => { route = r.path; render(); }))
  );
  const widths = document.getElementById("widths");
  widths.replaceChildren(
    ...WIDTHS.map((w) => chip(w.label, w.label === width.label, () => { width = w; render(); }))
  );
  document.getElementById("theme").textContent = theme === "dark" ? "Theme: Dark" : "Theme: Light";
}

function buildDoc() {
  let body = PAGES[route] || PAGES["/"];
  body = body.replace(/src="([^"]+)"/g, (m, src) => IMAGES[src] ? 'src="' + IMAGES[src] + '"' : m);
  return "<!doctype html><html lang=\\"en\\" data-theme=\\"" + theme + "\\"><head>" +
    "<meta charset=\\"utf-8\\"><meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\">" +
    "<style>" + CSS + "</style></head><body>" + body + "</body></html>";
}

/* The frame is the real device width, scaled to fit, and exactly as tall as the
   stage. Only the page inside ever scrolls. */
function fit() {
  const availW = stage.clientWidth - 48;
  const availH = stage.clientHeight - 48;
  const scale = Math.min(1, availW / width.w);
  const innerH = Math.round(availH / scale);
  holder.style.width = Math.round(width.w * scale) + "px";
  holder.style.height = availH + "px";
  device.style.width = width.w + "px";
  device.style.height = innerH + "px";
  device.style.transform = "scale(" + scale + ")";
}

/* Wired from here rather than from a script inside the frame: srcdoc inherits
   this document's origin, so the nodes are directly reachable, and no inline
   script has to survive a content policy. */
function wireFrame() {
  const doc = frame.contentDocument;
  if (!doc) return;

  doc.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("mailto:") || a.target === "_blank") return;
    e.preventDefault();
    if (!href.startsWith("/")) return;
    if (PAGES[href]) { route = href; render(); }
    else toast("That page is not part of this preview.");
  });

  const themeBtn = doc.querySelector('button[aria-label^="Switch to"]');
  if (themeBtn) themeBtn.addEventListener("click", flipTheme);

  const menuBtn = doc.querySelector('button[aria-label="Open menu"]');
  if (menuBtn) menuBtn.addEventListener("click", () => {
    toast("The mobile menu needs the running app. Use the tabs above to move around.");
  });

  const form = doc.querySelector("form");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("The contact form needs the running app. This is a static preview.");
  });
}

function render() {
  document.documentElement.style.setProperty(
    "--frame-bg",
    theme === "dark" ? "#101010" : "#f1f1f1",
  );
  renderBar();
  frame.addEventListener("load", wireFrame, { once: true });
  frame.srcdoc = buildDoc();
  fit();
}

let toastTimer;
function toast(text) {
  toastEl.textContent = text;
  toastEl.dataset.show = "true";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.dataset.show = "false"; }, 3600);
}

function flipTheme() {
  document.documentElement.setAttribute(
    "data-theme",
    currentTheme() === "dark" ? "light" : "dark",
  );
}
document.getElementById("theme").addEventListener("click", flipTheme);

/* One source of truth: whoever flips the root, the preview follows. */
new MutationObserver(() => {
  const next = currentTheme();
  if (next !== theme) { theme = next; render(); }
}).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  const next = currentTheme();
  if (next !== theme) { theme = next; render(); }
});

addEventListener("resize", fit);
render();
</script>
`;

await writeFile(OUT, html, "utf8");
const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`Wrote ${OUT}, ${kb} KB, ${Object.keys(pages).length} routes.`);
