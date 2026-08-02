import type { CaseStudy } from "@/lib/types";
import { caseStudiesSeed } from "@/lib/seed/case-studies.seed";
import { createEntityService } from "./entity-service";

export const caseStudiesService = createEntityService<CaseStudy>("case_studies", "case-studies", caseStudiesSeed);
