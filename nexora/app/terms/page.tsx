import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default async function TermsPage() {
  const companyInfo = await getSiteSettings();
  return (
    <div className="py-20">
      <div className="container-nexora max-w-2xl">
        <h1 className="text-3xl font-bold text-ink">Terms of Service</h1>
        <p className="mt-4 text-sm text-muted">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-sm text-muted">
          <section>
            <h2 className="text-lg font-semibold text-ink">Services</h2>
            <p className="mt-2">
              Nexora provides AI automation, chatbot, website, advertising,
              and consulting services as described on this site. Specific
              scope and deliverables for each engagement are agreed in
              writing before work begins.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Payment</h2>
            <p className="mt-2">
              Pricing is quoted individually per project. Payment terms are
              confirmed in your project agreement.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Limitation of liability</h2>
            <p className="mt-2">
              Nexora is not liable for indirect or consequential losses
              arising from use of delivered systems, beyond the fees paid for
              the relevant engagement.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Contact</h2>
            <p className="mt-2">
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${companyInfo.email}`} className="text-brand-500 underline">
                {companyInfo.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
