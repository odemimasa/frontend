import { Button } from "@components/shadcn/Button";
import { BoxIcon, CheckboxIcon } from "@radix-ui/react-icons";
import { formatTimeFromUnixMs } from "@utils/index";
import type { PrayerSchedule } from "../../viewmodels/dashboard/usePrayersViewModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { PrayerModel } from "../../models/PrayerModel";
import { usePrayerViewModel } from "../../viewmodels/dashboard/usePrayerViewModel";

interface PrayerViewProps {
  prayerSchedule: PrayerSchedule[];
  prayer: PrayerSchedule;
  currentDate: Date;
  sunriseDate: Date;
  index: number;
}

function PrayerView({
  prayerSchedule,
  prayer,
  currentDate,
  sunriseDate,
  index,
}: PrayerViewProps) {
  const { retryWithRefresh } = useAxiosContext();
  const prayerModel = new PrayerModel(retryWithRefresh);
  const prayerViewModel = usePrayerViewModel(prayerModel);

  const handleCheckPrayer = () => {
    const status = prayerViewModel.determinePrayerStatus({
      prayerDate: prayer.date,
      prayerName: prayer.name,
      prayerSchedule,
      sunriseDate,
      index,
    });

    prayerViewModel.checkPrayer(prayer.id, status);
  };

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
        onClick={handleCheckPrayer}
        disabled={
          prayerViewModel.isLoading ||
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
