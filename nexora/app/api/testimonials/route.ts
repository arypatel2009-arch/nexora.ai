import { getTestimonials } from "@/lib/data";
import { jsonOk } from "@/lib/api/response";

export async function GET() {
  const testimonials = await getTestimonials();
  return jsonOk(testimonials);
}
