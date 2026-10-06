import Link from "next/link";
import type { ComponentProps } from "react";

export type TransitionLinkProps = ComponentProps<typeof Link>;

/**
 * Internal link. Phase 2 routes clicks through the page-transition provider;
 * until then it is a plain `next/link`.
 */
export function TransitionLink(props: TransitionLinkProps) {
  return <Link {...props} />;
}
