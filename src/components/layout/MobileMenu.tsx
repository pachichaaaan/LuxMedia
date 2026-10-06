"use client";

import { useEffect, useRef } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { brand, socialLabels } from "@/content/brand";
import { chrome, navLinks } from "@/content/site";
import { lockScroll, unlockScroll } from "@/lib/scroll";

type MobileMenuProps = {
  open: boolean;
  pathname: string;
  onClose: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
type SocialKey = keyof typeof brand.socials;

/**
 * Full-screen menu under 768px. While open: focus is trapped inside, Esc
 * closes it, the page behind is inert, and scrolling is locked.
 */
export function MobileMenu({ open, pathname, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const background = [
      document.getElementById("content"),
      document.querySelector<HTMLElement>("body > footer"),
      document.querySelector<HTMLElement>(".site-header"),
    ].filter((element): element is HTMLElement => Boolean(element));

    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    background.forEach((element) => (element.inert = true));
    lockScroll();
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      background.forEach((element) => (element.inert = false));
      unlockScroll();
      // Only once the page is interactive again can focus go back to the trigger.
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open, onClose]);

  const socials = Object.keys(brand.socials) as SocialKey[];

  return (
    <div
      ref={dialogRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={chrome.menuLabel}
      data-surface="night"
      data-open={open}
      className="mobile-menu fixed inset-0 z-70 flex flex-col md:hidden"
    >
      <div className="flex h-(--nav-height) shrink-0 items-center justify-between page-x">
        <TransitionLink href="/" aria-label={chrome.homeLabel} className="link-quiet">
          {brand.name}
        </TransitionLink>
        <button ref={closeRef} type="button" className="link-quiet" onClick={onClose}>
          {chrome.menuClose}
        </button>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto page-x pt-10">
        <ul className="space-y-3">
          {navLinks.map((link) => {
            const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <TransitionLink
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  onClick={current ? onClose : undefined}
                  className="inline-flex items-start text-h1 link-quiet"
                >
                  {link.label}
                  {link.href === "/contact" && (
                    <span aria-hidden className="mt-[0.15em] ml-2 size-3 rounded-pill bg-badge" />
                  )}
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 space-y-3 page-x pt-8 pb-10 text-small">
        <a href={`mailto:${brand.email}`} className="link-inline text-ink">
          {brand.email}
        </a>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {socials.map((key) => (
            <li key={key}>
              <a href={brand.socials[key]} className="link-quiet text-ink">
                {socialLabels[key]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
