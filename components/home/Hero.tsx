"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { cta, home } from "@/content/site";

/**
 * Asymmetric split hero. Motion is a single staggered entry: it sets the
 * reading order (promise, then detail, then action) on first paint only.
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
    <section className="shell pb-16 pt-6 md:pb-24 md:pt-10">
      {/* The text column is deliberately wide: the headline has to hold two
          lines at every desktop width, not three. */}
      <div className="grid items-center gap-10 lg:grid-cols-[1.32fr_0.68fr] lg:gap-14 xl:gap-16">
        <div>
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2.5 rounded-pill border border-line-strong px-3.5 py-1.5 text-[0.8125rem] text-muted"
          >
            <span className="pulse-dot" aria-hidden />
            {home.availability}
          </motion.p>

          <motion.h1
            {...rise(1)}
            className="display mt-6 text-[2.5rem] sm:text-[3.25rem] lg:text-[3.25rem] xl:text-[3.625rem]"
          >
            {home.headline}
          </motion.h1>

          <motion.p
            {...rise(2)}
            className="lede mt-6 max-w-[46ch] text-[1.0625rem] md:text-lg"
          >
            {home.subhead}
          </motion.p>

          <motion.div
            {...rise(3)}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href={cta.primary.href} size="lg" withArrow>
              {cta.primary.label}
            </Button>
            <Button href={cta.secondary.href} size="lg" variant="secondary">
              {cta.secondary.label}
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.9,
            delay: reduce ? 0 : 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative aspect-[5/4] w-full overflow-hidden rounded-lg border border-line bg-surface-2 lg:aspect-[4/5]"
        >
          <Image
            src="/home/hero.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
