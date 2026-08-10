/**
 * Screenshots every route at desktop and mobile in both themes, and audits each
 * one for horizontal overflow, CTA label wrapping and touch-target size.
 *
 *   node scripts/shots.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const OUT = process.env.SHOT_DIR ?? "/tmp/shots";

const ROUTES = [
  ["home", "/"],
  ["projects", "/projects"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["not-found", "/this-page-is-missing"],
];

const VIEWPORTS = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
];

/* Runs in the page. Reports layout defects rather than eyeballing them. */
function audit() {
  const problems = [];
  const de = document.documentElement;
  const vw = de.clientWidth;

  if (de.scrollWidth > vw + 1) {
    problems.push({
      kind: "page-overflow",
      detail: `scrollWidth ${de.scrollWidth} > viewport ${vw}`,
    });
  }

  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls =
      typeof el.className === "string" && el.className
        ? "." + el.className.trim().split(/\s+/).slice(0, 4).join(".")
        : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 140);
  };

  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;

    // Anything sticking out past the right edge, or starting left of zero.
    if (r.right > vw + 1 || r.left < -1) {
      const style = getComputedStyle(el);
      if (style.position === "fixed") continue;
      problems.push({
        kind: "element-overflow",
        detail: `${describe(el)} spans ${Math.round(r.left)}..${Math.round(r.right)}`,
      });
    }
  }

  // How many line boxes the element's own text actually occupies.
  const textLines = (el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const tops = new Set();
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width > 0.5) tops.add(Math.round(rect.top / 4));
      }
    }
    return tops.size;
  };

  // CTA labels must stay on one line.
  for (const el of document.querySelectorAll("a, button")) {
    const r = el.getBoundingClientRect();
    if (r.height === 0) continue;
    const isPill = parseFloat(getComputedStyle(el).borderRadius) > 100;
    if (isPill && textLines(el) > 1) {
      problems.push({
        kind: "cta-wrap",
        detail: `${describe(el)} "${(el.textContent ?? "").trim().slice(0, 40)}"`,
      });
    }
  }

  // Touch targets. Inline links inside a paragraph are exempt, standalone
  // navigation links are not.
  if (vw < 640) {
    for (const el of document.querySelectorAll(
      "a, button, input, select, textarea",
    )) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (el.classList.contains("sr-only")) continue;
      const parent = el.parentElement;
      const inProse =
        parent && ["P", "BLOCKQUOTE", "SPAN", "FIGCAPTION"].includes(parent.tagName);
      if (inProse) continue;
      if (r.height < 40) {
        problems.push({
          kind: "small-target",
          detail: `${describe(el)} is ${Math.round(r.width)}x${Math.round(r.height)}`,
        });
      }
    }
  }

  return problems;
}

/* The container ships a Chromium build older than this Playwright pin, so point
   at it directly rather than downloading another one. */
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
await rm(OUT, { recursive: true, force: true });

let failures = 0;

for (const [device, viewport] of VIEWPORTS) {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: device === "mobile" ? 2 : 1,
      isMobile: device === "mobile",
      hasTouch: device === "mobile",
      colorScheme: theme,
      reducedMotion: "reduce", // screenshots must show the settled layout
    });

    for (const [name, route] of ROUTES) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });

      await page.goto(BASE + route, { waitUntil: "networkidle" });

      // Walk the page in viewport-sized steps so every scroll-reveal observer
      // actually fires. Jumping straight to the bottom skips the middle.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 200));
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 200));
      });
      await page.waitForTimeout(350);

      const dir = path.join(OUT, `${device}-${theme}`);
      await mkdir(dir, { recursive: true });
      await page.screenshot({
        path: path.join(dir, `${name}.png`),
        fullPage: true,
      });

      const problems = await page.evaluate(audit);
      const noisy = errors.filter(
        (e) =>
          !e.includes("favicon") &&
          // The 404 route legitimately answers 404 for its own document.
          !(name === "not-found" && e.includes("404")),
      );

      if (problems.length || noisy.length) {
        failures += problems.length + noisy.length;
        console.log(`\n[${device}/${theme}] ${route}`);
        const seen = new Set();
        for (const p of problems) {
          const key = `${p.kind}:${p.detail}`;
          if (seen.has(key)) continue;
          seen.add(key);
          console.log(`  ${p.kind.padEnd(17)} ${p.detail}`);
        }
        for (const e of noisy) console.log(`  console-error     ${e.slice(0, 160)}`);
      }

      await page.close();
    }

    await context.close();
  }
}

await browser.close();
console.log(
  failures === 0
    ? `\nNo layout defects found. Screenshots in ${OUT}`
    : `\n${failures} issue(s) reported. Screenshots in ${OUT}`,
);
