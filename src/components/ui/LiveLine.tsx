"use client";

import { brand } from "@/content/brand";
import { chrome, home } from "@/content/site";
import { formatClock } from "@/lib/time";
import { useMinute } from "./Clock";

/**
 * "It's 02:14 at HQ. We're posting." The server can't know the time, so it
 * holds the line's width invisibly until the client fills it in.
 */
export function LiveLine() {
  const minute = useMinute();
  const place = chrome.hqPlace(brand.hq.city);

  if (minute === null) {
    return (
      <span aria-hidden className="invisible">
        {home.cta.live("00:00", place)}
      </span>
    );
  }

  const time = formatClock(new Date(minute * 60_000), brand.hq.timezone);
  return <span>{home.cta.live(time, place)}</span>;
}
