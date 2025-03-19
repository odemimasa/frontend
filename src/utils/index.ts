import { toZonedTime } from "date-fns-tz";

function getCurrentDate(timeZone: string): Date {
  const now = new Date();
  return toZonedTime(now, timeZone);
}

function formatISODate(isoString: string, timezone: string) {
  const date = new Date(isoString);

  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: timezone,
  });

  return formatter.format(date);
}

function formatISODateTime(isoString: string, timezone: string) {
  const date = new Date(isoString);

  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: timezone,
  });

  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });

  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
}

function formatTimeFromUnixMs(unixTimeMs: number) {
  const date = new Date(unixTimeMs);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export {
  getCurrentDate,
  formatISODate,
  formatISODateTime,
  formatTimeFromUnixMs,
};
