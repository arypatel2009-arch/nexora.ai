import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import PortfolioGrid from "@/components/PortfolioGrid";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Client work from Nexora — case studies added as projects are completed.",
};

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="py-20">
      <div className="container-nexora">
        <SectionHeading
          eyebrow="Portfolio"
          title="Our work"
          description="Real projects, real results — added here as they're completed."
          center
        />
        <div className="mt-14">
          {projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="Case studies will be added as projects are completed."
              description="Nexora is a young, hands-on team. Book a strategy call to be one of our first featured clients."
            />
          ) : (
            <PortfolioGrid projects={projects} />
          )}
        </div>
      </div>
    </div>
  );
}
