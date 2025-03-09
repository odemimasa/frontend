import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";
import { toZonedTime } from "date-fns-tz";

function getCurrentDate(timeZone: string): Date {
  const now = new Date();
  return toZonedTime(now, timeZone);
}

function getPrayerTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): PrayerTimes {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.Singapore();
  params.madhab = Madhab.Shafi;

  let prayerTimes = new PrayerTimes(coordinates, date, params);
  const currentHours = prayerTimes.date.getHours();
  const fajrHours = prayerTimes.fajr.getHours();

  if (currentHours < fajrHours) {
    const previousDate = new Date(prayerTimes.date);
    previousDate.setDate(prayerTimes.date.getDate() - 1);
    prayerTimes = new PrayerTimes(coordinates, previousDate, params);
  }

  return prayerTimes;
}

function capitalizeWord(word: string): string {
  const firstLetter = word[0];
  return firstLetter.toUpperCase() + word.slice(1);
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

export { getCurrentDate, getPrayerTimes, capitalizeWord, formatISODate };
