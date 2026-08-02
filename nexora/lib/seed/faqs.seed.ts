import type { FaqItem } from "@/lib/types";

export const faqsSeed: FaqItem[] = [
  {
    id: "faq_what-is-nexora",
    question: "What does Nexora actually do?",
    answer:
      "We build AI-powered tools — chatbots, automations, and websites — that handle the repetitive parts of running your business, so you save time and never miss a customer.",
    category: "General",
    status: "published",
    order: 1,
  },
  {
    id: "faq_no-tech-needed",
    question: "Do I need to be technical to use this?",
    answer:
      "No. We handle the setup and explain everything in plain terms. You just tell us how your business runs — we build the rest.",
    category: "General",
    status: "published",
    order: 2,
  },
  {
    id: "faq_how-long",
    question: "How long does it take to get set up?",
    answer: "Most automations and chatbots are live within one to two weeks, depending on how many tools we're connecting.",
    category: "Process",
    status: "published",
    order: 3,
  },
  {
    id: "faq_pricing",
    question: "How much does it cost?",
    answer: "It depends on what your business needs. Book a free strategy call and we'll give you a clear, upfront quote — no surprises.",
    category: "Pricing",
    status: "published",
    order: 4,
  },
  {
    id: "faq_existing-tools",
    question: "Will this work with the tools I already use?",
    answer: "In most cases, yes. We connect with common calendars, CRMs, and messaging tools. If you're not sure, ask us on your strategy call.",
    category: "Process",
    status: "published",
    order: 5,
  },
];
