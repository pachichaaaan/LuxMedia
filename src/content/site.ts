import { brand } from "./brand";
import type { Link, Visual } from "./types";

/** Primary navigation, in display order. */
export const navLinks: Link[] = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export const chrome = {
  skipLink: "Skip to content",
  homeLabel: `${brand.name}, home`,
  menuOpen: "Menu",
  menuClose: "Close",
  menuLabel: "Site menu",
  privacy: "Privacy",
  copyright: (year: number) => `© ${year} ${brand.legalName}`,
  footerNavLabel: "Footer",
  socialNavLabel: "Social",
  /** Phrase for the HQ clock: "at HQ" until a real city is set in brand.ts. */
  hqPlace: (city: string) => (city && city !== "TBD" ? `in ${city}` : "at HQ"),
};

export type FeedPost = {
  handle: string;
  caption: string;
  visual: Visual;
};

export const home = {
  meta: {
    title: `${brand.name}: social media management, around the clock`,
    description: `${brand.descriptor} Strategy, short-form video, 24/7 community management, paid social, creators, and a one-page report every Monday.`,
  },
  hero: {
    live: "Posting now",
    feedLabel: "Posts going out now for our clients",
    pause: "Pause feed",
    play: "Play feed",
    feed: [
      {
        handle: "hearthandcrumb",
        caption: "First tray out at 5:40. Doors open at 6.",
        visual: {
          id: "hero-feed-1",
          ratio: "9:16",
          kind: "video",
          label: "Bread tray out of the oven",
          alt: "A baker pulling a tray of loaves out of the oven before sunrise.",
          tone: "dusk",
        },
      },
      {
        handle: "tidewaterswim",
        caption: "Forty laps in. Still holding its shape.",
        visual: {
          id: "hero-feed-2",
          ratio: "9:16",
          kind: "video",
          label: "Open-water swimmer at dawn",
          alt: "A swimmer in a Tidewater suit walking out of the sea at dawn.",
          tone: "lilac",
        },
      },
      {
        handle: "saltgrasshotels",
        caption: "Late checkout is 1pm. Ask the desk, or ask us here.",
        visual: {
          id: "hero-feed-3",
          ratio: "9:16",
          label: "Hotel balcony after dark",
          alt: "A hotel balcony at night with the sea lit by the moon.",
          tone: "haze",
        },
      },
      {
        handle: "kiloskin",
        caption: "Does it pill under sunscreen? No. Here's 20 seconds of proof.",
        visual: {
          id: "hero-feed-4",
          ratio: "9:16",
          kind: "video",
          label: "Sunscreen over moisturizer",
          alt: "A hand smoothing sunscreen over moisturizer without it pilling.",
          tone: "dusk",
        },
      },
    ] satisfies FeedPost[],
  },
  story: {
    heading: "Our story, 2015 to today",
    viewerLabel: "Our story. Use the left and right arrow keys to move between chapters.",
    previous: "Previous chapter",
    next: "Next chapter",
    unreadLabel: (count: number) => `${count} unread`,
    announce: (index: number, total: number, title: string) =>
      `Chapter ${index} of ${total}: ${title.replace(/\.$/, "")}`,
  },
  services: {
    heading: "Six services. Most clients start with two.",
    allLink: "See all services",
  },
  work: {
    heading: "Work that moved a number.",
    allLink: "See all work",
  },
  comments: {
    heading: "From the comments.",
    likes: (n: number) => `${n.toLocaleString("en-US")} ${n === 1 ? "like" : "likes"}`,
    replyLabel: "Reply from the team",
  },
  clients: {
    heading: "Brands we post for",
    pause: "Pause",
    play: "Play",
    pauseLabel: "Pause the scrolling client names",
    playLabel: "Play the scrolling client names",
  },
  process: {
    heading: "Four steps, repeated every month.",
  },
  cta: {
    statement: "Your audience is online right now.",
    button: "Start a project",
    live: (time: string, place: string) => `It's ${time} ${place}. We're posting.`,
  },
};

export const about = {
  meta: {
    title: "About",
    description: `How two friends on a night shift became ${brand.name}: 120 people covering every hour for more than 200 brands.`,
  },
  /** `years` is spelled out and capitalized by the page, from `brand.founded`. */
  headline: (years: string) => `${years} years on the night shift.`,
  intro:
    "The company started because the brands we liked stopped talking at 6pm, and their customers didn't. It's still the whole idea.",
  storyHeading: "How we got here.",
  valuesHeading: "Three things we won't change.",
  values: [
    "Every comment deserves a reply from someone who read it.",
    "The feed changes every year. Our hours don't.",
    "If we can't measure it, we say so.",
  ],
  teamHeading: "Some of the people on shift.",
  teamTimeLabel: (time: string, city: string) => `${time} in ${city}`,
  careers: {
    heading: "We hire for every time zone.",
    body: "Editors, community managers, strategists, and people who are good at 3am. If that's you, tell us what you'd do with our own accounts.",
    link: "Email us about open roles",
    subject: "Open roles",
  },
};

export const servicesPage = {
  meta: {
    title: "Services",
    description:
      "Social strategy, short-form video, 24/7 community management, paid social, creator partnerships, and reporting, all run by one team.",
  },
  headline: "Six services, one desk.",
  intro:
    "Most clients start with two. Everything is run by the same team, so your strategy, your posts, and your replies sound like one brand.",
  jumpLabel: "Jump to a service",
  includedLabel: "What's included",
  outcomesLabel: "Typical outcomes",
  relatedLabel: "Related case study",
  processHeading: "Four steps, repeated every month.",
  faqHeading: "Questions we get asked first.",
};

export const workPage = {
  meta: {
    title: "Work",
    description:
      "Case studies with the numbers left in: follower growth, reply times, cost per purchase, and the posts that moved them.",
  },
  headline: "Case studies, with the numbers left in.",
  filterLabel: "Filter by service",
  allLabel: "All work",
  empty: "No case studies for this service yet.",
  emptyReset: "Show all work",
  countLabel: (n: number) => `${n} ${n === 1 ? "case study" : "case studies"}`,
};

export const caseStudyPage = {
  servicesLabel: "Services",
  yearLabel: "Year",
  platformsLabel: "Platforms",
  challengeHeading: "The challenge",
  approachHeading: "Our approach",
  workHeading: "The work",
  resultsHeading: "Results",
  nextLabel: "Next case study",
  backLabel: "All work",
};

export const notFoundPage = {
  meta: { title: "Post not available" },
  message: "This post is no longer available.",
  link: "Go to the home page",
};
