"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "Discover",
    detail: "We learn how your business runs today — calls, messages, bookings, the works.",
  },
  {
    step: "Design",
    detail: "We map the exact automation or system that fits, before any building starts.",
  },
  {
    step: "Build",
    detail: "We set everything up and connect your tools. You don't lift a finger.",
  },
  {
    step: "Support",
    detail: "We stay on to refine, monitor, and support the system as your business grows.",
  },
];

export default function ProcessTimeline() {
  return (
    <div className="relative mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
      {/* Static track */}
      <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" />
      {/* Animated progress draw, left to right, once in view */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "left" }}
        className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-brand-gradient lg:block"
      />

      {steps.map((item, i) => (
        <motion.div
          key={item.step}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.15 + 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-brand-100 bg-white font-display text-sm font-bold text-brand-500 shadow-premium"
          >
            0{i + 1}
          </motion.span>
          <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
            {item.step}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}
