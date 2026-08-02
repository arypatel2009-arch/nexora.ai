import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  company: z.string().optional().default(""),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional().default(""),
  country: z.string().min(2, "Please enter your country"),
  service: z.string().min(1, "Please select a service"),
  budget: z.string().optional().default(""),
  message: z.string().min(10, "Tell us a bit more — at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
