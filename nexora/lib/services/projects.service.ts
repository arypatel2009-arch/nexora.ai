import type { Project } from "@/lib/types";
import { projectsSeed } from "@/lib/seed/projects.seed";
import { createEntityService } from "./entity-service";

export const projectsService = createEntityService<Project>("projects", "projects", projectsSeed);
