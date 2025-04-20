import { useEffect, useMemo, useState } from "react";
import type { PrayerModel } from "../../models/PrayerModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useStore } from "../../stores";
import { getCurrentDate } from "@utils/index";
import type { PrayerName } from "../../dtos/PrayerDTO";

// the value of the map will only have 3 length
// the first index is the number of missed salat
// the second index is the number of late salat
// the third index is the number of on time salat
type LineChartData = Map<PrayerName, number[]>;

function usePrayerReportViewModel(prayerModel: PrayerModel) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPieChart, setSelectedPieChart] = useState<PrayerName>("subuh");

  const user = useStore((state) => state.user);
  const thisMonthPrayers = useStore((state) => state.thisMonthPrayers);
  const setThisMonthPrayers = useStore((state) => state.setThisMonthPrayers);

  const { handleAxiosError } = useAxiosContext();

  useEffect(() => {
    if (thisMonthPrayers !== undefined) {
      return;
    }

    setIsLoading(true);
    const currentTime = getCurrentDate(user?.timezone ?? "");

    (async () => {
      try {
        const res = await prayerModel.getPrayers(
          currentTime.getFullYear(),
          currentTime.getMonth() + 1
        );

        setThisMonthPrayers(res.data);
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

  const lineChartData = useMemo((): LineChartData | undefined => {
    if (thisMonthPrayers === undefined) {
      return undefined;
    }

    const lineChartData: LineChartData = new Map();
    lineChartData.set("subuh", [0, 0, 0]);
    lineChartData.set("zuhur", [0, 0, 0]);
    lineChartData.set("asar", [0, 0, 0]);
    lineChartData.set("magrib", [0, 0, 0]);
    lineChartData.set("isya", [0, 0, 0]);

    if (thisMonthPrayers.length === 0) {
      return lineChartData;
    }

    for (const prayer of thisMonthPrayers) {
      const statistic = lineChartData.get(prayer.name)!;
      if (prayer.status === "on_time") {
        statistic[2]++;
      } else if (prayer.status === "late") {
        statistic[1]++;
      } else if (prayer.status === "missed") {
        statistic[0]++;
      }

      lineChartData.set(prayer.name, statistic);
    }

    return lineChartData;
  }, [thisMonthPrayers]);

  const pieChartData = useMemo((): Record<
    PrayerName,
    [number, number, number, number]
  > => {
    const pieChartData: Record<PrayerName, [number, number, number, number]> = {
      subuh: [0, 0, 0, 0],
      zuhur: [0, 0, 0, 0],
      asar: [0, 0, 0, 0],
      magrib: [0, 0, 0, 0],
      isya: [0, 0, 0, 0],
    };

    if (thisMonthPrayers === undefined || thisMonthPrayers.length === 0) {
      return pieChartData;
    }

    for (const prayer of thisMonthPrayers) {
      if (prayer.status === "on_time") {
        pieChartData[prayer.name][0]++;
      } else if (prayer.status === "late") {
        pieChartData[prayer.name][1]++;
      } else if (prayer.status === "missed") {
        pieChartData[prayer.name][2]++;
      } else {
        pieChartData[prayer.name][3]++;
      }
    }

    return pieChartData;
  }, [thisMonthPrayers]);

  return {
    subscription: user?.subscription,
    isLoading,
    selectedPieChart,
    lineChartData,
    pieChartData,
    setSelectedPieChart,
  };
}

export { usePrayerReportViewModel };
export type { LineChartData };
