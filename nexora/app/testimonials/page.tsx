import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import { getTestimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What Nexora clients say — reviews added as they come in.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="py-20">
      <div className="container-nexora">
        <SectionHeading
          eyebrow="Testimonials"
          title="What clients say"
          center
        />
        <div className="mt-14">
          {testimonials.length === 0 ? (
            <EmptyState
              icon={MessagesSquare}
              title="Client reviews will appear here as they come in."
              description="We only publish genuine feedback from real Nexora clients — nothing invented."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.id}>
                  <p className="text-sm text-ink">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-4 text-sm font-semibold text-ink">{t.authorName}</p>
                  <p className="text-xs text-muted">{t.authorRole}, {t.authorCompany}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
