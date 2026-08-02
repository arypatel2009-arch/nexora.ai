import type { CareerListing } from "@/lib/types";
import { careersSeed } from "@/lib/seed/careers.seed";
import { createEntityService } from "./entity-service";

export const careersService = createEntityService<CareerListing>("careers", "careers", careersSeed);
