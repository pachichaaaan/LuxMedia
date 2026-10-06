import { TransitionLink } from "@/components/motion/TransitionLink";
import { brand, socialLabels } from "@/content/brand";
import { chrome, navLinks } from "@/content/site";

type SocialKey = keyof typeof brand.socials;

/** Quiet by design: the closing statement above it holds the big type. */
export function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.keys(brand.socials) as SocialKey[];

  return (
    <footer data-surface="night" className="page-grid gap-y-10 pt-12 pb-10 text-small">
      <div aria-hidden className="col-span-full border-t border-rule" />

      <div className="col-span-full md:col-span-3 lg:col-span-4">
        <p className="text-ink">{brand.name}</p>
        <p className="mt-1 max-w-[26ch] text-ink-meta">{brand.descriptor}</p>
      </div>

      <nav aria-label={chrome.footerNavLabel} className="col-span-2 md:col-span-2 lg:col-start-6">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <TransitionLink href={link.href} className="link-quiet text-ink">
                {link.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label={chrome.socialNavLabel} className="col-span-2 md:col-span-2 lg:col-start-9">
        <ul className="space-y-1">
          {socials.map((key) => (
            <li key={key}>
              <a href={brand.socials[key]} className="link-quiet text-ink">
                {socialLabels[key]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="col-span-full md:col-span-1 lg:col-span-2 lg:col-start-11">
        <TransitionLink href="/privacy" className="link-quiet text-ink">
          {chrome.privacy}
        </TransitionLink>
      </div>

      <p className="col-span-full text-ink-meta">{chrome.copyright(year)}</p>
    </footer>
  );
}
