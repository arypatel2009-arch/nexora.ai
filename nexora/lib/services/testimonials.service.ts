import type { Testimonial } from "@/lib/types";
import { testimonialsSeed } from "@/lib/seed/testimonials.seed";
import { createEntityService } from "./entity-service";

export const testimonialsService = createEntityService<Testimonial>("testimonials", "testimonials", testimonialsSeed);
