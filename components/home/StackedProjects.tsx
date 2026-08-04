"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { home, workItems, cta, type WorkItem } from "@/content/site";

const SHOWN = 3;

/** How far back each card sits once the whole stack has passed. */
const SCALE_STEP = 0.05;
const TILT = [-3.5, 2.5, 0];

type CardProps = {
  item: WorkItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  priority: boolean;
};

function Card({ item, index, total, progress, priority }: CardProps) {
  const reduce = useReducedMotion();

  /* The card starts receding only once the next one begins to cover it, and
     lands at its final depth when the stack is complete.

     Reduced motion collapses the output range rather than the markup: the tree
     has to be identical on the server and on the client, or hydration breaks.
     At progress 0 both ranges give scale 1 and rotate 0, so the first paint
     matches either way. */
  const enter = index / total;
  const targetScale = reduce ? 1 : 1 - (total - 1 - index) * SCALE_STEP;
  const targetRotate = reduce ? 0 : (TILT[index] ?? 0);

  const scale = useTransform(progress, [enter, 1], [1, targetScale]);
  const rotate = useTransform(progress, [enter, 1], [0, targetRotate]);

  return (
    <div className="stack-slot px-4">
      <motion.article
        style={{ scale, rotate, top: `${index * 18}px` }}
        className="relative w-full max-w-[62rem] origin-top will-change-transform"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-line bg-surface-2 shadow-lift sm:aspect-[16/11] lg:aspect-[16/9]">
          <Image
            src={item.cover}
            alt={item.coverAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 62rem, 100vw"
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
    </div>
  );
}

export function StackedProjects() {
  const container = useRef<HTMLDivElement>(null);
  const items = workItems.slice(0, SHOWN);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section className="border-t border-line pt-16 md:pt-24">
      <div className="shell">
        <h2 className="display-sm text-[2rem] md:text-[2.75rem]">
          {home.projects.heading}
        </h2>
      </div>

      <div ref={container} className="relative mt-8">
        {items.map((item, i) => (
          <Card
            key={item.slug}
            item={item}
            index={i}
            total={items.length}
            progress={scrollYProgress}
            priority={i === 0}
          />
        ))}
      </div>

      <div className="shell pb-20 pt-10 md:pb-28 md:pt-14">
        <Link
          href={cta.secondary.href}
          className="group inline-flex min-h-12 items-center gap-2 rounded-pill bg-accent px-6 text-[0.9375rem] font-medium text-accent-fg transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-px"
        >
          {home.projects.link}
          <ArrowRight
            weight="bold"
            aria-hidden
            className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
