"use client";

import { Fragment, useEffect, useRef } from "react";
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
import { Reveal } from "@/components/ui/Reveal";
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
  /** Scroll progress at which each slot reaches the pin line, measured. */
  stops: React.RefObject<number[]>;
  priority: boolean;
  children?: React.ReactNode;
};

function Card({ item, index, total, progress, stops, priority, children }: CardProps) {
  const reduce = useReducedMotion();

  /* Reduced motion collapses the output rather than the markup: the tree has to
     be identical on the server and on the client, or hydration breaks. */
  const targetScale = reduce ? 1 : 1 - (total - 1 - index) * SCALE_STEP;
  const targetRotate = reduce ? 0 : (TILT[index] ?? 0);

  /* A card recedes between its own pin and the last card's, so the stack
     finishes settling exactly as the front card lands. Reading the measured
     stops through a ref keeps this a plain derivation with no extra state. */
  const at = (target: number) => (p: number) => {
    const from = stops.current[index] ?? 0;
    const to = stops.current[total - 1] ?? 1;
    if (to <= from) return target === 1 ? 1 : 0;
    const t = Math.min(1, Math.max(0, (p - from) / (to - from)));
    return t;
  };

  const scale = useTransform(progress, (p) => 1 + (targetScale - 1) * at(1)(p));
  const rotate = useTransform(progress, (p) => targetRotate * at(0)(p));

  return (
    <div className="stack-slot">
      <div className="w-full">
        <motion.article
          style={{ scale, rotate }}
          className="relative w-full origin-top will-change-transform"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-line bg-surface-2 shadow-lift sm:aspect-[16/11] lg:aspect-[16/9]">
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

        {/* Anything after the stack would otherwise land a viewport below the
            front card, because each slot reserves a screen of scroll. Riding
            inside the last slot keeps it 32px under the card it belongs to. */}
        {children}
      </div>
    </div>
  );
}

export function StackedProjects() {
  const container = useRef<HTMLDivElement>(null);
  const items = workItems.slice(0, SHOWN);

  /* Even spacing is only the starting guess; the real pin points come from the
     measured layout, so the mapping survives any change to the slot geometry. */
  const stops = useRef<number[]>(items.map((_, i) => i / items.length));

  /* "end start" rather than "end end": the front card pins after the container
     has already passed the bottom of the viewport, so measuring to the viewport
     bottom would saturate the progress before the stack finished. */
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const measure = () => {
      const height = el.offsetHeight;
      const first = el.firstElementChild;
      if (!height || !first) return;
      const pin = parseFloat(getComputedStyle(first).top) || 0;
      stops.current = [...el.querySelectorAll<HTMLElement>(".stack-slot")].map(
        (slot) => Math.max(0, Math.min(1, (slot.offsetTop - pin) / height)),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

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

          <div ref={container} className="stack relative">
            {items.map((item, i) => (
              <Fragment key={item.slug}>
                <Card
                  item={item}
                  index={i}
                  total={items.length}
                  progress={scrollYProgress}
                  stops={stops}
                  priority={i === 0}
                >
                  {i === items.length - 1 ? (
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
                  ) : null}
                </Card>
                {i < items.length - 1 ? (
                  <div className="stack-run" aria-hidden />
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
