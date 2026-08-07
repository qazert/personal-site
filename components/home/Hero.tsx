"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { home } from "@/content/site";

/**
 * Centred, one screen tall. Motion is a single staggered entry: it sets the
 * reading order, status then promise then detail, on first paint only.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);

  /* The dot field's spotlight follows the pointer. Mouse only - a touch drag
     fires the same events and would otherwise drag the spotlight around
     underneath the finger, which is not what a tap is for. Written straight
     to the style property rather than through state: this runs on every
     pointer move, and the CSS transition (see --fx/--fy in globals.css) is
     already doing the easing, so there is nothing for a re-render to add. */
  const followPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    field.style.setProperty("--fx", `${e.clientX - rect.left}px`);
    field.style.setProperty("--fy", `${e.clientY - rect.top}px`);
  };

  const resetPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    fieldRef.current?.style.setProperty("--fx", "50%");
    fieldRef.current?.style.setProperty("--fy", "50%");
  };

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
       and vh would make the hero grow mid-gesture.

       `<main>` carries pt-16/pt-20 so ordinary page content clears the fixed
       header, but that push only comes from the top: centering inside what's
       left over put the content 40px below the true middle of the screen,
       not on it. -mt-16/-mt-20 cancels that push so the section spans the
       real viewport again, and py-20 (comfortably past either header height,
       measured at 66px/68.5px) reserves the header's clearance as padding on
       both sides instead, which centers around zero rather than pushing
       everything down from one side. */
    <section
      className="relative -mt-16 flex min-h-[100svh] flex-col items-center justify-center py-20 text-center md:-mt-20"
      onPointerMove={followPointer}
      onPointerLeave={resetPointer}
    >
      <div ref={fieldRef} aria-hidden className="dot-field absolute inset-0" />

      <div className="shell relative flex flex-col items-center">
        <motion.p
          {...rise(0)}
          className="glass inline-flex items-center gap-2.5 rounded-pill px-3.5 py-1.5 text-[0.8125rem] text-muted"
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
