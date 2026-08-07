"use client";

import { motion, useReducedMotion } from "motion/react";
import { home } from "@/content/site";
import { FluidParticlesBackground } from "@/components/ui/FluidParticlesBackground";

/**
 * Centred, one screen tall. Motion is a single staggered entry: it sets the
 * reading order, status then promise then detail, on first paint only.
 */
export function Hero() {
  const reduce = useReducedMotion();

  const rise = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.75,
      delay: reduce ? 0 : 0.06 + i * 0.09,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    /* svh rather than vh: on mobile the browser chrome collapses as you scroll,
       and vh would make the hero grow mid-gesture. The subtraction accounts for
       the floating navigation, so the section fills exactly one screen. */
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden py-16 text-center md:min-h-[calc(100svh-5rem)]">
      <FluidParticlesBackground />

      <div className="shell relative flex flex-col items-center">
        <motion.p
          {...rise(0)}
          className="inline-flex items-center gap-2.5 rounded-pill border border-line-strong px-3.5 py-1.5 text-[0.8125rem] text-muted"
        >
          <span className="pulse-dot" aria-hidden />
          {home.availability}
        </motion.p>

        <motion.h1
          {...rise(1)}
          className="display mt-8 max-w-[20ch] text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem]"
        >
          {home.headline}
        </motion.h1>

        <motion.p
          {...rise(2)}
          className="lede mt-6 max-w-[46ch] text-[1.0625rem] md:text-lg"
        >
          {home.subhead}
        </motion.p>
      </div>
    </section>
  );
}
