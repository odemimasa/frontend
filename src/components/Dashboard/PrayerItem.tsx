import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore, type Prayer, type PrayerStatus } from "@hooks/useStore";
import { BoxIcon, CheckboxIcon } from "@radix-ui/react-icons";
import { getCurrentDate } from "@utils/index";
import { useState } from "react";

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
  const user = useStore((state) => state.user);
  const setPrayers = useStore((state) => state.setPrayers);
  const setPrayerStatistic = useStore((state) => state.setPrayerStatistic);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const handleCheckPrayer = async () => {
    setIsLoading(true);

    let endTime = 0;
    if (name === "Subuh") {
      endTime = sunriseDate.getTime() / 1000;
    } else {
      endTime = prayers[index + 1].date.getTime() / 1000;
    }

    const currentPrayerTime = date.getTime() / 1000;
    const prayerTimeDifference = endTime - currentPrayerTime;
    const idealTime = prayerTimeDifference * 0.75;

    const checkedDate = getCurrentDate(user!.timeZone);
    const checkedTime = checkedDate.getTime() / 1000;
    const checkedTimeDifference = checkedTime - currentPrayerTime;

    let status: PrayerStatus = "MISSED";
    if (checkedTime > endTime) {
      status = "MISSED";
    } else if (idealTime - checkedTimeDifference >= 0) {
      status = "ON_TIME";
    } else if (idealTime - checkedTimeDifference < 0) {
      status = "LATE";
    }

    try {
      const resp = await createAxiosInstance().put(
        `/prayers/${id}`,
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${user!.idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        toast({
          description: `Berhasil mencentang ibadah salat ${name}.`,
          variant: "default",
        });

        setPrayers((prayers) => {
          const idx = prayers!.findIndex((item) => item.id === id);
          prayers![idx].status = status;
          return prayers;
        });

        setPrayerStatistic((prayerStatistic) => {
          const statistic = prayerStatistic!.get(name)!;
          if (status === "ON_TIME") {
            statistic[2]++;
          } else if (status === "LATE") {
            statistic[1]++;
          } else if (status === "MISSED") {
            statistic[0]++;
          }

          prayerStatistic!.set(name, statistic);
          return prayerStatistic;
        });
      } else if (resp.status === 400) {
        throw new Error("invalid request body");
      } else {
        throw new Error(`unknown response status code ${resp.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to update prayer", { cause: error }));
      toast({
        description: `Gagal mencentang ibadah salat ${name}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="break-words border border-[#E1E1E1] rounded-lg flex justify-between items-center p-3">
      <div className="flex flex-col gap-1">
        <h4 className="text-[#363636] font-bold">Salat {name}</h4>
        <time className="text-sm text-[#363636]/75">
          {formatTimeFromUnixMilliseconds(date.getTime())}
        </time>
      </div>

      <Button
        disabled={
          isLoading ||
          currentDate.getTime() < date.getTime() ||
          status !== undefined
        }
        onClick={handleCheckPrayer}
        type="button"
        variant="link"
        className="[&_svg]:size-6"
      >
        {status !== undefined ? (
          <CheckboxIcon className="text-[#1F1F1F]" />
        ) : (
          <BoxIcon className="text-[#1F1F1F]" />
        )}
      </Button>
    </div>
  );
}

export { PrayerItem };
