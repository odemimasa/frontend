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
type PrayerStatistic = Map<PrayerName, number[]>;

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

  const prayerStatistic = useMemo((): PrayerStatistic => {
    if (thisMonthPrayers.length === 0) {
      return new Map<PrayerName, number[]>();
    }

    const prayerStatistic = new Map<PrayerName, number[]>();
    prayerStatistic.set("subuh", [0, 0, 0]);
    prayerStatistic.set("zuhur", [0, 0, 0]);
    prayerStatistic.set("asar", [0, 0, 0]);
    prayerStatistic.set("magrib", [0, 0, 0]);
    prayerStatistic.set("isya", [0, 0, 0]);

    for (const prayer of thisMonthPrayers) {
      const statistic = prayerStatistic.get(prayer.name)!;
      if (prayer.status === "on_time") {
        statistic[2]++;
      } else if (prayer.status === "late") {
        statistic[1]++;
      } else if (prayer.status === "missed") {
        statistic[0]++;
      }

      prayerStatistic.set(prayer.name, statistic);
    }

    return prayerStatistic;
  }, [thisMonthPrayers]);

  return { isLoading, prayerStatistic };
}

export { usePrayerReportViewModel };
export type { PrayerStatistic };
