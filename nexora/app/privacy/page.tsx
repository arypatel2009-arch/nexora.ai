import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function PrivacyPage() {
  const companyInfo = await getSiteSettings();
  return (
    <div className="py-20">
      <div className="container-nexora max-w-2xl prose-sm">
        <h1 className="text-3xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-sm text-muted">
          <section>
            <h2 className="text-lg font-semibold text-ink">Information we collect</h2>
            <p className="mt-2">
              When you submit our contact form, we collect the information
              you provide — your name, company, email, phone number, country,
              service interest, and message — so we can respond to your
              inquiry.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">How we use it</h2>
            <p className="mt-2">
              We use your information solely to respond to your inquiry,
              provide the services you request, and — with your consent —
              send occasional updates about Nexora.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Data storage</h2>
            <p className="mt-2">
              Your data is stored securely and is never sold to third
              parties.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Contact us</h2>
            <p className="mt-2">
              Questions about this policy can be sent to{" "}
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
