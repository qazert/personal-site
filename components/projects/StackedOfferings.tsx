"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { services, type ServiceOffering } from "@/content/site";

/* Same pinned-stack mechanics as the home page's Selected projects, adapted
   for text cards instead of image ones: a fixed height standing in for the
   aspect-ratio crop, and a card face built from the Services page's own
   offering markup rather than a photo. If this sticks, the shared math
   between the two is worth pulling into one component; duplicated for now
   since this is still a "let's see how it reads" pass. */

const SHOWN = services.offerings.length;

const SCALE_STEP = 0.035;
const LIFT_STEP = 12;
const TILT_STEP = 1.3;
const MAX_DEPTH = SHOWN - 1;

type CardProps = {
  item: ServiceOffering;
  index: number;
  arrived: MotionValue<number>;
  travel: MotionValue<number>;
};

function Card({ item, index, arrived, travel }: CardProps) {
  const reduce = useReducedMotion();

  const depth = (a: number) =>
    reduce ? 0 : Math.min(Math.max(a - index, 0), MAX_DEPTH);

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
      <div className="flex h-full flex-col rounded-lg border border-line bg-surface p-7 shadow-lift md:p-9">
        <h3 className="text-[1.375rem] font-medium tracking-[-0.026em] md:text-2xl">
          {item.title}
        </h3>
        <p className="lede mt-3 max-w-[46ch] text-[0.9375rem] md:text-base">
          {item.summary}
        </p>

        <p className="mt-6 border-t border-line pt-5 text-[0.8125rem] text-faint">
          Includes
        </p>
        <ul className="mt-3 grid gap-2.5">
          {item.includes.map((line) => (
            <li key={line} className="flex gap-3">
              <Check
                weight="bold"
                aria-hidden
                className="mt-[0.3rem] size-3.5 shrink-0 text-accent-text"
              />
              <span className="lede text-[0.9375rem] text-text/85">
                {line}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export function StackedOfferings() {
  const container = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const travel = useMotionValue(0);
  const pace = useMotionValue(1);
  const items = services.offerings;
  const steps = items.length - 1;

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

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
          <div className="lg:self-start">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="display-sm max-w-[14ch] text-[2rem] md:text-[2.75rem]">
                  {services.headline}
                </h2>
                <p className="lede mt-4 max-w-[38ch] text-[0.9375rem] md:text-base">
                  {services.subhead}
                </p>
              </Reveal>
            </div>
            <div className="stack-runway hidden lg:block" aria-hidden />
          </div>

          <div ref={container} className="relative">
            <div ref={pin} className="stack-pin">
              <div className="stack-box-offer">
                {items.map((item, i) => (
                  <Card
                    key={item.slug}
                    item={item}
                    index={i}
                    arrived={arrived}
                    travel={travel}
                  />
                ))}
              </div>

              <Link
                href="/services"
                className="group mt-8 inline-flex min-h-10 items-center gap-2 rounded-sm text-[0.9375rem] font-medium underline decoration-line-strong underline-offset-[6px] transition-colors hover:decoration-text"
              >
                {services.link}
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
