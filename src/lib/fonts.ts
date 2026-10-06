import { Poppins } from "next/font/google";

/** The only typeface and the only weight on the site. Self-hosted at build. */
export const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});
