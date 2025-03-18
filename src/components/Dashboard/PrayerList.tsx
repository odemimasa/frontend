import { Skeleton } from "@components/shadcn/Skeleton";
import { useStore, type Prayer } from "@hooks/useStore";
import { lazy, useEffect, useMemo, useState } from "react";
import { useToast } from "@hooks/shadcn/useToast";
import { getCurrentDate, getPrayerTimes } from "@utils/index";
import type { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { useAxiosContext } from "../../contexts/AxiosProvider";

const PrayerItem = lazy(() =>
  import("@components/Dashboard/PrayerItem").then(({ PrayerItem }) => ({
    default: PrayerItem,
  }))
);

interface PrayerCompletionIndicatorProps
  extends Pick<Prayer, "status" | "date"> {
  currentDate: Date;
}

function PrayerCompletionIndicator({
  status,
  date,
  currentDate,
}: PrayerCompletionIndicatorProps) {
  const boxColor = useMemo((): string => {
    if (currentDate.getTime() > date.getTime() && status !== "pending") {
      if (status === "on_time") {
        return "bg-[#238471]";
      } else if (status === "late") {
        return "bg-[#F0AD4E]";
      } else {
        return "bg-[#D9534F]";
      }
    } else {
      return "bg-[#ECECEC]";
    }
  }, [status, date, currentDate]);

  return <div className={`${boxColor} w-12 h-6`}></div>;
}

function PrayerList() {
  const { retryWithRefresh } = useAxiosContext();
  const user = useStore((state) => state.user);
  const prayers = useStore((state) => state.prayers);
  const setPrayers = useStore((state) => state.setPrayers);

  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [sunriseDate, setSunriseDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (prayers !== undefined) return;
    setIsLoading(true);
    const prayerTimes = getPrayerTimes(user!.latitude, user!.longitude);
    const currentDate = getCurrentDate(user!.timezone);

    (async () => {
      try {
        const res = await retryWithRefresh.get<
          Pick<Prayer, "id" | "name" | "status">[]
        >(
          `/prayers?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}&day=${currentDate.getDate()}`
        );

        if (res.status === 200) {
          const prayers: Prayer[] = [
            {
              id: prayerTimes.fajr.toISOString(),
              name: "subuh",
              date: prayerTimes.fajr,
              status: "pending",
            },
            {
              id: prayerTimes.dhuhr.toISOString(),
              name: "zuhur",
              date: prayerTimes.dhuhr,
              status: "pending",
            },
            {
              id: prayerTimes.asr.toISOString(),
              name: "asar",
              date: prayerTimes.asr,
              status: "pending",
            },
            {
              id: prayerTimes.maghrib.toISOString(),
              name: "magrib",
              date: prayerTimes.maghrib,
              status: "pending",
            },
            {
              id: prayerTimes.isha.toISOString(),
              name: "isya",
              date: prayerTimes.isha,
              status: "pending",
            },
          ];

          setCurrentDate(currentDate);
          setSunriseDate(prayerTimes.sunrise);

          setPrayers(() => {
            return prayers.map((item) => {
              for (const prayer of res.data) {
                if (prayer.name !== item.name) {
                  continue;
                }

                item.id = prayer.id;
                item.status = prayer.status;
              }

              return item;
            });
          });
        }
      } catch (error) {
        const status = (error as AxiosError).response?.status;
        if (
          axiosRetry.isNetworkError(error as AxiosError) ||
          (status || 0) >= 500
        ) {
          toast({
            description: "Gagal menampilkan daftar salat hari ini.",
            variant: "destructive",
          });
        }

        console.error(new Error("failed to get prayers", { cause: error }));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user, setPrayers, toast, prayers, retryWithRefresh]);

  if (isLoading) {
    return (
      <div className="animate-pulse border border-[#E1E1E1] rounded-3xl flex flex-col gap-6 p-6 mx-6">
        <div className="animate-pulse border border-[#E1E1E1] rounded-lg flex flex-col gap-6 p-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="animate-pulse flex justify-between items-center gap-2">
          <Skeleton className="w-12 h-6 rounded-none" />
          <Skeleton className="w-12 h-6 rounded-none" />
          <Skeleton className="w-12 h-6 rounded-none" />
          <Skeleton className="w-12 h-6 rounded-none" />
          <Skeleton className="w-12 h-6 rounded-none" />
        </div>
      </div>
    );
  }

  if (prayers === undefined || prayers.length === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Tidak dapat menampilkan daftar salat hari ini.
      </p>
    );
  }

  return (
    <div className="border border-[#E1E1E1] rounded-3xl p-6 mx-6">
      <h2 className="text-[#1A6355] font-bold text-xl mb-3">Daftar Salat</h2>

      <div className="flex flex-col gap-3 mb-6">
        {prayers.map((item, index) => (
          <PrayerItem
            key={item.id}
            id={item.id}
            name={item.name}
            status={item.status}
            date={item.date}
            currentDate={currentDate}
            sunriseDate={sunriseDate}
            prayers={prayers}
            index={index}
          />
        ))}
      </div>

      <h3 className="text-[#363636] font-medium mb-3">
        Ketepatan salat hari ini
      </h3>

      <div className="flex justify-between items-center gap-2">
        {prayers.map((item) => (
          <PrayerCompletionIndicator
            key={item.id + ":completion"}
            status={item.status}
            date={item.date}
            currentDate={currentDate}
          />
        ))}
      </div>
    </div>
  );
}

export { PrayerList };
