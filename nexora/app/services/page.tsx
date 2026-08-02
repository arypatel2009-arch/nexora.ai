import type { Metadata } from "next";
import { Check, Clock3, Workflow, MessageCircle, Globe, Clapperboard, Compass, Phone, PhoneCall, TrendingUp, Users } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI automation, chatbots, websites, ad creative, and consulting for small and mid-sized businesses.",
};

const iconMap: Record<string, any> = {
  Workflow, MessageCircle, Globe, Clapperboard, Compass, Phone, PhoneCall, TrendingUp, Users,
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="py-24">
      <div className="container-nexora">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="AI tools built around your business"
            description="Every service below solves one real problem — no bloated packages, no jargon."
            center
          />
        </Reveal>

        <div className="mt-16 space-y-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Workflow;
            return (
              <Reveal key={service.slug} delay={Math.min(i * 0.05, 0.3)}>
                <Card className="scroll-mt-24">
                  <div id={service.slug} className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
                      <Icon size={22} className="text-white" aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold tracking-tight text-ink">{service.name}</h2>
                        {service.availability === "coming-soon" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                            <Clock3 size={12} /> Coming soon
                          </span>
                        )}
                      </div>
                      <p className="mt-2.5 leading-relaxed text-muted">{service.description}</p>
                      {service.outcomes.length > 0 && (
                        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                          {service.outcomes.map((outcome) => (
                            <li key={outcome} className="flex items-start gap-2 text-sm text-ink">
                              <Check size={16} className="mt-0.5 shrink-0 text-brand-500" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <Button href="/contact" size="lg">
            Book a Free Strategy Call
          </Button>
        </div>
      </div>
    </div>
  );
}
