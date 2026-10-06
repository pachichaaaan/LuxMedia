"use client";

import { about } from "@/content/site";
import { formatLocalTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import { useMinute } from "./Clock";

type LocalTimeProps = {
  timeZone: string;
  city: string;
  className?: string;
};

/** "4:12pm in Lisbon", live. Empty on the server, filled in on mount. */
export function LocalTime({ timeZone, city, className }: LocalTimeProps) {
  const minute = useMinute();
  if (minute === null) return <span aria-hidden className={cn("invisible", className)} />;
  const time = formatLocalTime(new Date(minute * 60_000), timeZone);
  return <span className={className}>{about.teamTimeLabel(time, city)}</span>;
}
