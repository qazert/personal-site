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

const SHOWN = 4;

/** Applied per card stacked on top of this one. */
const SCALE_STEP = 0.035;
const LIFT_STEP = 12;
const TILT_STEP = 1.3;
const MAX_DEPTH = SHOWN - 1;

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
  const pin = useRef<HTMLDivElement>(null);
  const travel = useMotionValue(0);
  const pace = useMotionValue(1);
  const items = workItems.slice(0, SHOWN);
  const steps = items.length - 1;

  /* Measured to the container's far edge rather than to the viewport, because
     the pin outlives "end end" and the progress would otherwise saturate while
     the group is still parked. */
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  /* One value drives every card: how many have arrived so far. `pace` stretches
     the raw progress so the last card lands on the exact scroll where the pin
     lets go, leaving no dead stretch between the stack finishing and the
     section ending. */
  const arrived = useTransform([scrollYProgress, pace], ([p, f]: number[]) =>
    Math.min(Math.max(p * f * steps, 0), steps),
  );

  useEffect(() => {
    const measure = () => {
      travel.set(window.innerHeight);

      const box = container.current;
      const group = pin.current;
      if (!box || !group) return;
      const top = parseFloat(getComputedStyle(group).top) || 0;
      const pinned = box.offsetHeight - group.offsetHeight - top;
      pace.set(pinned > 0 ? box.offsetHeight / pinned : 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (container.current) observer.observe(container.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [travel, pace]);

  return (
    <section>
      <div className="shell py-20 md:py-28">
        <div
          className="stack grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"
          style={{ "--stack-steps": steps } as React.CSSProperties}
        >
          {/* The heading carries the same runway as the cards, and the column
              is not stretched, so its sticky range ends on the same scroll as
              theirs. Stretched to the row it outlasted them and stayed behind
              while the stack left. Sticky also cannot live on the reveal
              itself, since Motion's transform would become its containing
              block. */}
          <div className="lg:self-start">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="display-sm max-w-[10ch] text-[2rem] md:text-[2.75rem]">
                  {home.projects.heading}
                </h2>
              </Reveal>
            </div>
            <div className="stack-runway hidden lg:block" aria-hidden />
          </div>

          {/* One pinned element rather than one per card. A slot per card gave
              the last one no travel at all: it reached the line and kept going,
              carrying the link up over the cards behind it. Pinning the group
              holds it level with the heading, and because the pin ends at the
              container's own bottom there is no dead screen afterwards. */}
          <div ref={container} className="relative">
            <div ref={pin} className="stack-pin">
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
