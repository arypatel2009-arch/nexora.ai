import type { PricingPlan } from "@/lib/types";
import { pricingPlansSeed } from "@/lib/seed/pricing.seed";
import { createEntityService } from "./entity-service";

export const pricingService = createEntityService<PricingPlan>("pricing_plans", "pricing", pricingPlansSeed);
