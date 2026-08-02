"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Shield, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import AutomationFlow from "@/components/AutomationFlow";
import type { SiteSettings } from "@/lib/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const trustPoints = [
  { icon: Clock, label: "Live in 1–2 weeks" },
  { icon: Shield, label: "No lock-in contracts" },
  { icon: MessageCircle, label: "Plain-language support" },
];

export default function Hero({ settings: companyInfo }: { settings: SiteSettings }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container-nexora relative py-28 text-center sm:py-40"
    >
      {/* Floating glow — decorative depth, no invented content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[380px] w-[620px] -translate-x-1/2 rounded-full bg-brand-gradient opacity-[0.12] blur-[110px]"
      />

      <motion.span
        variants={item}
        className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-1.5 text-sm font-medium text-brand-600 shadow-soft"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-teal opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-teal" />
        </span>
        AI Growth Systems for Local &amp; Growing Businesses
      </motion.span>

      <motion.h1
        variants={item}
        className="mx-auto mt-8 max-w-4xl text-[2.75rem] font-bold leading-[1.05] tracking-tightest sm:text-6xl lg:text-[5rem]"
      >
        Every customer <span className="text-gradient">answered.</span>
        <br />
        Every hour <span className="text-gradient">reclaimed.</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
      >
        Nexora designs AI systems that quietly run the repetitive parts of
        your business — replying, booking, following up — so growth stops
        depending on how many hours you personally put in.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Button href="/contact" size="lg" className="group">
          {companyInfo.primaryCta}
          <ArrowRight size={18} className="transition-transform duration-300 ease-premium group-hover:translate-x-1" />
        </Button>
        <Button href="/services" variant="secondary" size="lg">
          Explore Services
        </Button>
      </motion.div>

      <motion.ul
        variants={item}
        className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
      >
        {trustPoints.map((point) => (
          <li key={point.label} className="flex items-center gap-2 text-sm text-muted">
            <point.icon size={15} className="text-brand-500" aria-hidden="true" />
            {point.label}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={item} className="mt-20">
        <AutomationFlow />
      </motion.div>
    </motion.div>
  );
}
