import type { Metadata } from "next";
import { Briefcase, MapPin, Clock3 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import Card from "@/components/ui/Card";
import Reveal from "@/components/Reveal";
import Button from "@/components/ui/Button";
import { getCareers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at Nexora.",
};

export default async function CareersPage() {
  const roles = await getCareers();

  return (
    <div className="py-20">
      <div className="container-nexora max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="Careers"
            title="Help us build Nexora"
            description="We're a small, hands-on team — open roles are posted here as they come up."
            center
          />
        </Reveal>

        <div className="mt-14">
          {roles.length === 0 ? (
            <Reveal>
              <EmptyState
                icon={Briefcase}
                title="No open roles right now."
                description="Check back soon, or reach out directly if you think you'd be a great fit."
              />
            </Reveal>
          ) : (
            <div className="space-y-4">
              {roles.map((role, i) => (
                <Reveal key={role.id} delay={i * 0.06}>
                  <Card>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold tracking-tight text-ink">{role.title}</h2>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
                          <span className="flex items-center gap-1.5">
                            <Briefcase size={14} /> {role.department}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} /> {role.location}
                          </span>
                          <span className="flex items-center gap-1.5 capitalize">
                            <Clock3 size={14} /> {role.type.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                      <Button href={`/contact?role=${role.slug}`} variant="secondary">
                        Apply
                      </Button>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted">{role.description}</p>
                    {role.requirements.length > 0 && (
                      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
                        {role.requirements.map((req) => (
                          <li key={req}>{req}</li>
                        ))}
                      </ul>
                    )}
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
