export type Wordmark = {
  name: string;
  /** How the fictional wordmark is set. All Poppins Bold; only case and tracking change. */
  style: "plain" | "lower" | "tight";
};

/** Fictional clients for the marquee. */
export const clients: Wordmark[] = [
  { name: "hearth&crumb", style: "lower" },
  { name: "Tidewater Swim", style: "plain" },
  { name: "saltgrass hotels", style: "lower" },
  { name: "Kilo", style: "tight" },
  { name: "Bramble Books", style: "plain" },
  { name: "Northpaw", style: "tight" },
  { name: "fieldnote coffee", style: "lower" },
  { name: "Orbit Run Club", style: "plain" },
  { name: "Juniper Lane", style: "tight" },
  { name: "copperline cycles", style: "lower" },
];
