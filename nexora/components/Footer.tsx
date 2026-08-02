import Link from "next/link";
import { Mail, Phone, Sparkles, ArrowUpRight, ArrowUp } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

const columns = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/services", label: "All Services" },
      { href: "/industries", label: "Industries" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export default async function Footer() {
  const companyInfo = await getSiteSettings();
  return (
    <footer className="relative bg-footer-gradient text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/60 to-transparent" />

      <div className="container-nexora border-b border-white/10 py-16 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <span className="eyebrow-divider text-white/60">Ready when you are</span>
            <h2 className="mt-3 max-w-md text-2xl font-bold tracking-tightest sm:text-3xl lg:text-4xl">
              Let&apos;s build your AI growth system.
            </h2>
          </div>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink shadow-glow transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:shadow-premium-hover"
          >
            {companyInfo.primaryCta}
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <div className="container-nexora grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
              <Sparkles size={16} aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold">{companyInfo.companyName}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">{companyInfo.tagline}</p>
          <div className="mt-7 space-y-3 text-sm text-white/70">
            <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
              <Mail size={16} aria-hidden="true" /> {companyInfo.email}
            </a>
            <a href={`tel:${companyInfo.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
              <Phone size={16} aria-hidden="true" /> {companyInfo.phone}
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wideish text-white/50">
              {col.title}
            </h3>
            <ul className="mt-6 space-y-3.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-7">
        <div className="container-nexora flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {companyInfo.companyName}. All rights reserved.
          </p>
          <a
            href="#main-content"
            className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/80"
          >
            Back to top <ArrowUp size={12} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
