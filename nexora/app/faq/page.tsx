import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { getFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about working with Nexora.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="py-20">
      <div className="container-nexora max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" center />

        <div className="mt-14 space-y-10">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
                {category}
              </h2>
              <div className="mt-4 space-y-4">
                {faqs
                  .filter((f) => f.category === category)
                  .map((faq) => (
                    <details
                      key={faq.id}
                      className="rounded-xl2 border border-border bg-white p-5 open:shadow-soft"
                    >
                      <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
                        {faq.question}
                      </summary>
                      <p className="mt-3 text-sm text-muted">{faq.answer}</p>
                    </details>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
