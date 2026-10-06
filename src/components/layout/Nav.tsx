import { TransitionLink } from "@/components/motion/TransitionLink";
import { brand } from "@/content/brand";
import { chrome, navLinks } from "@/content/site";

/** Static header. Phase 2 adds hide-on-scroll, surface awareness, and the mobile menu. */
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav aria-label="Main" className="flex h-(--nav-height) items-center justify-between page-x">
        <TransitionLink href="/" aria-label={chrome.homeLabel} className="link-quiet">
          {brand.name}
        </TransitionLink>
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <TransitionLink href={link.href} className="inline-flex items-start link-quiet">
                {link.label}
                {link.href === "/contact" && (
                  <span aria-hidden className="ml-1 size-2 rounded-pill bg-badge" />
                )}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
