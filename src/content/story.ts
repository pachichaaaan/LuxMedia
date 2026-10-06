import { brand } from "./brand";
import type { Visual } from "./types";

export type Chapter = {
  id: string;
  /** Shown top-right inside the frame. */
  year: string;
  title: string;
  /** Two or three sentences beside the frame on the home page. */
  body: string;
  /** Longer telling for the About page. */
  long: string[];
  visual: Visual;
  /**
   * Section background for this chapter, night to morning. Each stop was
   * checked for AA against its ink (see DESIGN.md, Story background stops).
   */
  stop: string;
  ink: "light" | "dark";
};

export const story: Chapter[] = [
  {
    id: "night-shift",
    year: "2015",
    title: "The night shift.",
    body: "Two friends ran three local accounts from a kitchen table after their day jobs. They posted at 11pm, because that's when the customers were awake.",
    long: [
      "Aiko Santos and Ben Lacson both had day jobs in marketing, and both had noticed the same thing: the brands they admired went quiet at 6pm, which is exactly when their customers picked up their phones.",
      "So they took on three local accounts, a barber, a noodle bar, and a bike shop, and ran them from Aiko's kitchen table between 9pm and 1am. Posts went up at 11pm. Replies went out within the hour. Within a year, all three had their best weekends on record.",
    ],
    visual: {
      id: "story-2015",
      ratio: "9:16",
      label: "Kitchen table, two laptops, 11pm",
      alt: "Two laptops open on a kitchen table late at night, phones charging beside them.",
      tone: "dusk",
    },
    stop: "#1B1638",
    ink: "light",
  },
  {
    id: "the-inbox",
    year: "2017",
    title: "The post that broke the inbox.",
    body: "A 14-second video for a neighborhood bakery crossed 4 million views in a weekend. By Monday there were 300 unread messages. They made their first hires.",
    long: [
      "Hearth & Crumb was a two-oven bakery on a quiet street. Ben filmed the first tray of the morning coming out at 5:40am: fourteen seconds, no music, just the sound of the crust. They posted it at 11pm on a Friday.",
      "By Sunday it had 4 million views. By Monday there were 300 unread messages: directions, wholesale orders, and one marriage proposal. They answered every one, then hired two people so it would never take that long again.",
    ],
    visual: {
      id: "story-2017",
      ratio: "9:16",
      kind: "video",
      label: "Bakery reel, 14 seconds",
      alt: "A tray of bread coming out of a bakery oven before sunrise.",
      tone: "lilac",
    },
    stop: "#241E48",
    ink: "light",
  },
  {
    id: "the-system",
    year: "2019",
    title: "Building the system.",
    body: "A shared content calendar, a response playbook, and a weekly report clients actually read. It held up for 40 brands.",
    long: [
      "Growth broke the group chat. The team replaced it with three things that still run the company: one content calendar every client can see, a playbook that says how to answer anything from a compliment to a crisis, and a one-page report that goes out every Monday.",
      "None of it was clever. All of it was written down. By the end of the year, 40 brands were running on it.",
    ],
    visual: {
      id: "story-2019",
      ratio: "9:16",
      label: "Content calendar on the office wall",
      alt: "A wall-sized content calendar covered in handwritten cards.",
      tone: "lilac",
    },
    stop: "#30285C",
    ink: "light",
  },
  {
    id: "everyone-online",
    year: "2020",
    title: "Everyone moved online.",
    body: "Overnight, every client's storefront became their feed. The team became a 24/7 community desk across three time zones.",
    long: [
      "When shops closed, the comments section became the front counter. Clients who had treated social as advertising suddenly needed it to take orders, answer complaints, and explain new opening hours, all day and all night.",
      "The team split into three shifts across Manila, Lisbon, and Mexico City, with written handovers at the end of each one. It has run that way, without a gap, ever since.",
    ],
    visual: {
      id: "story-2020",
      ratio: "9:16",
      label: "Night desk, three clocks",
      alt: "A community desk at night with three wall clocks set to different time zones.",
      tone: "midnight",
    },
    stop: "#D2CCF6",
    ink: "dark",
  },
  {
    id: "creator-era",
    year: "2023",
    title: "The creator era.",
    body: "Short-form video stopped being optional. The team opened an in-house studio and built a network of more than 900 creators.",
    long: [
      "Audiences started trusting people over brands, and nine-second videos over polished campaigns. Clients needed both, every week, in every format.",
      "So the team built a small studio with its own editors, and a network of more than 900 creators who can be briefed on Monday and posting by Friday. The studio now makes most of what the company publishes.",
    ],
    visual: {
      id: "story-2023",
      ratio: "9:16",
      label: "Studio shoot, phone on a tripod",
      alt: "A creator filming a short video on a phone mounted on a tripod.",
      tone: "dusk",
    },
    stop: "#E6E2FF",
    ink: "dark",
  },
  {
    id: "today",
    year: "Today",
    title: "Every platform, every hour.",
    body: "120 people and more than 200 brands. Someone is on shift whenever your audience is online.",
    long: [
      `Today ${brand.name} is 120 people across three time zones, working for more than 200 brands on every platform that matters this year, and a few that might matter next year.`,
      "The kitchen table is gone. The hours haven't changed.",
    ],
    visual: {
      id: "story-today",
      ratio: "9:16",
      label: "The team at shift change",
      alt: "The team gathered in the office at shift change, some arriving and some leaving.",
      tone: "midnight",
    },
    stop: "#F3F4F8",
    ink: "dark",
  },
];

/** The chapter whose frame shows the unread counter. */
export const unreadChapter = { id: "the-inbox", count: 300 } as const;
