import type { ContactRequest } from "@/lib/types";

// Starts empty. Real submissions from the public Contact form are added
// here (via the contact service) once Supabase is connected; until then,
// the Admin CMS "Contact Requests" module reads from local mock storage.
export const contactRequestsSeed: ContactRequest[] = [];
