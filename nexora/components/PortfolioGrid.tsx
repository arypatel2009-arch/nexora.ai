"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECT_CATEGORIES } from "@/lib/types";
import type { Project } from "@/lib/types";
import Card from "@/components/ui/Card";

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<string>("All");

  const categoriesInUse = ["All", ...PROJECT_CATEGORIES.filter((c) => projects.some((p) => p.category === c))];
  const filtered = category === "All" ? projects : projects.filter((p) => p.category === category);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {categoriesInUse.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={
              c === category
                ? "rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-glow"
                : "rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-brand-200 hover:text-ink"
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
          >
            <Link href={`/portfolio/${project.slug}`}>
              <Card className="group h-full">
                <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                  {project.category}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500">
                  View project
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
