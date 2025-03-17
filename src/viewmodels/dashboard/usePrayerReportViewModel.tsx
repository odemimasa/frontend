import { useEffect, useMemo, useState } from "react";
import type { PrayerModel } from "../../models/PrayerModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useStore } from "../../stores";
import { getCurrentDate } from "@utils/index";
import type { PrayerName } from "@hooks/useStore";

// the value of the map will only have 3 length
// the first index is the number of missed salat
// the second index is the number of late salat
// the third index is the number of on time salat
type PrayerStatistics = Map<PrayerName, number[]>;

function usePrayerReportViewModel(prayerModel: PrayerModel) {
  const [isLoading, setIsLoading] = useState(true);

  const user = useStore((state) => state.user);
  const thisMonthPrayers = useStore((state) => state.thisMonthPrayers);
  const setThisMonthPrayers = useStore((state) => state.setThisMonthPrayers);

  const { handleAxiosError } = useAxiosContext();

  useEffect(() => {
    if (thisMonthPrayers.length !== 0) {
      return;
    }

    const currentTime = getCurrentDate(user?.timezone ?? "");
    (async () => {
      try {
        const res = await prayerModel.getPrayers(
          currentTime.getFullYear(),
          currentTime.getMonth() + 1
        );

        if (res.data.length !== 0) {
          setThisMonthPrayers(res.data);
        }
      } catch (error) {
        handleAxiosError(error as Error, (response) => {
          if (response.status === 400) {
            console.error(new Error("invalid query params"));
          }
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [
    handleAxiosError,
    prayerModel,
    user?.timezone,
    thisMonthPrayers,
    setThisMonthPrayers,
  ]);

  const prayerStatistics = useMemo((): PrayerStatistics => {
    if (thisMonthPrayers.length === 0) {
      return new Map<PrayerName, number[]>();
    }

    const prayerStatistics = new Map<PrayerName, number[]>();
    prayerStatistics.set("subuh", [0, 0, 0]);
    prayerStatistics.set("zuhur", [0, 0, 0]);
    prayerStatistics.set("asar", [0, 0, 0]);
    prayerStatistics.set("magrib", [0, 0, 0]);
    prayerStatistics.set("isya", [0, 0, 0]);

    for (const prayer of thisMonthPrayers) {
      const statistic = prayerStatistics.get(prayer.name)!;
      if (prayer.status === "on_time") {
        statistic[2]++;
      } else if (prayer.status === "late") {
        statistic[1]++;
      } else if (prayer.status === "missed") {
        statistic[0]++;
      }

      prayerStatistics.set(prayer.name, statistic);
    }

    return prayerStatistics;
  }, [thisMonthPrayers]);

  return { isLoading, prayerStatistics };
}

export { usePrayerReportViewModel };
export type { PrayerStatistics };
