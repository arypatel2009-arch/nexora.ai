import type { ContactRequest, ContactRequestStatus } from "@/lib/types";
import { contactRequestsSeed } from "@/lib/seed/contact-requests.seed";
import { getRepository } from "@/lib/repositories/get-repository";
import { generateId } from "./entity-service";

const repo = getRepository<ContactRequest>("contact_requests", "contact-requests", contactRequestsSeed);

// "Leads" in the Admin CMS is this same underlying entity — a contact
// form submission that becomes a CRM-style lead once it lands in the
// dashboard. Keeping one model avoids a duplicate table/service for
// what is, functionally, the same record at a different stage.
export const contactService = {
  getAll: repo.getAll,
  getById: repo.getById,
  remove: repo.remove,

  /**
   * Called by the public Contact form on submit. Once Supabase is
   * connected, this becomes a real insert into `contact_requests` —
   * the form component doesn't change. See also app/api/contact and
   * app/api/leads for the equivalent server-side route.
   */
  async submit(input: Omit<ContactRequest, "id" | "status" | "notes" | "createdAt">) {
    const request: ContactRequest = {
      ...input,
      id: generateId("lead"),
      status: "new",
      notes: "",
      createdAt: new Date().toISOString(),
    };
    return repo.create(request);
  },

  async setStatus(id: string, status: ContactRequestStatus) {
    return repo.update(id, { status });
  },

  async setNotes(id: string, notes: string) {
    return repo.update(id, { notes });
  },
};

export function filterLeads(
  leads: ContactRequest[],
  { status, service }: { status?: ContactRequestStatus | "all"; service?: string }
) {
  return leads.filter((lead) => {
    const statusMatch = !status || status === "all" || lead.status === status;
    const serviceMatch = !service || service === "all" || lead.service === service;
    return statusMatch && serviceMatch;
  });
}
