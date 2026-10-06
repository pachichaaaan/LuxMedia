"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  pressed: boolean;
};

/** A toggle pill. State is announced through `aria-pressed`, not color alone. */
export function Chip({ pressed, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "chip inline-flex min-h-11 items-center rounded-pill border-2 px-5 text-small",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
