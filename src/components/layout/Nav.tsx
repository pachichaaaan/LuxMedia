"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { brand } from "@/content/brand";
import { chrome, navLinks } from "@/content/site";
import { REDUCED_MOTION } from "@/lib/motion";
import { MobileMenu } from "./MobileMenu";

const HIDE_AFTER = 120;

/**
 * Brand left, links right. Hides on scroll down and returns on scroll up.
 * It reads the surface underneath it, so its colors always match the
 * section it sits over.
 */
export function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  // Keyed to the path, so the menu closes itself on navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const menuOpen = openOn === pathname;
  const closeMenu = useCallback(() => setOpenOn(null), []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < HIDE_AFTER) header.dataset.hidden = "false";
      else if (!reduced && Math.abs(delta) > 6) header.dataset.hidden = String(delta > 0);
      if (Math.abs(delta) > 6 || y < HIDE_AFTER) lastY = y;
      header.dataset.atTop = String(y < 8);

      const probeY = header.offsetHeight / 2;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, probeY)
        .find((element) => !header.contains(element) && !element.closest(".transition-panel"));
      const surface = under?.closest<HTMLElement>("[data-surface]");
      if (surface) {
        header.dataset.surface = surface.dataset.surface ?? "night";
        header.style.setProperty("--nav-bg", getComputedStyle(surface).backgroundColor);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return (
    <>
      <header
        ref={headerRef}
        className="site-header fixed inset-x-0 top-0 z-50"
        data-surface="night"
        data-hidden="false"
        data-at-top="true"
      >
        <nav
          aria-label="Main"
          className="flex h-(--nav-height) items-center justify-between page-x"
        >
          <Magnetic strength={0.2}>
            <TransitionLink href="/" aria-label={chrome.homeLabel} className="link-quiet">
              {brand.name}
            </TransitionLink>
          </Magnetic>

          <ul className="hidden items-center gap-8 md:flex lg:gap-10">
            {navLinks.map((link) => {
              const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Magnetic strength={0.25}>
                    <TransitionLink
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className="inline-flex items-start link-quiet aria-[current=page]:decoration-current"
                    >
                      {link.label}
                      {link.href === "/contact" && (
                        <span aria-hidden className="mt-1 ml-1 size-2 rounded-pill bg-badge" />
                      )}
                    </TransitionLink>
                  </Magnetic>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className="link-quiet md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setOpenOn(pathname)}
          >
            {chrome.menuOpen}
          </button>
        </nav>
      </header>

      <MobileMenu open={menuOpen} pathname={pathname} onClose={closeMenu} />
    </>
  );
}
