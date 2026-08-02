import type { TeamMember } from "@/lib/types";
import { teamSeed } from "@/lib/seed/team.seed";
import { createEntityService } from "./entity-service";

export const teamService = createEntityService<TeamMember>("team_members", "team", teamSeed);
