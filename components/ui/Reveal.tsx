"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: React.ReactNode;
  /** Stagger index within a group. */
  index?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
};

/**
 * Entry reveal on scroll. Justification: establishes reading order so the eye
 * lands on the headline before the supporting detail. Collapses to static
 * under prefers-reduced-motion.
 */
export function Reveal({ children, index = 0, className, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: 0.65,
        delay: reduce ? 0 : index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
}
