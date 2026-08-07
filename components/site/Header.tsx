"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, MoonStars, Sun, X } from "@phosphor-icons/react";
import { nav } from "@/content/site";
import { Button } from "@/components/ui/Button";

/* The theme lives on <html>, written by ThemeScript before first paint. This
   subscribes to that attribute rather than keeping a second copy in state. */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.dataset.theme ?? "light",
    () => null, // unknown during SSR
  );

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    const apply = () => {
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
    };

    /* A view transition cross-fades a snapshot of the old page against the new
       one. Transitioning the colours themselves cannot work here: text and
       background swap values, so they meet at the same grey halfway through and
       the words vanish for a moment. Fading whole renderings never crosses.

       Where the API is missing, the swap is instant. That is plainer than the
       cross-fade but it is never broken. */
    const startViewTransition = document.startViewTransition?.bind(document);
    if (
      !startViewTransition ||
      !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    ) {
      apply();
      return;
    }

    startViewTransition(apply);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className={`grid size-10 shrink-0 place-items-center rounded-pill text-muted md:size-9 transition-colors duration-200 hover:bg-accent-soft hover:text-text ${className}`}
    >
      {/* Renders nothing until the client knows the real theme, which keeps
          the icon from contradicting the page on first paint. */}
      {theme === "dark" ? (
        <Sun weight="regular" className="size-[1.05rem]" />
      ) : theme === "light" ? (
        <MoonStars weight="regular" className="size-[1.05rem]" />
      ) : (
        <span className="size-[1.05rem]" />
      )}
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  /* The menu is open only while the route it was opened on is still current, so
     navigating closes it without an effect watching the pathname. */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = useCallback(
    (next: boolean) => setOpenedOn(next ? pathname : null),
    [pathname],
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    /* layoutScroll is what stops the fill flying in from mid-page. Motion
       records layout in document coordinates, adding the page's scroll offset,
       which is wrong for a fixed bar: it holds its place on screen while its
       document position moves with the scroll. Navigating from 2000px down, the
       fill was snapshotted 2000px below where it was drawn, so it animated up
       from there. Motion only looks for a fixed scroll root on nodes carrying
       this flag, and the fixed element is the header, not the bar inside it. */
    <motion.header
      layoutScroll
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 md:pt-5"
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-center gap-4 max-md:justify-end">
        {/* Floating glass bar. Sits over the page rather than pushing it down,
            so what scrolls underneath stays partly visible through it. */}
        <nav
          aria-label="Main"
          className="glass pointer-events-auto hidden rounded-pill p-1 md:flex md:items-center md:gap-0.5"
        >
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-pill px-4 py-2 text-[0.9375rem] tracking-[-0.011em] transition-colors duration-200 ${
                  active ? "text-accent-fg" : "text-muted hover:text-text"
                }`}
              >
                {/* One element shared across the items: Motion measures it in
                    both places and animates the difference, so the fill travels
                    to the new page instead of blinking onto it. */}
                {active ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-pill bg-accent"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 36, mass: 0.9 }
                    }
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          <ThemeToggle />
        </nav>

        {/* Mobile: the same material, holding just the controls. */}
        <div className="glass pointer-events-auto flex items-center gap-0.5 rounded-pill p-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-pill text-text transition-colors duration-200 hover:bg-accent-soft"
          >
            <List weight="regular" className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="pointer-events-auto fixed inset-0 z-50 bg-bg md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-16 items-center justify-end px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-pill text-text transition-colors duration-200 hover:bg-accent-soft"
              >
                <X weight="regular" className="size-5" />
              </button>
            </div>

            <div className="flex flex-col px-6 pt-6">
              <nav aria-label="Mobile" className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      className="block border-b border-line py-5 text-2xl font-medium tracking-[-0.03em]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <Button
                href="/contact"
                size="lg"
                className="mt-8 w-full"
                withArrow
              >
                Get in touch
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
