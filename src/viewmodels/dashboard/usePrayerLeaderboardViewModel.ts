import type { PrayerName } from "@hooks/useStore";
import type { PrayerStatistics } from "./usePrayerReportViewModel";

interface PrayerStatus {
  prayerName: PrayerName;
  statusCount: number;
}

function getMostFrequentPrayer(
  prayerStatuses: PrayerStatus[]
): PrayerName | undefined {
  if (prayerStatuses.length === 0) return undefined;

  const mostFrequent = prayerStatuses.reduce((prev, current) =>
    current.statusCount > prev.statusCount ? current : prev
  );

  return mostFrequent.statusCount > 0 ? mostFrequent.prayerName : undefined;
}

function usePrayerLeaderboardViewModel() {
  const findMostOnTimePrayer = (prayerStatistics: PrayerStatistics) => {
    const prayerNames: PrayerName[] = [
      "subuh",
      "zuhur",
      "asar",
      "magrib",
      "isya",
    ];

    const prayerOnTimeStats: PrayerStatus[] = prayerNames.map((name) => ({
      prayerName: name,
      statusCount: prayerStatistics.get(name)?.[2] ?? 0,
    }));

    return getMostFrequentPrayer(prayerOnTimeStats);
  };

  const findMostLatePrayer = (prayerStatistics: PrayerStatistics) => {
    const prayerNames: PrayerName[] = [
      "subuh",
      "zuhur",
      "asar",
      "magrib",
      "isya",
    ];

    const prayerLateStats: PrayerStatus[] = prayerNames.map((name) => ({
      prayerName: name,
      statusCount: prayerStatistics.get(name)?.[1] ?? 0,
    }));

    return getMostFrequentPrayer(prayerLateStats);
  };

  const findMostMissedPrayer = (prayerStatistics: PrayerStatistics) => {
    const prayerNames: PrayerName[] = [
      "subuh",
      "zuhur",
      "asar",
      "magrib",
      "isya",
    ];

    const prayerMissedStats: PrayerStatus[] = prayerNames.map((name) => ({
      prayerName: name,
      statusCount: prayerStatistics.get(name)?.[0] ?? 0,
    }));

    return getMostFrequentPrayer(prayerMissedStats);
  };

  return { findMostOnTimePrayer, findMostLatePrayer, findMostMissedPrayer };
}

export { usePrayerLeaderboardViewModel };
