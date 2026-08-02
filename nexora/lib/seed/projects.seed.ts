import type { Project } from "@/lib/types";

// Intentionally empty — no fake projects. The Admin CMS's "Manage Portfolio"
// module lets a real project be added here (or in Supabase, once connected).
// Public pages render a designed empty state when this array is empty.
export const projectsSeed: Project[] = [];
