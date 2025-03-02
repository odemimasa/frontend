import { Skeleton } from "@components/shadcn/Skeleton";
import { useStore, type Prayer } from "@hooks/useStore";
import { lazy, useEffect, useMemo, useState } from "react";
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { getCurrentDate } from "@utils/index";

const PrayerItem = lazy(() =>
  import("@components/Dashboard/PrayerItem").then(({ PrayerItem }) => ({
    default: PrayerItem,
  }))
);

function getPrayerTimes(latitude: number, longitude: number): PrayerTimes {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.Singapore();
  params.madhab = Madhab.Shafi;
  const date = new Date();

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
    if (currentDate.getTime() > date.getTime() && status !== undefined) {
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
  }, [status, date, currentDate]);

  return <div className={`${boxColor} w-12 h-6`}></div>;
}

function PrayerList() {
  const user = useStore((state) => state.user);
  const prayers = useStore((state) => state.prayers);
  const setPrayers = useStore((state) => state.setPrayers);

  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [sunriseDate, setSunriseDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (prayers !== undefined) return;
    setIsLoading(true);
    const prayerTimes = getPrayerTimes(user!.latitude, user!.longitude);
    const currentDate = getCurrentDate(user!.timeZone);

    (async () => {
      try {
        const resp = await createAxiosInstance().get<
          Pick<Prayer, "id" | "name" | "status">[]
        >(
          `/prayers?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}&day=${currentDate.getDate()}`,
          { headers: { Authorization: `Bearer ${user!.idToken}` } }
        );

        if (resp.status === 200) {
          const prayers: Prayer[] = [
            {
              id: prayerTimes.fajr.toISOString(),
              name: "Subuh",
              date: prayerTimes.fajr,
              status: undefined,
            },
            {
              id: prayerTimes.dhuhr.toISOString(),
              name: "Zuhur",
              date: prayerTimes.dhuhr,
              status: undefined,
            },
            {
              id: prayerTimes.asr.toISOString(),
              name: "Asar",
              date: prayerTimes.asr,
              status: undefined,
            },
            {
              id: prayerTimes.maghrib.toISOString(),
              name: "Magrib",
              date: prayerTimes.maghrib,
              status: undefined,
            },
            {
              id: prayerTimes.isha.toISOString(),
              name: "Isya",
              date: prayerTimes.isha,
              status: undefined,
            },
          ];

          setCurrentDate(currentDate);
          setSunriseDate(prayerTimes.sunrise);

          setPrayers(() => {
            return prayers.map((item) => {
              for (const prayer of resp.data) {
                if (prayer.name !== item.name) {
                  continue;
                }

                item.id = prayer.id;
                item.status = prayer.status;
              }

              return item;
            });
          });
        } else if (resp.status === 400) {
          throw new Error("invalid query params");
        } else {
          throw new Error(`unknown response status code ${resp.status}`);
        }
      } catch (error) {
        console.error(new Error("failed to get prayers", { cause: error }));

        toast({
          description: "Gagal menampilkan daftar ibadah salat.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user, setPrayers, toast, createAxiosInstance, prayers]);

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
