import { Skeleton } from "@components/shadcn/Skeleton";
import { useStore, type Prayer } from "@hooks/useStore";
import { lazy, useEffect, useMemo, useState } from "react";
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";

const PrayerItem = lazy(() =>
  import("@components/Dashboard/PrayerItem").then(({ PrayerItem }) => ({
    default: PrayerItem,
  }))
);

interface PrayerCompletionIndicatorProps
  extends Pick<Prayer, "status" | "unix_time"> {
  currentUnixTime: number;
}

function PrayerCompletionIndicator({
  currentUnixTime,
  status,
  unix_time,
}: PrayerCompletionIndicatorProps) {
  const boxColor = useMemo((): string => {
    if (currentUnixTime > unix_time && status !== undefined) {
      if (status === "ON_TIME") {
        return "bg-[#238471]";
      } else if (status === "LATE") {
        return "bg-[#F0AD4E]";
      } else {
        return "bg-[#D9534F]";
      }
    } else {
      return "bg-[#ECECEC]";
    }
  }, [status, unix_time, currentUnixTime]);

  return <div className={`${boxColor} w-12 h-6`}></div>;
}

function PrayerList() {
  const user = useStore((state) => state.user);
  const prayers = useStore((state) => state.prayers);
  const setPrayers = useStore((state) => state.setPrayers);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  // const { toast } = useToast();
  // const createAxiosInstance = useAxios();

  useEffect(() => {
    setIsLoading(true);
    const coordinates = new Coordinates(user!.latitude, user!.longitude);
    const params = CalculationMethod.Singapore();
    params.madhab = Madhab.Shafi;
    const date = new Date();

    let prayerTimes = new PrayerTimes(coordinates, date, params);
    setCurrentDate(prayerTimes.date);

    const currentHours = prayerTimes.date.getHours();
    const fajrHours = prayerTimes.fajr.getHours();

    if (currentHours < fajrHours) {
      const previousDate = new Date(prayerTimes.date);
      previousDate.setDate(prayerTimes.date.getDate() - 1);
      prayerTimes = new PrayerTimes(coordinates, previousDate, params);
    }

    setPrayers([
      {
        id: prayerTimes.fajr.toISOString(),
        name: "Subuh",
        unix_time: prayerTimes.fajr.getTime(),
        status: undefined,
      },
      {
        id: prayerTimes.dhuhr.toISOString(),
        name: "Zuhur",
        unix_time: prayerTimes.dhuhr.getTime(),
        status: undefined,
      },
      {
        id: prayerTimes.asr.toISOString(),
        name: "Asar",
        unix_time: prayerTimes.asr.getTime(),
        status: undefined,
      },
      {
        id: prayerTimes.maghrib.toISOString(),
        name: "Magrib",
        unix_time: prayerTimes.maghrib.getTime(),
        status: undefined,
      },
      {
        id: prayerTimes.isha.toISOString(),
        name: "Isya",
        unix_time: prayerTimes.isha.getTime(),
        status: undefined,
      },
    ]);

    setIsLoading(false);
  }, [user, setPrayers]);

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
        {prayers.map((item) => (
          <PrayerItem
            key={item.id + ":prayer"}
            id={item.id}
            name={item.name}
            status={item.status}
            unix_time={item.unix_time}
            currentUnixTime={currentDate.getTime()}
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
            currentUnixTime={currentDate.getTime()}
            status={item.status}
            unix_time={item.unix_time}
          />
        ))}
      </div>
    </div>
  );
}

export { PrayerList };
