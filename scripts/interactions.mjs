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
    await browser.newContext({ viewport: { width: 1440, height: 900 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  const cards = page.locator(".stack-card");
  check("four project cards render", (await cards.count()) === 4, `${await cards.count()} found`);

  /* Sample relative to the scroll where the pin lets go, which is the moment
     the stack has to be finished by. `null` means the container's own top,
     where nothing has arrived yet — a fixed offset back from the release would
     land mid-animation, since the step length depends on how many cards there
     are. */
  const at = (offsetFromRelease) =>
    page.evaluate(async (delta) => {
      const stack = document.querySelector(".stack");
      const container = stack.children[1];
      const group = document.querySelector(".stack-pin");
      const top = container.getBoundingClientRect().top + window.scrollY;
      const stickyTop = parseFloat(getComputedStyle(group).top) || 0;
      const release = container.offsetHeight - group.offsetHeight - stickyTop;
      window.scrollTo(0, delta === null ? top : top + release + delta);
      await new Promise((r) => setTimeout(r, 350));

      const box = document.querySelector(".stack-box").getBoundingClientRect();
      const link = [...document.querySelectorAll("a")].find((a) =>
        /See all projects/.test(a.textContent),
      );
      const heading = [...document.querySelectorAll("h2")].find((h) =>
        h.textContent.includes("Selected"),
      );
      return {
        boxTop: Math.round(box.top),
        headingTop: Math.round(heading.getBoundingClientRect().top),
        gapToLink: Math.round(link.getBoundingClientRect().top - box.bottom),
        cards: [...document.querySelectorAll(".stack-card")].map((el) => {
          const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
          return {
            top: Math.round(el.getBoundingClientRect().top),
            scale: Math.round(m.a * 1000) / 1000,
          };
        }),
      };
    }, offsetFromRelease);

  const early = await at(null);
  check(
    "cards wait off screen until their turn",
    early.cards[0].top === early.boxTop &&
      early.cards.at(-1).top > early.boxTop + 400,
    early.cards.map((c) => c.top).join(", "),
  );

  const landed = await at(0);
  check(
    "the stack finishes exactly as the pin lets go",
    landed.cards.at(-1).top === landed.boxTop,
    `front card ${landed.cards.at(-1).top} vs box ${landed.boxTop}`,
  );
  check(
    "every card is stacked behind it, none pushed off",
    landed.cards.every((c) => c.top > 0 && c.top <= landed.boxTop),
    landed.cards.map((c) => c.top).join(", "),
  );
  check(
    "each card sits a step further back than the one in front",
    landed.cards.every((c, i, all) => i === 0 || c.scale > all[i - 1].scale),
    landed.cards.map((c) => c.scale).join(", "),
  );
  check(
    "the group is still level with the heading when it lands",
    Math.abs(landed.boxTop - landed.headingTop) <= 2,
    `${landed.boxTop} vs ${landed.headingTop}`,
  );

  /* The link is anchored to the group, so it never rides over the cards. */
  for (const [label, state] of [["start", early], ["end", landed]]) {
    check(`the link sits 32px under the stack at the ${label}`, state.gapToLink === 32, `${state.gapToLink}px`);
  }

  /* Past the release both columns have to leave together. Stretched to the row,
     the heading used to outlast the cards and stay behind on its own. */
  const leaving = await at(300);
  check(
    "heading and cards leave together",
    Math.abs(leaving.boxTop - leaving.headingTop) <= 2 && leaving.boxTop < 0,
    `${leaving.boxTop} vs ${leaving.headingTop}`,
  );

  check(
    "the stack ends with a link to the projects page",
    await page.getByRole("link", { name: /See all projects/ }).isVisible(),
  );
  await page.close();
}

/* Selected projects reads as two columns */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1440, height: 900 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < 900; y += 100) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
  });
  await page.waitForTimeout(700);

  const heading = await page.locator("h2", { hasText: "Selected projects" }).boundingBox();
  const box = await page.locator(".stack-box").boundingBox();
  check("heading sits level with the cards", Math.abs(box.y - heading.y) <= 2, `${Math.round(Math.abs(box.y - heading.y))}px apart`);
  check("heading is in the left column", heading.x < box.x, `${Math.round(heading.x)} < ${Math.round(box.x)}`);
  await page.close();
}

/* Footer reveal */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1440, height: 900 } })
  ).newPage();
  await page.goto(`${BASE}/about`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const dock = await page.evaluate(() => ({
    mode: document.documentElement.dataset.footerReveal,
    pos: getComputedStyle(document.querySelector(".footer-dock")).position,
    reserved: getComputedStyle(document.querySelector(".page-shell")).marginBottom,
    height: document.querySelector(".footer-dock").offsetHeight,
  }));
  check("the footer is docked behind the page", dock.mode === "on" && dock.pos === "fixed", dock.pos);
  check(
    "the page reserves exactly the footer's height",
    Math.abs(parseFloat(dock.reserved) - dock.height) <= 1,
    `${dock.reserved} vs ${dock.height}px`,
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const atTop = await page.evaluate(() => {
    const el = document.elementFromPoint(innerWidth / 2, innerHeight - 40);
    return el?.closest("footer") ? "footer" : "page";
  });
  check("the page covers the footer before the end", atTop === "page", atTop);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const atEnd = await page.evaluate(() => {
    const el = document.elementFromPoint(innerWidth / 2, innerHeight - 40);
    const rect = document.querySelector("footer").getBoundingClientRect();
    return { on: el?.closest("footer") ? "footer" : "page", flush: Math.abs(rect.bottom - innerHeight) <= 1 };
  });
  check("the footer is uncovered at the end", atEnd.on === "footer", atEnd.on);
  check("the reveal finishes flush with the document", atEnd.flush);
  await page.close();
}

/* Availability light */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 800 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const dot = page.locator(".pulse-dot");
  check("the availability dot is there", (await dot.count()) === 1);
  const style = await dot.evaluate((el) => ({
    bg: getComputedStyle(el).backgroundColor,
    anim: getComputedStyle(el, "::after").animationName,
  }));
  check("the dot is green", style.bg === "rgb(18, 160, 101)", style.bg);
  check("the dot pulses", style.anim === "pulse-ring", style.anim);
  check(
    "the pill reads Available for work",
    (await dot.locator("..").innerText()).trim() === "Available for work",
  );
  await page.close();
}

/* Section dividers */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 800 } })
  ).newPage();
  for (const route of ["/", "/about", "/services", "/projects"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const ruled = await page.evaluate(() =>
      [...document.querySelectorAll("main section")].filter((el) => {
        const s = getComputedStyle(el);
        return parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderBottomWidth) > 0;
      }).length,
    );
    check(`no dividers between sections on ${route}`, ruled === 0, `${ruled} ruled`);
  }
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
  // The fill lives on the shared pill inside the link, not on the link itself.
  const activeBg = await active
    .locator("span.absolute")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  check("active item is filled with ink", activeBg === "rgb(16, 16, 16)", activeBg);
  await page.close();
}

/* The active pill travels between nav items */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1440, height: 900 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const pill = page.locator("nav[aria-label='Main'] a[aria-current='page'] span.absolute");
  const from = await pill.boundingBox();
  await page.getByRole("link", { name: "About", exact: true }).click();
  await page.waitForTimeout(120);
  const midFlight = await pill.boundingBox();
  await page.waitForTimeout(900);
  const to = await pill.boundingBox();

  check("the pill moves to the new page", Math.abs(to.x - from.x) > 20, `${Math.round(from.x)} -> ${Math.round(to.x)}`);
  check(
    "it travels rather than jumping",
    Math.abs(midFlight.x - to.x) > 4 && Math.abs(midFlight.x - from.x) > 4,
    `mid ${Math.round(midFlight.x)}`,
  );

  /* Navigating from partway down the page used to throw the pill in from the
     middle of the screen: Motion measures layout in document coordinates, so a
     fixed bar looks to it like it moves with the scroll. It has to stay in the
     bar whatever the scroll position is. */
  for (const y of [1200, 3000]) {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.evaluate(async (to) => {
      for (let s = 0; s <= to; s += 250) {
        window.scrollTo(0, s);
        await new Promise((r) => setTimeout(r, 30));
      }
    }, y);
    await page.waitForTimeout(300);

    const resting = (await pill.boundingBox()).y;
    await page.getByRole("link", { name: "Projects", exact: true }).click();

    let drift = 0;
    for (let i = 0; i < 14; i++) {
      const box = await pill.boundingBox();
      if (box) drift = Math.max(drift, Math.abs(box.y - resting));
      await page.waitForTimeout(35);
    }
    check(
      `the pill stays in the bar when navigating from ${y}px down`,
      drift <= 2,
      `${Math.round(drift)}px off`,
    );
  }
  await page.close();
}

/* The theme cross-fades instead of cutting */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 800 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  const supported = await page.evaluate(() => typeof document.startViewTransition === "function");
  check("the browser can cross-fade the swap", supported);

  const lum = (c) => {
    const [r, g, bl] = c.match(/\d+/g).slice(0, 3).map((v) => {
      const x = Number(v) / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };

  await page.getByRole("button", { name: /Switch to/ }).click();
  /* Mid-swap: with the colours themselves animating, text and background used
     to meet at the same grey here and the words vanished. */
  await page.waitForTimeout(180);
  const mid = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return {
      text: getComputedStyle(h1).color,
      bg: getComputedStyle(document.querySelector(".page-shell")).backgroundColor,
    };
  });
  const a = lum(mid.text) + 0.05;
  const b = lum(mid.bg) + 0.05;
  const contrast = Math.max(a, b) / Math.min(a, b);
  check(
    "text stays readable throughout the swap",
    contrast > 4,
    `${contrast.toFixed(1)}:1 mid-swap`,
  );

  await page.waitForTimeout(700);
  const settled = await page.evaluate(() => document.documentElement.dataset.theme);
  check("the swap completes", settled === "dark" || settled === "light", settled);
  await page.close();
}

/* Hero */
{
  const page = await (
    await browser.newContext({ viewport: { width: 1440, height: 900 } })
  ).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1300);

  const hero = page.locator("main section").first();
  const box = await hero.boundingBox();
  check("the hero fills one screen", Math.abs(box.height - (900 - 80)) <= 2, `${Math.round(box.height)}px`);
  check("no image or button left in the hero", (await hero.locator("img, a, button").count()) === 0);
  check("the hero is centred", (await hero.evaluate((el) => getComputedStyle(el).textAlign)) === "center");

  const lines = await page.locator("h1").evaluate((el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    return new Set([...r.getClientRects()].filter((x) => x.width > 1).map((x) => Math.round(x.top))).size;
  });
  check("the headline holds two lines", lines === 2, `${lines} lines`);
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
