"use client";

import { useSyncExternalStore } from "react";
import { brand } from "@/content/brand";
import { formatClock, msUntilNextMinute } from "@/lib/time";
import { cn } from "@/lib/utils";

/** One shared ticker, aligned to the minute boundary. */
function subscribe(onTick: () => void) {
  let interval: ReturnType<typeof setInterval> | undefined;
  const timeout = setTimeout(() => {
    onTick();
    interval = setInterval(onTick, 60_000);
  }, msUntilNextMinute());
  return () => {
    clearTimeout(timeout);
    if (interval) clearInterval(interval);
  };
}

const currentMinute = () => Math.floor(Date.now() / 60_000);
const noMinute = () => null;

/** The current minute on the client, `null` on the server and during hydration. */
export function useMinute() {
  return useSyncExternalStore(subscribe, currentMinute, noMinute);
}

type ClockProps = {
  timeZone?: string;
  className?: string;
};

/**
 * Live 24-hour time in the HQ time zone. The server can't know the visitor's
 * moment, so it renders an invisible "00:00" that holds the width until the
 * real time arrives on mount.
 */
export function Clock({ timeZone = brand.hq.timezone, className }: ClockProps) {
  const minute = useMinute();

  if (minute === null) {
    return (
      <span aria-hidden className={cn("invisible tabular-nums", className)}>
        00:00
      </span>
    );
  }

  const date = new Date(minute * 60_000);
  return (
    <time dateTime={date.toISOString()} className={cn("tabular-nums", className)}>
      {formatClock(date, timeZone)}
    </time>
  );
}
