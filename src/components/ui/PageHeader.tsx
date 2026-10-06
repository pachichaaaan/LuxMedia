import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  intro?: string;
  surface?: "night" | "day" | "haze";
  /** Display size is for statements; most page headlines use h1. */
  size?: "display" | "h1";
  children?: ReactNode;
  className?: string;
};

/**
 * Top of every inner page. The h1 carries `data-page-title`, which the page
 * transition uses to reveal it line by line after the wipe.
 */
export function PageHeader({
  title,
  intro,
  surface = "night",
  size = "h1",
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      data-surface={surface}
      className={cn(
        "page-grid gap-y-8 pt-[calc(var(--nav-height)+5rem)] pb-16 lg:pt-[calc(var(--nav-height)+9rem)] lg:pb-24",
        className,
      )}
    >
      <h1
        data-page-title
        className={cn(
          "col-span-full text-ink",
          size === "display" ? "text-display lg:col-span-11" : "text-h1 lg:col-span-10",
        )}
      >
        {title}
      </h1>
      {intro && (
        <p className="col-span-full max-w-measure text-body-lg text-ink-body md:col-span-6 lg:col-span-6">
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
