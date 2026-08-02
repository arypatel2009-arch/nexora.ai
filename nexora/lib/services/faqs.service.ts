import type { FaqItem } from "@/lib/types";
import { faqsSeed } from "@/lib/seed/faqs.seed";
import { createEntityService } from "./entity-service";

export const faqsService = createEntityService<FaqItem>("faqs", "faqs", faqsSeed);
