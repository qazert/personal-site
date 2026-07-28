/**
 * Exercises the interactive parts that a screenshot cannot prove: theme toggle,
 * mobile menu, FAQ accordion, and the contact form's validation and error path.
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

/* FAQ accordion. Selected structurally so copy changes do not break the test. */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 800 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  const panels = page.locator("h3 > button[aria-expanded]");
  const count = await panels.count();
  check("FAQ renders its questions", count >= 3, `${count} found`);

  const first = panels.nth(0);
  const second = panels.nth(1);
  await second.scrollIntoViewIfNeeded();

  check("first FAQ starts open", (await first.getAttribute("aria-expanded")) === "true");
  check("second FAQ starts collapsed", (await second.getAttribute("aria-expanded")) === "false");

  await second.click();
  await page.waitForTimeout(500);
  check("FAQ expands on click", (await second.getAttribute("aria-expanded")) === "true");
  check(
    "opening one FAQ closes the other",
    (await first.getAttribute("aria-expanded")) === "false",
  );

  await second.click();
  await page.waitForTimeout(500);
  check("clicking again collapses it", (await second.getAttribute("aria-expanded")) === "false");
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
