import { brand } from "@/content/brand";
import { about } from "@/content/site";
import { capitalize, numberToWords, yearsSince } from "./words";

/** "Eleven years on the night shift.", counted from the founding year. */
export const aboutHeadline = (now = new Date()) =>
  about.headline(capitalize(numberToWords(yearsSince(brand.founded, now))));
