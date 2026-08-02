import type { Service } from "@/lib/types";
import { servicesSeed } from "@/lib/seed/services.seed";
import { createEntityService } from "./entity-service";

export const servicesService = createEntityService<Service>("services", "services", servicesSeed);
