import { toZonedTime } from "date-fns-tz";

function getCurrentDate(timeZone: string): Date {
  const now = new Date();
  return toZonedTime(now, timeZone);
}

export { getCurrentDate };
