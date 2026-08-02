import type { Industry } from "@/lib/types";

export const industriesSeed: Industry[] = [
  { id: "ind_dental-clinics", slug: "dental-clinics", name: "Dental Clinics", painPoint: "Missed calls mean missed appointments.", solution: "AI answers, books, and reminds patients automatically.", icon: "Stethoscope", status: "published", order: 1 },
  { id: "ind_medical", slug: "medical", name: "Medical Practices", painPoint: "Front desk is overwhelmed with routine questions.", solution: "AI handles scheduling and FAQs so staff can focus on patients.", icon: "HeartPulse", status: "published", order: 2 },
  { id: "ind_restaurants", slug: "restaurants", name: "Restaurants", painPoint: "Reservation calls interrupt service.", solution: "AI takes reservations and answers menu questions any time.", icon: "UtensilsCrossed", status: "published", order: 3 },
  { id: "ind_real-estate", slug: "real-estate", name: "Real Estate", painPoint: "Leads go cold waiting for a reply.", solution: "AI responds instantly and books showings for you.", icon: "Home", status: "published", order: 4 },
  { id: "ind_gyms", slug: "gyms", name: "Gyms & Studios", painPoint: "Trial sign-ups don't get followed up on.", solution: "AI nurtures leads into memberships automatically.", icon: "Dumbbell", status: "published", order: 5 },
  { id: "ind_marketing-agencies", slug: "marketing-agencies", name: "Marketing Agencies", painPoint: "Manual reporting eats billable hours.", solution: "AI automates client updates and internal workflows.", icon: "Megaphone", status: "published", order: 6 },
  { id: "ind_coaches-consultants", slug: "coaches-consultants", name: "Coaches & Consultants", painPoint: "Discovery calls get missed or forgotten.", solution: "AI qualifies leads and fills your calendar.", icon: "GraduationCap", status: "published", order: 7 },
  { id: "ind_local-businesses", slug: "local-businesses", name: "Local Businesses", painPoint: "No time to manage every customer message.", solution: "AI covers messages across every channel you use.", icon: "Store", status: "published", order: 8 },
  { id: "ind_ecommerce", slug: "ecommerce", name: "Ecommerce", painPoint: "Support questions slow down sales.", solution: "AI answers order and product questions instantly.", icon: "ShoppingBag", status: "published", order: 9 },
];
