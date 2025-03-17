import { Button } from "@components/shadcn/Button";
import { BoxIcon, CheckboxIcon } from "@radix-ui/react-icons";
import { formatTimeFromUnixMs } from "@utils/index";
import type { PrayerSchedule } from "../../viewmodels/dashboard/usePrayersViewModel";

interface PrayerViewProps {
  prayer: PrayerSchedule;
  currentDate: Date;
  sunriseDate: Date;
  index: number;
}

function PrayerView({
  prayer,
  currentDate,
  sunriseDate,
  index,
}: PrayerViewProps) {
  console.log(sunriseDate);
  console.log(index);

  return (
    <div className="break-words border border-[#E1E1E1] rounded-lg flex justify-between items-center p-3">
      <div className="flex flex-col gap-1">
        <h4 className="text-[#363636] font-bold capitalize">
          Salat {prayer.name}
        </h4>

        <time className="text-sm text-[#363636]/75">
          {formatTimeFromUnixMs(prayer.date.getTime())}
        </time>
      </div>

      <Button
        disabled={
          currentDate.getTime() < prayer.date.getTime() ||
          prayer.status !== "pending"
        }
        type="button"
        variant="link"
        className="[&_svg]:size-6"
      >
        {prayer.status !== "pending" ? (
          <CheckboxIcon className="text-[#1F1F1F]" />
        ) : (
          <BoxIcon className="text-[#1F1F1F]" />
        )}
      </Button>
    </div>
  );
}

export { PrayerView };
