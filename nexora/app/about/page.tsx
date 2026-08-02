import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "Nexora builds practical AI systems for small and mid-sized businesses.",
};

export default async function AboutPage() {
  const companyInfo = await getSiteSettings();
  return (
    <div className="py-20">
      <div className="container-nexora max-w-3xl">
        <SectionHeading
          eyebrow="About"
          title="AI that works for real businesses, not just tech companies"
        />
        <div className="mt-8 space-y-5 text-muted">
          <p>
            Nexora was started with one goal: bring the same AI tools that big
            tech companies use to everyday businesses — dental clinics,
            restaurants, real estate teams, gyms, and local shops — without
            the jargon or the enterprise price tag.
          </p>
          <p>
            We believe you shouldn&apos;t need a technical team to benefit
            from automation. So we handle the setup, explain everything in
            plain terms, and build systems that quietly save you time every
            single day.
          </p>
          <p>
            Nexora is founded and run by <strong className="text-ink">{companyInfo.founder}</strong>.
          </p>
        </div>
        <div className="mt-10">
          <Button href="/contact">Book a Free Strategy Call</Button>
        </div>
      </div>
    </div>
  );
}
