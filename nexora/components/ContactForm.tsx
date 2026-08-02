"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { contactService } from "@/lib/services/contact.service";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";

type FormData = ContactInput;

const services = [
  "AI Automation",
  "AI Chatbots",
  "Website & Landing Pages",
  "AI UGC Ads",
  "Business Consulting",
  "Not sure yet",
];

// WhatsApp number the pre-filled message opens to after a successful
// submission (international format, digits only, no "+").
const WHATSAPP_NUMBER = "916351003457";

function buildWhatsAppUrl(data: FormData): string {
  const lines = [
    "New inquiry from the Nexora website:",
    "",
    `Name: ${data.name}`,
    `Company: ${data.company || "N/A"}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "N/A"}`,
    `Country: ${data.country}`,
    `Service: ${data.service}`,
    `Budget: ${data.budget || "N/A"}`,
    `Message: ${data.message}`,
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(contactSchema) });

  // Goes through the contact service (lib/services/contact.service.ts).
  // Today that persists to a local mock store; once Supabase is
  // connected, submit() becomes a real insert and this component doesn't
  // change at all.
  async function onSubmit(data: FormData) {
    try {
      await contactService.submit({
        name: data.name,
        company: data.company ?? "",
        email: data.email,
        phone: data.phone ?? "",
        country: data.country,
        service: data.service,
        budget: data.budget ?? "",
        message: data.message,
      });
      window.open(buildWhatsAppUrl(data), "_blank", "noopener,noreferrer");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl2 border border-brand-100 bg-brand-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-ink">Message sent</h3>
        <p className="mt-2 text-sm text-muted">
          Thanks for reaching out — we&apos;ll get back to you within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input {...register("name")} className="input" aria-required="true" />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <input {...register("company")} className="input" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" {...register("email")} className="input" aria-required="true" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input type="tel" {...register("phone")} className="input" />
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <input {...register("country")} className="input" aria-required="true" />
        </Field>
        <Field label="Budget (optional)" error={errors.budget?.message}>
          <input {...register("budget")} className="input" placeholder="e.g. $500–$1000" />
        </Field>
      </div>

      <Field label="Which service are you interested in?" error={errors.service?.message}>
        <select {...register("service")} className="input" aria-required="true" defaultValue="">
          <option value="" disabled>Select a service</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className="input resize-none"
          aria-required="true"
          placeholder="Tell us about your business and what you're hoping to solve."
        />
      </Field>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Something went wrong sending your message. Please try again, or
          email us directly.
        </div>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #E4E9F2;
          background: #fff;
          padding: 0.7rem 0.95rem;
          font-size: 0.875rem;
          color: #0B1B33;
          transition: border-color 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .input:hover {
          border-color: #9EB8FF;
        }
        .input:focus-visible {
          outline: none;
          border-color: #3B6EF6;
          box-shadow: 0 0 0 3px rgba(59,110,246,0.12);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
