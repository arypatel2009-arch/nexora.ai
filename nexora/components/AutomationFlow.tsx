"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles, CalendarCheck } from "lucide-react";

const nodes = [
  { icon: MessageSquare, label: "Customer messages you", x: 40 },
  { icon: Sparkles, label: "Nexora AI responds instantly", x: 300 },
  { icon: CalendarCheck, label: "Appointment booked", x: 560 },
];

// The signature element: a continuous flow line with a traveling pulse,
// visualizing the exact thing Nexora sells — a message that becomes a
// booking without a human touching it in between.
export default function AutomationFlow() {
  return (
    <div className="relative mx-auto mt-16 max-w-3xl">
      <svg
        viewBox="0 0 620 40"
        className="w-full"
        aria-hidden="true"
        focusable="false"
      >
        <line
          x1="60"
          y1="20"
          x2="580"
          y2="20"
          stroke="#DCE6FF"
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
        />
        <motion.circle
          r="6"
          fill="#3B6EF6"
          style={{ filter: "drop-shadow(0 0 6px rgba(59,110,246,0.55))" }}
          initial={{ cx: 60, cy: 20 }}
          animate={{ cx: [60, 580], cy: 20 }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.4,
          }}
        />
      </svg>

      <div className="mt-2 flex items-start justify-between">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <div
              key={node.label}
              className="flex w-32 flex-col items-center text-center sm:w-40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-100 bg-white shadow-premium transition-transform duration-500 ease-premium hover:-translate-y-0.5">
                <Icon size={18} className="text-brand-500" aria-hidden="true" />
              </span>
              <span className="mt-3 text-xs font-medium text-muted sm:text-sm">
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
