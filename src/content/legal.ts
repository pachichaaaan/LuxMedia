import { brand } from "./brand";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export const privacy = {
  meta: {
    title: "Privacy",
    description: `What ${brand.name} collects through this website, why, and how to have it removed.`,
  },
  headline: "Privacy",
  updated: "Last updated 6 October 2026",
  intro: `This page explains what ${brand.legalName} collects when you use this website, and what we do with it. It's short because we collect very little.`,
  sections: [
    {
      heading: "What we collect",
      paragraphs: [
        "If you send us a message through the contact form, we receive what you type: your name, work email, company, website or handle, the services and budget you choose, and your message.",
        "We don't use advertising cookies or tracking pixels on this site. Our hosting provider keeps standard server logs, such as IP addresses and request times, for security and troubleshooting.",
      ],
    },
    {
      heading: "How we use it",
      paragraphs: [
        "We use what you send us to reply to you and, if we work together, to set up the project. We don't add you to a mailing list, and we don't sell or rent your details to anyone.",
      ],
    },
    {
      heading: "Who else handles it",
      paragraphs: [
        "Contact form messages are delivered to our inbox by an email service provider. The website is hosted by a cloud provider. Both process data on our behalf and only for these purposes.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep inquiry emails for up to two years, so we have context if you get in touch again. Server logs are kept for no more than 30 days.",
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        `You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Email ${brand.email} and we'll reply within one business day and act within 30 days.`,
      ],
    },
    {
      heading: "Changes to this page",
      paragraphs: [
        "If we change how we handle personal data, we'll update this page and the date at the top.",
      ],
    },
  ] satisfies LegalSection[],
};
