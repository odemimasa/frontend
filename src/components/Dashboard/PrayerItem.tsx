import { Button } from "@components/shadcn/Button";
import { type Prayer } from "@hooks/useStore";
import { BoxIcon, CheckboxIcon } from "@radix-ui/react-icons";
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
  currentUnixTime: number;
}

function PrayerItem({
  currentUnixTime,
  id,
  name,
  unix_time,
  status,
}: PrayerItemProps) {
  // const user = useStore((state) => state.user);
  // const setPrayers = useStore((state) => state.setPrayers);
  // const setPrayerStatistic = useStore((state) => state.setPrayerStatistic);

  const [isLoading, setIsLoading] = useState(false);
  // const { toast } = useToast();
  // const createAxiosInstance = useAxios();

  // const handleCheckPrayer = async () => {
  //   setIsLoading(true);
  //   const checkedAt = Math.round(
  //     getCurrentTime(user!.timeZone as string).getTime() / 1000
  //   );

  //   try {
  //     const resp = await createAxiosInstance().put<{ status: PrayerStatus }>(
  //       `/prayers/${id}`,
  //       {
  //         prayer_name: name,
  //         prayer_unix_time: unix_time,
  //         time_zone: user!.timeZone,
  //         checked_at: checkedAt,
  //         account_type: user!.accountType,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user!.idToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (resp.status === 200) {
  //       toast({
  //         description: `Berhasil mencentang ibadah salat ${name}.`,
  //         variant: "default",
  //       });

  //       setPrayers((prayers) => {
  //         const idx = prayers!.findIndex((item) => item.id === id);
  //         prayers![idx].status = resp.data.status;
  //         return prayers;
  //       });

  //       setPrayerStatistic((prayerStatistic) => {
  //         const statistic = prayerStatistic!.get(name)!;
  //         if (resp.data.status === "ON_TIME") {
  //           statistic[2]++;
  //         } else if (resp.data.status === "LATE") {
  //           statistic[1]++;
  //         } else {
  //           statistic[0]++;
  //         }

  //         prayerStatistic!.set(name, statistic);
  //         return prayerStatistic;
  //       });
  //     } else if (resp.status === 400) {
  //       throw new Error("invalid request body");
  //     } else {
  //       throw new Error(`unknown response status code ${resp.status}`);
  //     }
  //   } catch (error) {
  //     console.error(new Error("failed to update prayer", { cause: error }));
  //     toast({
  //       description: `Gagal mencentang ibadah salat ${name}.`,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleCheckPrayer = async () => {
    setIsLoading(true);
    console.log(id);
  };

  return (
    <div className="break-words border border-[#E1E1E1] rounded-lg flex justify-between items-center p-3">
      <div className="flex flex-col gap-1">
        <h4 className="text-[#363636] font-bold">Salat {name}</h4>
        <time className="text-sm text-[#363636]/75">
          {formatTimeFromUnixMilliseconds(unix_time)}
        </time>
      </div>

      <Button
        disabled={
          isLoading || currentUnixTime < unix_time || status !== undefined
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
