import type { Metadata } from "next";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { getPricingPlans } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for Nexora's AI automation, chatbot, and website services.",
};

export default async function PricingPage() {
  const plans = await getPricingPlans();

  return (
    <div className="py-20">
      <div className="container-nexora">
        <SectionHeading
          eyebrow="Pricing"
          title="Priced around what you actually need"
          description="Every business is different, so every quote is custom. Here's roughly where most clients land."
          center
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.slug}
              className={cn(
                "flex flex-col",
                plan.highlighted && "border-brand-300 ring-2 ring-brand-100"
              )}
            >
              {plan.highlighted && (
                <span className="mb-3 inline-block w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-semibold text-ink">{plan.name}</h2>
              <p className="mt-1 text-2xl font-bold text-ink">{plan.price}</p>
              <p className="text-xs text-muted">{plan.billingNote}</p>
              <p className="mt-3 text-sm text-muted">{plan.description}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button href="/contact" className="mt-6" variant={plan.highlighted ? "primary" : "secondary"}>
                Get a quote
              </Button>
            </Card>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted">
          Prices vary by scope — book a free strategy call for an exact quote.
        </p>
      </div>
    </div>
  );
}
