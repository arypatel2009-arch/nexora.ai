import type { Industry } from "@/lib/types";
import { industriesSeed } from "@/lib/seed/industries.seed";
import { createEntityService } from "./entity-service";

export const industriesService = createEntityService<Industry>("industries", "industries", industriesSeed);
