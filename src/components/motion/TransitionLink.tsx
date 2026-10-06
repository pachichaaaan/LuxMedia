"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToTarget } from "@/lib/scroll";
import { useTransitionNavigate } from "./PageTransition";

export type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * Internal link that plays the page transition. Modified clicks, new tabs,
 * and same-page anchors keep their native behavior; prefetching is untouched.
 */
export function TransitionLink({ href, onClick, ...props }: TransitionLinkProps) {
  const navigate = useTransitionNavigate();
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !navigate) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (props.target && props.target !== "_self") return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    const samePage =
      url.pathname === window.location.pathname && url.search === window.location.search;
    if (samePage) {
      event.preventDefault();
      const target = url.hash
        ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
        : null;
      if (target) {
        scrollToTarget(target);
        window.history.replaceState(window.history.state, "", url.hash);
      } else if (!url.hash) {
        scrollToTarget(0);
      }
      return;
    }

    event.preventDefault();
    // Same page, different query (filters): no transition, just update the URL.
    if (url.pathname === window.location.pathname) {
      router.push(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
      return;
    }
    navigate(`${url.pathname}${url.search}${url.hash}`);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
