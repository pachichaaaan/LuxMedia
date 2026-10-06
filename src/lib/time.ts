const clockFormats = new Map<string, Intl.DateTimeFormat>();
const localFormats = new Map<string, Intl.DateTimeFormat>();

/** 24-hour "02:14" in a time zone. Used for the HQ clock. */
export function formatClock(date: Date, timeZone: string) {
  let format = clockFormats.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone,
    });
    clockFormats.set(timeZone, format);
  }
  return format.format(date);
}

/** 12-hour "4:12pm" in a time zone. Used for team local times. */
export function formatLocalTime(date: Date, timeZone: string) {
  let format = localFormats.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    });
    localFormats.set(timeZone, format);
  }
  return format.format(date).replace(/\s?([AP])M$/i, (_, m: string) => `${m.toLowerCase()}m`);
}

/** Milliseconds until the next minute boundary, so clocks tick on the minute. */
export const msUntilNextMinute = (now = Date.now()) => 60_000 - (now % 60_000);
