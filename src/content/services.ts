import type { Visual } from "./types";

export type Service = {
  slug: string;
  name: string;
  /** One line, shown when the row opens on the home page. */
  oneLine: string;
  /** Link text from the home page accordion to the full service. */
  linkLabel: string;
  description: string;
  included: string[];
  outcomes: string[];
  /** Case study slug shown alongside the service. */
  relatedCase: string;
  preview: Visual;
};

export const services: Service[] = [
  {
    slug: "social-strategy",
    name: "Social strategy",
    oneLine: "Who you're talking to, where, and what you'll say for the next quarter.",
    linkLabel: "How we plan strategy",
    description:
      "Before anything gets posted, we read: your comments, your reviews, your competitors' replies, and the DMs nobody answered. Then we write a plan for one quarter at a time: which platforms earn your effort, what you post on them, and what success looks like in numbers you already track.",
    included: [
      "An audit of every account you run, and the ones you should",
      "Audience and competitor review",
      "Platform priorities, with the reasons written down",
      "Content pillars and a posting rhythm",
      "Quarterly targets tied to your business numbers",
    ],
    outcomes: [
      "Fewer platforms, done properly",
      "A plan your team can follow without us in the room",
      "Targets your finance team would recognize",
    ],
    relatedCase: "bramble-books",
    preview: {
      id: "service-strategy",
      ratio: "9:16",
      label: "Audit wall, printed comments",
      alt: "A wall of printed customer comments sorted into groups with handwritten notes.",
      tone: "lilac",
    },
  },
  {
    slug: "content-and-video",
    name: "Content and short-form video",
    oneLine: "Scripted, shot, and cut in-house. Most of it under 30 seconds.",
    linkLabel: "How we make video",
    description:
      "Our studio makes the posts, reels, and short videos your calendar calls for, in your voice and to each platform's specs. Most of it runs under 30 seconds, because that's where the attention is. Everything is written by people who also read the replies.",
    included: [
      "A monthly content calendar",
      "Short-form video: scripting, shooting, and editing",
      "Static posts, carousels, and Stories",
      "Captions written for each platform",
      "Versions for every format and ratio",
    ],
    outcomes: [
      "A steady output you never have to chase",
      "Video that holds attention past the first three seconds",
      "One voice across every platform",
    ],
    relatedCase: "hearth-and-crumb",
    preview: {
      id: "service-video",
      ratio: "9:16",
      kind: "video",
      label: "Reel shoot, phone on a gimbal",
      alt: "A phone on a handheld gimbal filming a barista pouring coffee.",
      tone: "dusk",
    },
  },
  {
    slug: "community-management",
    name: "Community management, 24/7",
    oneLine: "Every comment and DM answered in your voice, at any hour.",
    linkLabel: "How the desk works",
    description:
      "A staffed desk across three time zones reads and answers every comment, mention, and DM, around the clock. We follow a playbook written with you: what we answer, what we escalate, and who gets a call at 3am when something goes wrong.",
    included: [
      "Replies to comments, mentions, and DMs around the clock",
      "A response playbook and tone guide",
      "Escalation paths for complaints and press",
      "Moderation of spam and abuse",
      "A weekly digest of what people are asking",
    ],
    outcomes: [
      "Reply times measured in minutes, not days",
      "Fewer complaints that turn into public threads",
      "Product feedback from the people actually buying",
    ],
    relatedCase: "saltgrass-hotels",
    preview: {
      id: "service-community",
      ratio: "9:16",
      label: "Night desk, replies on screen",
      alt: "A monitor full of customer replies glowing in a dark office.",
      tone: "midnight",
    },
  },
  {
    slug: "paid-social",
    name: "Paid social",
    oneLine: "Ads that look like they belong in the feed, measured against sales.",
    linkLabel: "How we run paid",
    description:
      "We plan, build, and run paid campaigns on the platforms where your organic work already proves itself. The same studio makes the creative, so the ads look like posts. We report on cost per sale, not reach.",
    included: [
      "Campaign planning and budget split",
      "Ad creative for every placement",
      "Audience setup and testing",
      "Weekly optimization",
      "Tracking connected to your analytics",
    ],
    outcomes: [
      "A lower cost per sale",
      "Creative tested before it's scaled",
      "Spend you can explain line by line",
    ],
    relatedCase: "kilo-skincare",
    preview: {
      id: "service-paid",
      ratio: "9:16",
      label: "Ad variants side by side",
      alt: "Six versions of the same product ad laid out side by side for comparison.",
      tone: "lilac",
    },
  },
  {
    slug: "creator-partnerships",
    name: "Creator partnerships",
    oneLine: "The right creators, briefed properly, paid on time.",
    linkLabel: "How we work with creators",
    description:
      "We match you with creators from a network of more than 900, write briefs they can work with, and handle contracts, usage rights, and payment. You approve the shortlist and the final cut. We handle everything in between.",
    included: [
      "Creator shortlists matched to your audience",
      "Briefs, contracts, and usage rights",
      "Review and approval rounds",
      "Payment and invoicing",
      "Creator posts set up for paid promotion",
    ],
    outcomes: [
      "Content that sounds like the people your audience follows",
      "Clear rights to everything you pay for",
      "Creators who want to work with you again",
    ],
    relatedCase: "tidewater-swim",
    preview: {
      id: "service-creators",
      ratio: "9:16",
      kind: "video",
      label: "Creator filming in a kitchen",
      alt: "A creator filming herself cooking, phone propped against a fruit bowl.",
      tone: "dusk",
    },
  },
  {
    slug: "reporting",
    name: "Reporting and insights",
    oneLine: "A one-page report every Monday. Plain numbers, plain sentences.",
    linkLabel: "What the report covers",
    description:
      "Every Monday you get one page: what we posted, what worked, what didn't, and what changes this week. Once a quarter we go deeper, with a review of the numbers your business actually runs on.",
    included: [
      "A one-page weekly report",
      "A quarterly review and planning session",
      "Dashboards for your team",
      "Competitor and trend notes",
      "Attribution to sales where tracking allows",
    ],
    outcomes: [
      "A report people actually read",
      "Decisions made on numbers, not hunches",
      "A clear line from social to revenue",
    ],
    relatedCase: "kilo-skincare",
    preview: {
      id: "service-reporting",
      ratio: "9:16",
      label: "Monday report, one page",
      alt: "A single printed page of weekly results with three numbers circled.",
      tone: "midnight",
    },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
