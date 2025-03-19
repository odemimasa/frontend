import { useEffect, useMemo, useState } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useStore } from "../../stores";
import { getCurrentDate, getPrayerTimes } from "@utils/index";
import type { PrayerModel } from "../../models/PrayerModel";
import type { PrayerResponse } from "../../dtos/PrayerDTO";

type PrayerSchedule = Pick<PrayerResponse, "id" | "name" | "status"> & {
  date: Date;
};

function usePrayersViewModel(prayerModel: PrayerModel) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sunriseDate, setSunriseDate] = useState(new Date());

  const user = useStore((state) => state.user);
  const prayers = useStore((state) => state.prayers);
  const setPrayers = useStore((state) => state.setPrayers);
  const { handleAxiosError } = useAxiosContext();

  useEffect(() => {
    if (prayers.length > 0) {
      return;
    }

    const prayerTimes = getPrayerTimes(
      user?.latitude ?? 0,
      user?.longitude ?? 0
    );

    (async () => {
      try {
        const res = await prayerModel.getPrayers(
          prayerTimes.fajr.getFullYear(),
          prayerTimes.fajr.getMonth() + 1,
          prayerTimes.fajr.getDate()
        );

        if (res.data.length !== 0) {
          setCurrentDate(getCurrentDate(user?.timezone ?? ""));
          setSunriseDate(prayerTimes.sunrise);
          setPrayers(res.data);
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
    prayers,
    setPrayers,
    handleAxiosError,
    prayerModel,
    user?.latitude,
    user?.longitude,
    user?.timezone,
  ]);

  const prayerSchedule = useMemo((): PrayerSchedule[] => {
    if (prayers.length === 0) {
      return [];
    }

    const prayerTimes = getPrayerTimes(
      user?.latitude ?? 0,
      user?.longitude ?? 0
    );

    if (prayerTimes.fajr.getDate() !== prayers[0].day) {
      setPrayers([]);
      return [];
    }

    const prayerSchedule: PrayerSchedule[] = [
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

    setIsLoading(false);
    setCurrentDate(getCurrentDate(user?.timezone ?? ""));
    setSunriseDate(prayerTimes.sunrise);

    return prayerSchedule.map((item) => {
      for (const prayer of prayers) {
        if (prayer.name !== item.name) {
          continue;
        }

        item.id = prayer.id;
        item.status = prayer.status;
      }

      return item;
    });
  }, [prayers, setPrayers, user?.latitude, user?.longitude, user?.timezone]);

  return { isLoading, currentDate, sunriseDate, prayerSchedule };
}

export { usePrayersViewModel };
export type { PrayerSchedule };
