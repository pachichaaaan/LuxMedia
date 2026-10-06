/**
 * Brand facts. Placeholder values: rebranding starts here, then the other
 * files in `src/content/`.
 */
export const brand = {
  name: "The Lux Expo",
  legalName: "The Lux Expo Inc.",
  /** The handle shown inside Story frames. */
  handle: "theluxexpo",
  tagline: "We work the hours your audience scrolls.",
  descriptor: "Social media management for brands that never close.",
  founded: 2015,
  /** Set `city` to a real place to switch copy from "at HQ" to "in <city>". */
  hq: { city: "TBD", timezone: "Asia/Manila" },
  email: "jermainemartin@gmail.com",
  socials: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/",
  },
} as const;

/** Display labels for `brand.socials`, in footer order. */
export const socialLabels: Record<keyof typeof brand.socials, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};
