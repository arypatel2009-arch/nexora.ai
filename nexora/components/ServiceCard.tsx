"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Workflow,
  MessageCircle,
  Globe,
  Clapperboard,
  Compass,
  Phone,
  PhoneCall,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

// Icon mapping lives inside this Client Component. Server Components pass
// the icon as a plain string (the name), never the component itself —
// passing a component/function reference as a prop from a Server
// Component into a Client Component isn't serializable in Next.js 15.
const iconMap: Record<string, LucideIcon> = {
  Workflow,
  MessageCircle,
  Globe,
  Clapperboard,
  Compass,
  Phone,
  PhoneCall,
  TrendingUp,
  Users,
};

export default function ServiceCard({
  icon,
  name,
  description,
  href,
}: {
  icon: string;
  name: string;
  description: string;
  href: string;
}) {
  const Icon = iconMap[icon] ?? Workflow;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl2 border border-border bg-surface p-8 shadow-soft transition-shadow duration-400 ease-premium hover:border-brand-100 hover:shadow-premium"
    >
      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-brand-gradient transition-transform duration-500 ease-premium group-hover:scale-x-100" />

      <motion.span
        whileHover={{ rotate: -6, scale: 1.06 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-13 w-13 items-center justify-center rounded-xl bg-brand-gradient shadow-glow ring-4 ring-brand-50 transition-shadow duration-400 ease-premium group-hover:ring-brand-100"
        style={{ height: "3.25rem", width: "3.25rem" }}
      >
        <Icon size={21} className="text-white" aria-hidden="true" />
      </motion.span>
      <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
        {name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {description}
      </p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600"
      >
        Learn more
        <ArrowRight size={14} className="transition-transform duration-300 ease-premium group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
