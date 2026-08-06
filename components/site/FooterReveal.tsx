"use client";

import { useEffect, useRef } from "react";

/**
 * Docks the footer behind the page so the last section slides up off it as you
 * reach the bottom. The page carries a solid background and sits a layer above;
 * the space it reserves underneath is exactly the footer's height, so the
 * reveal finishes flush with the end of the document.
 *
 * Two conditions send it back to ordinary flow: a footer taller than the
 * viewport, which would leave its top unreachable, and a stated preference for
 * reduced motion.
 */
export function FooterReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dock = ref.current;
    if (!dock) return;

    const root = document.documentElement;
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");

    const measure = () => {
      const height = dock.offsetHeight;
      const fits = height <= window.innerHeight * 0.9;
      root.style.setProperty("--footer-h", `${height}px`);
      root.dataset.footerReveal = fits && motionOk.matches ? "on" : "off";
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(dock);
    window.addEventListener("resize", measure);
    motionOk.addEventListener("change", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      motionOk.removeEventListener("change", measure);
      delete root.dataset.footerReveal;
      root.style.removeProperty("--footer-h");
    };
  }, []);

  return (
    <div ref={ref} className="footer-dock">
      {children}
    </div>
  );
}
