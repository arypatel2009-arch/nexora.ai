import type { Metadata } from "next";
import { Stethoscope, HeartPulse, UtensilsCrossed, Home, Dumbbell, Megaphone, GraduationCap, Store, ShoppingBag } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import { getIndustries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Industries",
  description: "Nexora builds AI systems for dental clinics, restaurants, real estate, gyms, and more.",
};

const iconMap: Record<string, any> = {
  Stethoscope, HeartPulse, UtensilsCrossed, Home, Dumbbell, Megaphone, GraduationCap, Store, ShoppingBag,
};

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <div className="py-20">
      <div className="container-nexora">
        <Reveal>
          <SectionHeading
            eyebrow="Industries"
            title="Made for how your industry works"
            description="Every business loses customers differently. Here's where Nexora helps most."
            center
          />
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => {
            const Icon = iconMap[industry.icon] ?? Store;
            return (
              <Reveal key={industry.slug} delay={(i % 6) * 0.05}>
                <Card id={industry.slug}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                    <Icon size={20} className="text-brand-500" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink">{industry.name}</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    <span className="font-medium text-ink">Problem: </span>
                    {industry.painPoint}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    <span className="font-medium text-ink">Solution: </span>
                    {industry.solution}
                  </p>
                </Card>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-16 text-center">
          <Button href="/contact" size="lg">Book a Free Strategy Call</Button>
        </div>
      </div>
    </div>
  );
}
