"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope,
  HeartPulse,
  UtensilsCrossed,
  Home,
  Dumbbell,
  Megaphone,
  GraduationCap,
  Store,
  ShoppingBag,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

// Icon mapping lives inside this Client Component — see note in
// ServiceCard.tsx. Server Components pass `icon` as a string name only.
const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  HeartPulse,
  UtensilsCrossed,
  Home,
  Dumbbell,
  Megaphone,
  GraduationCap,
  Store,
  ShoppingBag,
};

export default function IndustryTile({
  icon,
  name,
  href,
}: {
  icon: string;
  name: string;
  href: string;
}) {
  const Icon = iconMap[icon] ?? Store;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <Link
        href={href}
        className="group relative flex flex-col items-center gap-3.5 overflow-hidden rounded-xl2 border border-border bg-canvas px-4 py-8 text-center transition-all duration-400 ease-premium hover:border-brand-200 hover:bg-white hover:shadow-premium"
      >
        <ArrowUpRight
          size={14}
          className="absolute right-3 top-3 text-brand-300 opacity-0 transition-all duration-400 ease-premium group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft ring-4 ring-transparent transition-all duration-400 ease-premium group-hover:scale-110 group-hover:ring-brand-50">
          <Icon size={18} className="text-brand-500" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium text-ink">{name}</span>
      </Link>
    </motion.div>
  );
}
