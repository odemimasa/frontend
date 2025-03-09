import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore, type Prayer, type PrayerStatus } from "@hooks/useStore";
import { BoxIcon, CheckboxIcon } from "@radix-ui/react-icons";
import { capitalizeWord, getCurrentDate, getPrayerTimes } from "@utils/index";
import type { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthProvider";

function formatTimeFromUnixMilliseconds(unixTimeMs: number) {
  const date = new Date(unixTimeMs);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

interface PrayerItemProps extends Prayer {
  currentDate: Date;
  sunriseDate: Date;
  prayers: Prayer[];
  index: number;
}

function PrayerItem({
  id,
  name,
  date,
  status,
  currentDate,
  sunriseDate,
  prayers,
  index,
}: PrayerItemProps) {
  const { retryWithRefresh } = useAuthContext();
  const user = useStore((state) => state.user);
  const setPrayers = useStore((state) => state.setPrayers);
  const setPrayerStatistic = useStore((state) => state.setPrayerStatistic);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckPrayer = async () => {
    setIsLoading(true);

    let endTime = 0;
    if (name === "subuh") {
      endTime = sunriseDate.getTime() / 1000;
    } else if (name === "isya") {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const nextPrayerTimes = getPrayerTimes(
        user!.latitude,
        user!.longitude,
        nextDate
      );

      endTime = nextPrayerTimes.fajr.getTime() / 1000;
    } else {
      endTime = prayers[index + 1].date.getTime() / 1000;
    }

    const currentPrayerTime = date.getTime() / 1000;
    const prayerTimeDifference = endTime - currentPrayerTime;
    const idealTime = prayerTimeDifference * 0.75;

    const checkedDate = getCurrentDate(user!.timezone);
    const checkedTime = checkedDate.getTime() / 1000;
    const checkedTimeDifference = checkedTime - currentPrayerTime;

    let status: PrayerStatus = "pending";
    if (checkedTime > endTime) {
      status = "missed";
    } else if (idealTime - checkedTimeDifference >= 0) {
      status = "on_time";
    } else if (idealTime - checkedTimeDifference < 0) {
      status = "late";
    }

    try {
      const res = await retryWithRefresh.put(
        `/prayers/${id}`,
        { id, status },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200) {
        toast({
          description: `Berhasil mencentang ibadah salat ${capitalizeWord(name)}.`,
          variant: "default",
        });

        setPrayers((prayers) => {
          const idx = prayers!.findIndex((item) => item.id === id);
          prayers![idx].status = status;
          return prayers;
        });

        setPrayerStatistic((prayerStatistic) => {
          if (prayerStatistic !== undefined) {
            const statistic = prayerStatistic.get(name)!;
            if (status === "on_time") {
              statistic[2]++;
            } else if (status === "late") {
              statistic[1]++;
            } else if (status === "missed") {
              statistic[0]++;
            }

            prayerStatistic!.set(name, statistic);
          }

          return prayerStatistic;
        });
      }
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      if (
        axiosRetry.isNetworkError(error as AxiosError) ||
        (status || 0) >= 500
      ) {
        toast({
          description: `Gagal mencentang ibadah salat ${capitalizeWord(name)}.`,
          variant: "destructive",
        });
      }

      console.error(new Error("failed to update prayer", { cause: error }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="break-words border border-[#E1E1E1] rounded-lg flex justify-between items-center p-3">
      <div className="flex flex-col gap-1">
        <h4 className="text-[#363636] font-bold capitalize">Salat {name}</h4>
        <time className="text-sm text-[#363636]/75">
          {formatTimeFromUnixMilliseconds(date.getTime())}
        </time>
      </div>

      <Button
        disabled={
          isLoading ||
          currentDate.getTime() < date.getTime() ||
          status !== "pending"
        }
        onClick={handleCheckPrayer}
        type="button"
        variant="link"
        className="[&_svg]:size-6"
      >
        {status !== "pending" ? (
          <CheckboxIcon className="text-[#1F1F1F]" />
        ) : (
          <BoxIcon className="text-[#1F1F1F]" />
        )}
      </Button>
    </div>
  );
}

export { PrayerItem };
