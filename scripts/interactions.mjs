/**
 * Exercises the interactive parts that a screenshot cannot prove: theme toggle,
 * mobile menu, project stack, and the contact form's validation and error path.
 *
 *   node scripts/interactions.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://127.0.0.1:3100";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});

let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "pass" : "FAIL"}  ${name}${extra ? `  ${extra}` : ""}`);
  if (!ok) failed++;
};

/* Theme toggle, desktop */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 800 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.getByRole("button", { name: /Switch to (light|dark) theme/ }).click();
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  check("theme toggle flips the theme", before !== after, `${before} -> ${after}`);

  const stored = await page.evaluate(() => localStorage.getItem("theme"));
  check("theme choice persists", stored === after);

  await page.reload({ waitUntil: "networkidle" });
  const afterReload = await page.evaluate(
    () => document.documentElement.dataset.theme,
  );
  check("theme survives reload", afterReload === after);

  const label = await page
    .getByRole("button", { name: /Switch to (light|dark) theme/ })
    .getAttribute("aria-label");
  check(
    "toggle label matches current theme",
    after === "dark" ? /light/.test(label) : /dark/.test(label),
    label,
  );
  await page.close();
}

/* Scroll-driven project stack on the home page */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 800 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  const cards = page.locator("section:has(h2) article.origin-top");
  const count = await cards.count();
  check("three project cards render", count === 3, `${count} found`);

  const readScale = async (i) =>
    cards.nth(i).evaluate((el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return Math.round(m.a * 1000) / 1000;
    });

  check("first card starts unscaled", (await readScale(0)) === 1, String(await readScale(0)));

  // Scroll to the end of the stack so the earlier cards have receded.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.5;
    for (let y = 0; y < window.innerHeight * 3.2; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    await new Promise((r) => setTimeout(r, 400));
  });

  const first = await readScale(0);
  const last = await readScale(2);
  check("first card scales down behind the stack", first < 0.96 && first > 0.85, String(first));
  check("last card stays at full size", last > 0.99, String(last));

  const rotated = await cards.nth(0).evaluate((el) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return Math.abs(Math.round(Math.atan2(m.b, m.a) * (180 / Math.PI) * 10) / 10);
  });
  check("first card tilts", rotated > 1, `${rotated}deg`);

  check(
    "the stack ends with a link to the projects page",
    await page.getByRole("link", { name: /See all projects/ }).isVisible(),
  );
  await page.close();
}

/* Frosted navigation */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 800 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  const bar = page.locator("nav[aria-label='Main']");
  const style = await bar.evaluate((el) => {
    const s = getComputedStyle(el);
    return { filter: s.backdropFilter || s.webkitBackdropFilter, bg: s.backgroundColor, pos: getComputedStyle(el.closest("header")).position };
  });
  check("nav bar is frosted", /blur/.test(style.filter), style.filter);
  check("nav bar is translucent", /0\.5\)|0\.55\)/.test(style.bg), style.bg);
  check("header floats over the page", style.pos === "fixed", style.pos);

  const active = page.locator("nav[aria-label='Main'] a[aria-current='page']");
  check("current page is marked", (await active.count()) === 1, await active.innerText());
  const activeBg = await active.evaluate((el) => getComputedStyle(el).backgroundColor);
  check("active item is filled with ink", activeBg === "rgb(16, 16, 16)", activeBg);
  await page.close();
}

/* Mobile menu */
{
  const page = await (
    await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(400);
  check("mobile menu opens", await page.getByRole("button", { name: "Close menu" }).isVisible());
  check(
    "body scroll locked while menu is open",
    (await page.evaluate(() => document.body.style.overflow)) === "hidden",
  );

  await page.getByRole("navigation", { name: "Mobile" }).getByText("Services").click();
  await page.waitForURL("**/services");
  await page.waitForTimeout(400);
  check("menu closes after navigating", (await page.getByRole("button", { name: "Close menu" }).count()) === 0);
  check(
    "body scroll restored",
    (await page.evaluate(() => document.body.style.overflow)) === "",
  );
  await page.close();
}

/* Footer: inverted ground, and the signature spanning it exactly */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 800 } })
  ).newPage();
  await page.goto(`${BASE}/about`, { waitUntil: "networkidle" });
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const footerBg = await page
    .locator("footer")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  check("footer inverts the page", footerBg === "rgb(16, 16, 16)", footerBg);

  const sig = page.locator(".footer-signature");
  const fit = await sig.evaluate((el) => {
    const span = el.firstElementChild;
    const range = document.createRange();
    range.selectNodeContents(span);
    const textW = range.getBoundingClientRect().width;
    const boxW = el.getBoundingClientRect().width;
    return { pct: +((textW / boxW) * 100).toFixed(1), colour: getComputedStyle(span).color };
  });
  check(
    "signature spans the footer width",
    fit.pct > 96 && fit.pct <= 100.5,
    `${fit.pct}%`,
  );
  check("signature is full black on the ink ground", fit.colour === "rgb(0, 0, 0)", fit.colour);

  const cropped = await sig.evaluate((el) => {
    const span = el.firstElementChild;
    return span.getBoundingClientRect().height > el.getBoundingClientRect().height + 4;
  });
  check("signature is cropped by the page edge", cropped);

  const pagesCol = await page.getByRole("heading", { name: "Pages" }).count();
  check("the Pages column is gone", pagesCol === 0);
  check(
    "Find me lists LinkedIn and Instagram",
    (await page.getByRole("heading", { name: "Find me" }).count()) === 1 &&
      (await page.locator("footer a", { hasText: "Instagram" }).count()) === 1,
  );
  await page.close();
}

/* Typeface */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 800 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const family = await page
    .locator("h1")
    .evaluate((el) => getComputedStyle(el).fontFamily);
  check("Open Sans is the page typeface", /Open Sans/.test(family), family);
  const loaded = await page.evaluate(() =>
    document.fonts.check('700 100px "Open Sans Variable"'),
  );
  check("the bold weight is loaded, not synthesised", loaded);

  const wordmark = await page.locator("header").innerText();
  check("no wordmark in the header", !/Miguel/i.test(wordmark), JSON.stringify(wordmark.trim().slice(0, 40)));
  await page.close();
}

/* Contact form: validation, then the not-configured error path */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 900 } })
  ).newPage();
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Send message" }).click();
  await page.waitForTimeout(300);
  check("empty submit shows a name error", await page.getByText("Please add your name.").isVisible());
  check(
    "empty submit shows a message error",
    await page.getByText("A couple of sentences helps me give a useful reply.").isVisible(),
  );

  await page.getByLabel("Name").fill("Ana Salgueiro");
  await page.getByLabel("Email").fill("not-an-email");
  await page
    .getByLabel("What are you working on?")
    .fill("We have a scheduling product and the onboarding flow loses most trials in week one.");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.waitForTimeout(300);
  check(
    "invalid email is rejected",
    await page.getByText("That email address does not look right.").isVisible(),
  );

  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.waitForTimeout(1200);
  const alert = page.locator("form [role=alert]");
  check(
    "unconfigured endpoint surfaces an error, not a fake success",
    await alert.isVisible(),
  );
  check(
    "error offers the mailto fallback",
    (await alert.innerText()).includes("@"),
  );
  await page.close();
}

await browser.close();
console.log(failed === 0 ? "\nAll interaction checks passed." : `\n${failed} check(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
