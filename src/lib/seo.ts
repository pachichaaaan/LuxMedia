import { brand } from "@/content/brand";
import { absoluteUrl, siteUrl } from "./site";

/** Only real profile URLs belong in sameAs; bare platform roots are placeholders. */
const profiles = Object.values(brand.socials).filter((url) => {
  try {
    return new URL(url).pathname.replace(/\/+$/, "") !== "";
  } catch {
    return false;
  }
});

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  legalName: brand.legalName,
  url: siteUrl,
  logo: absoluteUrl("/apple-icon"),
  email: brand.email,
  foundingDate: String(brand.founded),
  description: brand.descriptor,
  ...(profiles.length ? { sameAs: profiles } : {}),
};

/** JSON for a <script> tag, with "<" escaped so it can't close the tag early. */
export const toJsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
