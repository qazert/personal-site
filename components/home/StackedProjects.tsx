"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { home, workItems, cta, type WorkItem } from "@/content/site";

const SHOWN = 5;

/** Scroll left over once the last card has landed, as a share of one step. */
const DWELL = 0.6;

/** Applied per card stacked on top of this one. */
const SCALE_STEP = 0.035;
const LIFT_STEP = 12;
const TILT_STEP = 1.3;
const MAX_DEPTH = 4;

type CardProps = {
  item: WorkItem;
  index: number;
  /** Continuous count of cards that have arrived. */
  arrived: MotionValue<number>;
  /** Viewport height, as a value so measuring it re-runs the transforms. */
  travel: MotionValue<number>;
  priority: boolean;
};

function Card({ item, index, arrived, travel, priority }: CardProps) {
  const reduce = useReducedMotion();

  /* Depth is how many cards are stacked on top of this one, and every property
     reads off it. Reduced motion collapses the output rather than the markup,
     because the tree has to match between server and client. */
  const depth = (a: number) =>
    reduce ? 0 : Math.min(Math.max(a - index, 0), MAX_DEPTH);

  /* A card waits one screen below its place, then rides up over its own step.

     The distance is a motion value rather than a ref: on first paint nothing
     has scrolled, so a ref written in an effect would never be read again and
     every card would sit at rest on top of the first one. */
  const y = useTransform([arrived, travel], ([a, t]: number[]) => {
    const settled = -depth(a) * LIFT_STEP;
    if (reduce || index === 0) return settled;
    const entered = Math.min(Math.max(a - (index - 1), 0), 1);
    return (1 - entered) * t + settled;
  });
  const scale = useTransform(arrived, (a) => 1 - depth(a) * SCALE_STEP);
  const rotate = useTransform(
    arrived,
    (a) => (index % 2 === 0 ? -1 : 1) * Math.min(depth(a), 3) * TILT_STEP,
  );

  return (
    <motion.article
      style={{ y, scale, rotate }}
      className="stack-card origin-top will-change-transform"
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg border border-line bg-surface-2 shadow-lift">
        <Image
          src={item.cover}
          alt={item.coverAlt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover"
        />

        {/* Scrim only where type sits, so the image is not flattened. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
        />

        <span className="glass absolute left-5 top-5 rounded-pill px-3.5 py-1.5 text-[0.8125rem] font-medium text-text md:left-7 md:top-7">
          {item.client}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 lg:p-10">
          <p className="text-[0.8125rem] text-white/70">
            {item.discipline}
            <span className="mx-2" aria-hidden>
              /
            </span>
            {item.year}
          </p>
          <h3 className="display-sm mt-2 max-w-[20ch] text-[1.5rem] text-white md:text-[2rem] lg:text-[2.25rem]">
            {item.title}
          </h3>
          <p className="mt-3 hidden max-w-[52ch] text-[0.9375rem] leading-[1.55] text-white/80 sm:block">
            {item.summary}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function StackedProjects() {
  const container = useRef<HTMLDivElement>(null);
  const travel = useMotionValue(0);
  const items = workItems.slice(0, SHOWN);
  const steps = items.length - 1 + DWELL;

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  /* One value drives every card: how many have arrived so far. Capped at the
     last card, so the pause at the end holds the finished stack rather than
     letting the front card carry on receding into it. */
  const arrived = useTransform(scrollYProgress, (p) =>
    Math.min(p * steps, items.length - 1),
  );

  useEffect(() => {
    const measure = () => travel.set(window.innerHeight);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [travel]);

  return (
    <section>
      <div className="shell py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          {/* Plain wrapper, then the reveal inside it: sticky cannot live on an
              element Motion transforms, and the grid item has to stay stretched
              for the heading to have any travel. */}
          <div>
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="display-sm max-w-[10ch] text-[2rem] md:text-[2.75rem]">
                  {home.projects.heading}
                </h2>
              </Reveal>
            </div>
          </div>

          {/* One pinned element rather than one per card. A slot per card gave
              the last one no travel at all: it reached the line and kept going,
              carrying the link up over the cards behind it. Pinning the group
              holds it level with the heading, and because the pin ends at the
              container's own bottom there is no dead screen afterwards. */}
          <div
            ref={container}
            className="stack relative"
            style={{ "--stack-steps": steps } as React.CSSProperties}
          >
            <div className="stack-pin">
              <div className="stack-box">
                {items.map((item, i) => (
                  <Card
                    key={item.slug}
                    item={item}
                    index={i}
                    arrived={arrived}
                    travel={travel}
                    priority={i === 0}
                  />
                ))}
              </div>

              <Link
                href={cta.secondary.href}
                className="group mt-8 inline-flex min-h-10 items-center gap-2 rounded-sm text-[0.9375rem] font-medium underline decoration-line-strong underline-offset-[6px] transition-colors hover:decoration-text"
              >
                {home.projects.link}
                <ArrowRight
                  weight="bold"
                  aria-hidden
                  className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="stack-runway" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
