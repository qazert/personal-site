"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, MoonStars, Sun, X } from "@phosphor-icons/react";
import { nav, site, cta } from "@/content/site";
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
      className={`grid size-10 shrink-0 place-items-center rounded-pill text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text ${className}`}
    >
      {/* Renders nothing until the client knows the real theme, which keeps
          the icon from contradicting the page on first paint. */}
      {theme === "dark" ? (
        <Sun weight="regular" className="size-[1.15rem]" />
      ) : theme === "light" ? (
        <MoonStars weight="regular" className="size-[1.15rem]" />
      ) : (
        <span className="size-[1.15rem]" />
      )}
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  /* The menu is open only while the route it was opened on is still current, so
     navigating closes it without an effect watching the pathname. */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = useCallback(
    (next: boolean) => setOpenedOn(next ? pathname : null),
    [pathname],
  );

  // State transition: the bar earns a surface once content sits behind it.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none";
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-line bg-bg/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-17 items-center justify-between gap-6">
        <Link
          href="/"
          className="-ml-1 inline-flex h-10 items-center rounded-sm px-1 text-[0.9375rem] font-semibold tracking-[-0.02em] text-text"
        >
          {site.name}
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 md:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-pill px-3 py-2 text-[0.9375rem] tracking-[-0.011em] transition-colors duration-200 ${
                isActive(item.href)
                  ? "text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {/* Wrapped rather than given a `hidden` utility: `hidden` and
              `inline-flex` are the same Tailwind display group, so the override
              would depend on stylesheet order. */}
          <span className="hidden md:block">
            <Button href={cta.primary.href}>{cta.primary.label}</Button>
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-pill text-text transition-colors duration-200 hover:bg-surface-2 md:hidden"
          >
            <List weight="regular" className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 bg-bg md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="shell flex h-17 items-center justify-between">
              <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
                {site.name}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-pill text-text transition-colors duration-200 hover:bg-surface-2"
              >
                <X weight="regular" className="size-5" />
              </button>
            </div>

            <div className="shell flex flex-col pt-6">
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
                href={cta.primary.href}
                size="lg"
                className="mt-8 w-full"
                withArrow
              >
                {cta.primary.label}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
