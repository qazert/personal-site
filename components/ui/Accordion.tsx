"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "@phosphor-icons/react";

type Item = { q: string; a: string };

export function Accordion({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel-${i}`}
                className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors duration-200 hover:text-accent-text md:py-6"
              >
                <span className="text-[1.0625rem] font-medium tracking-[-0.018em] md:text-lg">
                  {item.q}
                </span>
                <span
                  className={`mt-0.5 grid size-6 shrink-0 place-items-center text-muted transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  <Plus weight="regular" className="size-4.5" />
                </span>
              </button>
            </h3>
            {/* State transition: the panel grows from the question it belongs to. */}
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`${id}-panel-${i}`}
                  role="region"
                  key="panel"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="lede max-w-[64ch] pb-6 pr-10 text-[0.9375rem] md:text-base">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
