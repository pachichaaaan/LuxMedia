"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DisclosureProps = {
  summary: ReactNode;
  children: ReactNode;
  /** Heading level wrapping the button, so the outline stays correct. */
  level?: 2 | 3 | 4;
  defaultOpen?: boolean;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
};

/**
 * Accessible disclosure: a real button inside a heading, `aria-expanded`
 * and `aria-controls` wired up, and a panel that is `hidden` when closed.
 */
export function Disclosure({
  summary,
  children,
  level = 3,
  defaultOpen = false,
  className,
  buttonClassName,
  panelClassName,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const Heading = `h${level}` as const;

  return (
    <div className={className}>
      <Heading className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={cn("flex w-full items-start justify-between gap-6 text-left", buttonClassName)}
        >
          <span>{summary}</span>
          <span aria-hidden className="shrink-0 tabular-nums">
            {open ? "–" : "+"}
          </span>
        </button>
      </Heading>
      <div id={panelId} hidden={!open} className={panelClassName}>
        {children}
      </div>
    </div>
  );
}
