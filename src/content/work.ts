import type { Metric, Ratio, Visual } from "./types";

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  /** The result line used on the rail, the grid, and as the case study h1. */
  headline: string;
  /** Meta description and Open Graph text. */
  summary: string;
  /** Service slugs from `services.ts`. */
  services: string[];
  year: number;
  platforms: string[];
  /** Ratio used on the home rail and the work grid. */
  ratio: Ratio;
  cover: Visual;
  challenge: string[];
  approach: string[];
  gallery: Visual[];
  results: [Metric, Metric, Metric];
  /** Testimonial id from `testimonials.ts`. */
  testimonial: string;
};

export const work: CaseStudy[] = [
  {
    slug: "tidewater-swim",
    client: "Tidewater Swim",
    industry: "Swimwear",
    headline: "From 8k to 210k followers in nine months.",
    summary:
      "How twelve swimmers, not models, took a swimwear brand from 8,000 followers to 210,000 in nine months.",
    services: ["creator-partnerships", "content-and-video", "paid-social"],
    year: 2025,
    platforms: ["Instagram", "TikTok"],
    ratio: "9:16",
    cover: {
      id: "work-tidewater-cover",
      ratio: "9:16",
      kind: "video",
      label: "Open-water swim at 6am",
      alt: "A swimmer in a Tidewater suit walking out of the sea at sunrise.",
      tone: "lilac",
    },
    challenge: [
      "Tidewater made good swimwear and posted like a catalog: flat lays, product codes, and a link in bio. It had 8,000 followers, most of them friends of the founders.",
      "Every spring launch went out to the same small audience and sold through slowly. Paid ads using the catalog shots cost more each season.",
    ],
    approach: [
      "We stopped showing the product and started showing the water. Twelve creators who actually swim, from open-water clubs to lifeguards, filmed what a suit looks like after forty laps.",
      "The studio cut each shoot into a dozen short videos. The ones that held attention organically became the ads, so the paid budget only backed work that had already proved itself.",
    ],
    gallery: [
      {
        id: "work-tidewater-1",
        ratio: "9:16",
        kind: "video",
        label: "Open-water club, 6am",
        alt: "An open-water swimming club wading in together at dawn.",
        tone: "lilac",
      },
      {
        id: "work-tidewater-2",
        ratio: "4:5",
        label: "Lifeguard on shift",
        alt: "A lifeguard in a Tidewater suit watching the water from her chair.",
        tone: "dusk",
      },
      {
        id: "work-tidewater-3",
        ratio: "1:1",
        label: "Suit after 40 laps, close-up",
        alt: "Close-up of swimsuit fabric still holding its shape after a long swim.",
        tone: "haze",
      },
      {
        id: "work-tidewater-4",
        ratio: "9:16",
        kind: "video",
        label: "Launch reel, 22 seconds",
        alt: "A fast-cut launch video of swimmers diving into a pool one after another.",
        tone: "dusk",
      },
    ],
    results: [
      { value: "210k", label: "Followers, up from 8k" },
      { value: "4.1M", label: "Views on the launch series" },
      { value: "38%", label: "Of online sales from social, up from 6%" },
    ],
    testimonial: "ines-baptiste",
  },
  {
    slug: "saltgrass-hotels",
    client: "Saltgrass Hotels",
    industry: "Hospitality",
    headline: "Median reply time cut from 9 hours to 14 minutes.",
    summary:
      "How a 24/7 desk and a playbook written with six front desks turned a slow social inbox into the fastest way to reach a Saltgrass hotel.",
    services: ["community-management", "reporting"],
    year: 2024,
    platforms: ["Instagram", "Facebook", "TikTok"],
    ratio: "4:5",
    cover: {
      id: "work-saltgrass-cover",
      ratio: "4:5",
      label: "Balcony at dusk, guest photo",
      alt: "A hotel balcony overlooking the sea at dusk, a towel over the railing.",
      tone: "dusk",
    },
    challenge: [
      "Guests asked about late checkout, lost chargers, and parking in the comments, and got answers the next afternoon. Some of those questions turned into one-star reviews before anyone at the hotels saw them.",
      "Six properties shared one social inbox, run by a marketing team that went home at 6pm.",
    ],
    approach: [
      "We put Saltgrass on the 24/7 desk and wrote a playbook with the front-desk managers at all six properties, so replies could be specific: the real checkout time, the real parking garage, the name of the person who could help.",
      "Anything that needed someone at the hotel reached the right person within ten minutes, and the guest was told who it was and when to expect them.",
    ],
    gallery: [
      {
        id: "work-saltgrass-1",
        ratio: "9:16",
        label: "Reply thread, 2:10am",
        alt: "A phone screen showing a guest question and a reply sent four minutes later.",
        tone: "midnight",
      },
      {
        id: "work-saltgrass-2",
        ratio: "1:1",
        label: "Front-desk handover note",
        alt: "A handwritten handover note on the front desk listing three guest requests.",
        tone: "haze",
      },
      {
        id: "work-saltgrass-3",
        ratio: "16:9",
        label: "Pool at 2am, lights on",
        alt: "An empty hotel pool lit from below in the middle of the night.",
        tone: "dusk",
      },
      {
        id: "work-saltgrass-4",
        ratio: "4:5",
        label: "Guest photo, breakfast terrace",
        alt: "A guest's photo of breakfast on a sunny terrace, shared and reposted.",
        tone: "lilac",
      },
    ],
    results: [
      { value: "14 min", label: "Median reply time, down from 9 hours" },
      { value: "62%", label: "Fewer complaints posted publicly" },
      { value: "4.7", label: "Average review rating, up from 4.1" },
    ],
    testimonial: "mara-quintos",
  },
  {
    slug: "kilo-skincare",
    client: "Kilo Skincare",
    industry: "Skincare",
    headline: "Cost per purchase down 41% in one quarter.",
    summary:
      "How Kilo's own comment section became the script for 60 short ads, and only the ones that sold were scaled.",
    services: ["paid-social", "content-and-video", "reporting"],
    year: 2025,
    platforms: ["Instagram", "TikTok", "YouTube"],
    ratio: "1:1",
    cover: {
      id: "work-kilo-cover",
      ratio: "1:1",
      label: "Jar on a bathroom shelf",
      alt: "A jar of Kilo moisturizer on a tiled bathroom shelf in morning light.",
      tone: "haze",
    },
    challenge: [
      "Kilo was spending more each month to sell the same number of jars. The ads were polished studio shots that looked like ads, and people scrolled past them like ads.",
      "Around 30 ads ran at any one time, and nobody could say which of them was doing the work.",
    ],
    approach: [
      "We rebuilt the creative from the comments up. The most common questions under Kilo's posts became the scripts: what's in it, how long a jar lasts, whether it pills under sunscreen.",
      "We shot 60 short answers, tested each one on a small budget, and only scaled the ones that sold. The Monday report showed which, in one table.",
    ],
    gallery: [
      {
        id: "work-kilo-1",
        ratio: "9:16",
        kind: "video",
        label: "Sunscreen test, 20 seconds",
        alt: "A hand applying sunscreen over moisturizer to show it doesn't pill.",
        tone: "lilac",
      },
      {
        id: "work-kilo-2",
        ratio: "4:5",
        label: "Founder answering a comment",
        alt: "Kilo's founder reading a customer comment aloud to the camera.",
        tone: "dusk",
      },
      {
        id: "work-kilo-3",
        ratio: "9:16",
        kind: "video",
        label: "Ingredient list, read aloud",
        alt: "A close-up of a jar label while a voice reads the ingredient list.",
        tone: "midnight",
      },
      {
        id: "work-kilo-4",
        ratio: "1:1",
        label: "Twelve ad variants, one grid",
        alt: "Twelve versions of the same ad arranged in a grid with results under each.",
        tone: "haze",
      },
    ],
    results: [
      { value: "41%", label: "Lower cost per purchase" },
      { value: "2.6×", label: "Return on ad spend, up from 1.4×" },
      { value: "60", label: "Videos tested in 12 weeks" },
    ],
    testimonial: "joel-ramirez",
  },
  {
    slug: "hearth-and-crumb",
    client: "Hearth & Crumb",
    industry: "Bakery",
    headline: "4 million views in a weekend, and a line out the door.",
    summary:
      "The 14-second bakery video that crossed 4 million views in a weekend, and the 300 messages answered by Monday night.",
    services: ["content-and-video", "community-management"],
    year: 2017,
    platforms: ["Instagram", "Facebook"],
    ratio: "9:16",
    cover: {
      id: "work-hearth-cover",
      ratio: "9:16",
      kind: "video",
      label: "The original reel, 14 seconds",
      alt: "A tray of bread coming out of a bakery oven before sunrise.",
      tone: "dusk",
    },
    challenge: [
      "Hearth & Crumb was a two-oven bakery with a loyal street and no time to post. The owners wanted the next neighborhood over to know they existed.",
      "The account had 400 followers and one photo of a croissant from 2014.",
    ],
    approach: [
      "We filmed the first tray of the morning coming out at 5:40am. Fourteen seconds, no music, just the sound of the crust. We posted it at 11pm on a Friday, when the neighborhood was in bed, scrolling.",
      "By Monday there were 300 messages. We answered every one by that night, from directions to wholesale orders, and set up the posting rhythm the bakery still uses.",
    ],
    gallery: [
      {
        id: "work-hearth-1",
        ratio: "1:1",
        label: "The line outside, Saturday 6am",
        alt: "A queue of people outside a small bakery before opening time.",
        tone: "haze",
      },
      {
        id: "work-hearth-2",
        ratio: "4:5",
        label: "Owner behind the counter",
        alt: "The bakery owner handing a paper bag across the counter.",
        tone: "lilac",
      },
      {
        id: "work-hearth-3",
        ratio: "9:16",
        kind: "video",
        label: "Second-location opening reel",
        alt: "A short video of the doors opening at the bakery's second location.",
        tone: "dusk",
      },
      {
        id: "work-hearth-4",
        ratio: "16:9",
        label: "Kitchen at 5am, ovens on",
        alt: "The bakery kitchen before dawn with both ovens lit.",
        tone: "midnight",
      },
    ],
    results: [
      { value: "4M", label: "Views in one weekend" },
      { value: "300", label: "Messages answered by Monday night" },
      { value: "3", label: "New locations since" },
    ],
    testimonial: "dev-okafor",
  },
  {
    slug: "bramble-books",
    client: "Bramble Books",
    industry: "Independent bookshops",
    headline: "Event sign-ups up 3.4× after closing two accounts.",
    summary:
      "How a bookshop chain did less on social, on purpose, and could finally connect a post to a person walking through the door.",
    services: ["social-strategy", "reporting"],
    year: 2026,
    platforms: ["Instagram", "YouTube"],
    ratio: "4:5",
    cover: {
      id: "work-bramble-cover",
      ratio: "4:5",
      label: "Staff pick, hand on a spine",
      alt: "A bookseller's hand pulling a book from a crowded shelf.",
      tone: "lilac",
    },
    challenge: [
      "Bramble ran accounts on five platforms with one marketing manager. Everything was posted everywhere, nothing got much attention, and nobody could say which posts brought people into the shops.",
    ],
    approach: [
      "We audited all five accounts and recommended closing two. The effort went into Instagram and a weekly YouTube series of staff picks, filmed in the shops.",
      "Every post pointed to a shop event, so the Monday report could finally connect a post to a person walking through the door.",
    ],
    gallery: [
      {
        id: "work-bramble-1",
        ratio: "16:9",
        kind: "video",
        label: "Staff picks episode, shop floor",
        alt: "Two booksellers talking about a novel between the shelves.",
        tone: "dusk",
      },
      {
        id: "work-bramble-2",
        ratio: "9:16",
        label: "Author reading, phone view",
        alt: "An author reading to a small crowd, filmed from the back row on a phone.",
        tone: "midnight",
      },
      {
        id: "work-bramble-3",
        ratio: "1:1",
        label: "Event night, every chair taken",
        alt: "Rows of folding chairs in a bookshop, all of them occupied.",
        tone: "haze",
      },
    ],
    results: [
      { value: "3.4×", label: "Event sign-ups" },
      { value: "2", label: "Accounts closed, on purpose" },
      { value: "27%", label: "Of event guests found the event on social" },
    ],
    testimonial: "hana-whitlock",
  },
];

export const getCaseStudy = (slug: string) => work.find((c) => c.slug === slug);

/** The case study after this one, wrapping to the first. */
export const getNextCaseStudy = (slug: string) => {
  const index = work.findIndex((c) => c.slug === slug);
  return work[(index + 1) % work.length];
};
