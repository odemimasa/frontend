import { Skeleton } from "@components/shadcn/Skeleton";
import { useToast } from "@hooks/shadcn/useToast";
import {
  useStore,
  type Prayer,
  type PrayerName,
  type PrayerStatistic as PrayerStatisticType,
} from "@hooks/useStore";
import { getCurrentDate } from "@utils/index";
import type { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { lazy, useEffect, useState } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";

const PrayerLeaderboard = lazy(() =>
  import("@components/Dashboard/PrayerLeaderboard").then(
    ({ PrayerLeaderboard }) => ({
      default: PrayerLeaderboard,
    })
  )
);

const PrayerStatistic = lazy(() =>
  import("@components/Dashboard/PrayerStatistic").then(
    ({ PrayerStatistic }) => ({
      default: PrayerStatistic,
    })
  )
);

function createPrayerStatistic(
  prayers: Pick<Prayer, "id" | "name" | "status">[]
): PrayerStatisticType {
  const prayerStatistic = new Map<PrayerName, number[]>();
  prayerStatistic.set("subuh", [0, 0, 0]);
  prayerStatistic.set("zuhur", [0, 0, 0]);
  prayerStatistic.set("asar", [0, 0, 0]);
  prayerStatistic.set("magrib", [0, 0, 0]);
  prayerStatistic.set("isya", [0, 0, 0]);

  for (const prayer of prayers) {
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
}

function PrayerReport() {
  const { retryWithRefresh } = useAxiosContext();
  const user = useStore((state) => state.user);
  const prayerStatistic = useStore((state) => state.prayerStatistic);
  const setPrayerStatistic = useStore((state) => state.setPrayerStatistic);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (prayerStatistic !== undefined) return;
    setIsLoading(true);
    const currentTime = getCurrentDate(user!.timezone);

    (async () => {
      try {
        const res = await retryWithRefresh.get<
          Pick<Prayer, "id" | "name" | "status">[]
        >(
          `/prayers?year=${currentTime.getFullYear()}&month=${currentTime.getMonth() + 1}`
        );

        if (res.status === 200) {
          setPrayerStatistic(createPrayerStatistic(res.data));
        }
      } catch (error) {
        const status = (error as AxiosError).response?.status;
        if (
          axiosRetry.isNetworkError(error as AxiosError) ||
          (status || 0) >= 500
        ) {
          toast({
            description: "Gagal menampilkan statistik ibadah salat.",
            variant: "destructive",
          });
        }

        console.error(
          new Error("failed to get this month prayers", { cause: error })
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [prayerStatistic, setPrayerStatistic, user, toast, retryWithRefresh]);

  if (isLoading) {
    return (
      <div className="animate-pulse border border-[#C2C2C2] rounded-3xl py-5 px-4 mx-6 mt-16">
        <div className="flex justify-between items-end gap-2">
          <Skeleton className="rounded-t-3xl h-[140px] w-full max-w-24" />
          <Skeleton className="rounded-t-3xl h-[160px] w-full max-w-24" />
          <Skeleton className="rounded-t-3xl h-[140px] w-full max-w-24" />
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
            <Skeleton className="shrink-0 rounded-full w-6 h-6"></Skeleton>

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
            <Skeleton className="shrink-0 rounded-full w-6 h-6"></Skeleton>

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
            <Skeleton className="shrink-0 rounded-full w-6 h-6"></Skeleton>

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (prayerStatistic === undefined || prayerStatistic.size === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6 mt-16">
        Tidak dapat menampilkan statistik ibadah salat.
      </p>
    );
  }

  return (
    <div className="mt-16">
      <PrayerLeaderboard />
      <PrayerStatistic />
    </div>
  );
}

export { PrayerReport };
