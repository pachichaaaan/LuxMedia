import { brand } from "./brand";
import { services } from "./services";

export const budgetOptions = [
  { value: "under-10k", label: "Under $10k" },
  { value: "10k-25k", label: "$10k to $25k" },
  { value: "25k-50k", label: "$25k to $50k" },
  { value: "over-50k", label: "Over $50k" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.name })),
  { value: "not-sure", label: "Not sure yet" },
];

export const contact = {
  meta: {
    title: "Contact",
    description: `Tell us about your brand. ${brand.name} replies within one business day.`,
  },
  headline: "Tell us about your brand.",
  intro: "We reply within one business day, usually from whoever is on shift.",
  emailLead: "Or email us directly:",
  formLabel: "Project inquiry",
  fields: {
    name: { label: "Your name", autoComplete: "name" },
    email: {
      label: "Work email",
      hint: "We'll reply here.",
      autoComplete: "email",
      placeholder: "name@company.com",
    },
    company: { label: "Company", autoComplete: "organization" },
    website: {
      label: "Website or handle",
      placeholder: "company.com or @company",
      autoComplete: "url",
    },
    services: { label: "Services you're interested in", hint: "Choose as many as you like." },
    budget: { label: "Monthly budget" },
    message: {
      label: "Message",
      hint: "What you sell, who buys it, and what isn't working yet.",
    },
    /** Honeypot. Hidden from people; bots fill it in. */
    trap: { label: "Leave this field empty" },
  },
  submit: "Send message",
  pending: "Sending message",
  success: {
    heading: "Message sent.",
    body: "We reply within one business day.",
    again: "Send another message",
  },
  errors: {
    name: "Enter your name.",
    email: "Enter a work email, like name@company.com.",
    company: "Enter your company's name.",
    website: "Enter your website or a social handle, like company.com or @company.",
    services: "Choose at least one service, or choose “Not sure yet”.",
    budget: "Choose a monthly budget, or choose “Not sure yet”.",
    messageEmpty: "Enter a message.",
    messageShort: "Add a little more detail. A sentence or two is enough.",
    messageLong: "Shorten your message to under 4,000 characters.",
    tooFast: "That was faster than anyone types. Wait a few seconds, then send it again.",
    server: `The message didn't send. Try again, or email ${brand.email}.`,
    summary: (n: number) =>
      n === 1
        ? "1 field needs fixing before this can send."
        : `${n} fields need fixing before this can send.`,
  },
};
