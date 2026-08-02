import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a free strategy call with Nexora, or send us a message.",
};

export default async function ContactPage() {
  const companyInfo = await getSiteSettings();
  return (
    <div className="py-20">
      <div className="container-nexora grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let's talk about your business"
            description="Tell us what's slowing you down — we'll show you where AI can help."
          />
          <div className="mt-8 space-y-4">
            <a
              href={`mailto:${companyInfo.email}`}
              className="flex items-center gap-3 text-sm font-medium text-ink hover:text-brand-500"
            >
              <Mail size={18} className="text-brand-500" /> {companyInfo.email}
            </a>
            <a
              href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-sm font-medium text-ink hover:text-brand-500"
            >
              <Phone size={18} className="text-brand-500" /> {companyInfo.phone}
            </a>
          </div>
          <p className="mt-8 text-sm leading-relaxed text-muted">
            Prefer to talk it through first? Our AI assistant can answer quick
            questions any time — look for the chat bubble in the corner.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-xl3 border border-border bg-white p-6 shadow-premium sm:p-10">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
