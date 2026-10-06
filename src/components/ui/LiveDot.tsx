import { cn } from "@/lib/utils";

/**
 * The badge-red "live" signal. The pulse is CSS only; under reduced motion it
 * settles to a static dot.
 */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("live-dot relative inline-block size-2.5 shrink-0", className)}
    />
  );
}
