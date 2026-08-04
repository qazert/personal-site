"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, MoonStars, Sun, X } from "@phosphor-icons/react";
import { nav, site } from "@/content/site";
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
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 md:pt-5">
      {/* Three columns so the bar is optically centred regardless of the
          wordmark's width. */}
      <div className="mx-auto grid max-w-[1240px] grid-cols-[1fr_auto_1fr] items-center gap-4 max-md:grid-cols-1">
        <Link
          href="/"
          className="pointer-events-auto hidden justify-self-start rounded-sm px-1 text-[0.9375rem] font-semibold tracking-[-0.02em] text-text lg:inline-flex lg:h-11 lg:items-center"
        >
          {site.name}
        </Link>

        {/* Floating glass bar. Sits over the page rather than pushing it down,
            so what scrolls underneath stays partly visible through it. */}
        <nav
          aria-label="Main"
          className="glass pointer-events-auto col-start-2 hidden justify-self-center rounded-pill p-1 md:flex md:items-center md:gap-0.5"
        >
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-pill px-4 py-2 text-[0.9375rem] tracking-[-0.011em] transition-colors duration-200 ${
                  active
                    ? "bg-accent text-accent-fg"
                    : "text-muted hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          <ThemeToggle />
        </nav>

        {/* Mobile: the same material, holding the wordmark and the controls. */}
        <div className="glass pointer-events-auto flex w-full items-center justify-between gap-2 rounded-pill py-1 pl-4 pr-1 md:hidden">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center rounded-sm text-[0.9375rem] font-semibold tracking-[-0.02em] text-text"
          >
            {site.name}
          </Link>
          <div className="flex items-center gap-0.5">
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

        <div aria-hidden className="hidden lg:block" />
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
            <div className="flex h-16 items-center justify-between px-6">
              <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
                {site.name}
              </span>
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
    </header>
  );
}
