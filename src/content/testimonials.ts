import { brand } from "./brand";

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  /** Relative timestamp, written the way a comment thread shows it. */
  posted: string;
  likes: number;
  /** Included in the home page comment thread. */
  inThread: boolean;
  /** An optional reply from the team, shown indented under the comment. */
  reply?: { text: string; posted: string; likes: number };
};

/** People and companies are fictional. */
export const testimonials: Testimonial[] = [
  {
    id: "mara-quintos",
    name: "Mara Quintos",
    role: "Head of brand, Saltgrass Hotels",
    quote: "They answered a guest at 3:40am on a Sunday, in our voice. Better than we would have.",
    posted: "2w",
    likes: 1204,
    inThread: true,
    reply: { text: "We were up anyway.", posted: "2w", likes: 318 },
  },
  {
    id: "joel-ramirez",
    name: "Joel Ramírez",
    role: "Founder, Kilo Skincare",
    quote:
      "The weekly report is one page. I read it on Monday before my coffee is cold, and I know exactly what to do with it.",
    posted: "3w",
    likes: 877,
    inThread: true,
  },
  {
    id: "ines-baptiste",
    name: "Inès Baptiste",
    role: "Marketing director, Tidewater Swim",
    quote:
      "We asked for more followers. They asked what a follower was worth to us. That question paid for the whole retainer.",
    posted: "5w",
    likes: 642,
    inThread: true,
  },
  {
    id: "dev-okafor",
    name: "Dev Okafor",
    role: "Owner, Hearth & Crumb",
    quote: "We hired them for one video in 2017. We still haven't found a reason to stop.",
    posted: "1y",
    likes: 2310,
    inThread: true,
  },
  {
    id: "hana-whitlock",
    name: "Hana Whitlock",
    role: "Marketing manager, Bramble Books",
    quote:
      "Closing two accounts felt like giving up. It turned out to be the best decision we made all year.",
    posted: "4d",
    likes: 156,
    inThread: false,
  },
];

export const threadAuthor = { name: brand.handle };

export const getTestimonial = (id: string) => testimonials.find((t) => t.id === id);
