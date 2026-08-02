// Keep these in sync with the iconMap objects inside ServiceCard.tsx and
// IndustryTile.tsx — those Client Components resolve the string name to
// an actual Lucide component internally (see the Next.js 15 RSC note in
// those files). This file just gives the Admin CMS a matching dropdown.

export const SERVICE_ICON_OPTIONS = [
  "Workflow",
  "MessageCircle",
  "Globe",
  "Clapperboard",
  "Compass",
  "Phone",
  "PhoneCall",
  "TrendingUp",
  "Users",
] as const;

export const INDUSTRY_ICON_OPTIONS = [
  "Stethoscope",
  "HeartPulse",
  "UtensilsCrossed",
  "Home",
  "Dumbbell",
  "Megaphone",
  "GraduationCap",
  "Store",
  "ShoppingBag",
] as const;
