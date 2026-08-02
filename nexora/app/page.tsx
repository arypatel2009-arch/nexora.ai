import { ArrowRight, Clock, MessageCircle, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import Reveal from "@/components/Reveal";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import IndustryTile from "@/components/IndustryTile";
import ProcessTimeline from "@/components/ProcessTimeline";
import { getServices, getIndustries, getProjects, getFaqs, getSiteSettings } from "@/lib/data";

export default async function HomePage() {
  const [services, industries, projects, faqs, companyInfo] = await Promise.all([
    getServices(),
    getIndustries(),
    getProjects(),
    getFaqs(),
    getSiteSettings(),
  ]);

  const liveServices = services.filter((s) => s.availability === "live");

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-brand-mesh">
        <Hero settings={companyInfo} />
      </section>

      {/* 2. Why Nexora / trust bar */}
      <section className="border-y border-border bg-white py-20">
        <div className="container-nexora">
          <Reveal>
            <SectionHeading
              eyebrow="Why Nexora"
              title="Built to earn trust, not just attention"
              description="No lock-in, no jargon, no disappearing after launch — just a system that works and a team that stays reachable."
              center
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "Hours back, every week",
                label: "Automations quietly absorb the repetitive work so your week opens up.",
              },
              {
                icon: MessageCircle,
                title: "Nothing falls through",
                label: "Every message gets a reply — even the ones that used to sit unanswered.",
              },
              {
                icon: Zap,
                title: "On, even when you're not",
                label: "Your business keeps responding to customers around the clock.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="group h-full rounded-xl2 border border-border bg-canvas p-7 text-left transition-all duration-400 ease-premium hover:-translate-y-1 hover:border-brand-100 hover:bg-white hover:shadow-premium">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
                    <item.icon size={19} className="text-white" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Services */}
      <section className="py-28">
        <div className="container-nexora">
          <Reveal>
            <SectionHeading
              eyebrow="Services"
              title="Everything you need to run smarter"
              description="Practical AI tools built around how your business actually works — not the other way around."
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liveServices.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 0.08}>
                <ServiceCard
                  icon={service.icon}
                  name={service.name}
                  description={service.shortDescription}
                  href={`/services#${service.slug}`}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Industries */}
      <section className="bg-white py-28">
        <div className="container-nexora">
          <Reveal>
            <SectionHeading
              eyebrow="Industries"
              title="Built for businesses like yours"
              description="From dental clinics to real estate teams — Nexora adapts to how your industry actually runs."
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {industries.slice(0, 10).map((industry, i) => (
              <Reveal key={industry.slug} delay={(i % 5) * 0.06}>
                <IndustryTile
                  icon={industry.icon}
                  name={industry.name}
                  href={`/industries#${industry.slug}`}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured projects (database ready, honest empty state) */}
      <section className="py-28">
        <div className="container-nexora">
          <Reveal>
            <SectionHeading
              eyebrow="Portfolio"
              title="Featured projects"
              description="Real client work, as it happens."
            />
          </Reveal>
          <div className="mt-14">
            {projects.length === 0 ? (
              <Reveal>
                <EmptyState
                  title="Case studies will be added as projects are completed."
                  description="We're a young, focused team — check back soon to see real results from real clients."
                />
              </Reveal>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <Card key={p.slug}>{p.title}</Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Process */}
      <section className="bg-white py-28">
        <div className="container-nexora">
          <Reveal>
            <SectionHeading
              eyebrow="Process"
              title="How we get you live"
              description="A clear, guided path from first call to a working system."
            />
          </Reveal>
          <ProcessTimeline />
        </div>
      </section>

      {/* 7. FAQ preview */}
      <section className="py-28">
        <div className="container-nexora max-w-3xl">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Common questions" center />
          </Reveal>
          <div className="mt-12 space-y-4">
            {faqs.slice(0, 4).map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.06}>
                <details className="group rounded-xl2 border border-border bg-white p-5 transition-shadow duration-400 open:shadow-soft">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <div className="mt-9 text-center">
            <Button href="/faq" variant="secondary">
              See all questions
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="relative overflow-hidden bg-brand-gradient py-24">
        <div className="container-nexora relative text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tightest text-white sm:text-4xl lg:text-5xl">
              Ready to save time and grow faster?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-white/90">
              Book a free strategy call — no pressure, just a clear plan for
              your business.
            </p>
            <div className="mt-9">
              <Button href="/contact" size="lg" variant="secondary">
                {companyInfo.primaryCta} <ArrowRight size={18} />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
