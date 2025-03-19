import { Button } from "@components/shadcn/Button";
import { BoxIcon, CheckboxIcon } from "@radix-ui/react-icons";
import { formatTimeFromUnixMs } from "@utils/index";
import type { PrayerSchedule } from "../../viewmodels/dashboard/usePrayersViewModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { PrayerModel } from "../../models/PrayerModel";
import { usePrayerViewModel } from "../../viewmodels/dashboard/usePrayerViewModel";
import { useMemo } from "react";

interface PrayerViewProps {
  nextPrayer: PrayerSchedule;
  currentPrayer: PrayerSchedule;
  currentDate: Date;
  currentSunriseDate: Date;
}

function PrayerView({
  nextPrayer,
  currentPrayer,
  currentDate,
  currentSunriseDate,
}: PrayerViewProps) {
  const { retryWithRefresh } = useAxiosContext();
  const prayerModel = useMemo((): PrayerModel => {
    return new PrayerModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const prayerViewModel = usePrayerViewModel(prayerModel);

  const handleCheckPrayer = () => {
    const status = prayerViewModel.determinePrayerStatus({
      currentPrayer,
      currentSunriseDate,
      nextPrayer,
    });

    prayerViewModel.checkPrayer(currentPrayer.id, status);
  };

  return (
    <div className="break-words border border-[#E1E1E1] rounded-lg flex justify-between items-center p-3">
      <div className="flex flex-col gap-1">
        <h4 className="text-[#363636] font-bold capitalize">
          Salat {currentPrayer.name}
        </h4>

        <time className="text-sm text-[#363636]/75">
          {formatTimeFromUnixMs(currentPrayer.date.getTime())}
        </time>
      </div>

      <Button
        onClick={handleCheckPrayer}
        disabled={
          prayerViewModel.isLoading ||
          currentDate.getTime() < currentPrayer.date.getTime() ||
          currentPrayer.status !== "pending"
        }
        type="button"
        variant="link"
        className="[&_svg]:size-6"
      >
        {currentPrayer.status !== "pending" ? (
          <CheckboxIcon className="text-[#1F1F1F]" />
        ) : (
          <BoxIcon className="text-[#1F1F1F]" />
        )}
      </Button>
    </div>
  );
}

export { PrayerView };
