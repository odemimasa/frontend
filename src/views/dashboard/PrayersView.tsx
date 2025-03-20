import { usePrayersViewModel } from "../../viewmodels/dashboard/usePrayersViewModel";
import { PrayerModel } from "../../models/PrayerModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { PrayerProgressView } from "./PrayerProgressView";
import { PrayerView } from "./PrayerView";
import { useMemo } from "react";
import { PrayersSkeletonView } from "./PrayersSkeletonView";

function PrayersView() {
  const { retryWithRefresh } = useAxiosContext();
  const prayerModel = useMemo((): PrayerModel => {
    return new PrayerModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const prayersViewModel = usePrayersViewModel(prayerModel);

  if (prayersViewModel.isLoading) {
    return <PrayersSkeletonView />;
  }

  if (prayersViewModel.prayerSchedule === undefined) {
    return (
      <p className="text-[#D9534F] text-center font-medium border border-[#D9534F] rounded-2xl p-6 mx-6">
        Tidak dapat menampilkan daftar salat hari ini.
      </p>
    );
  }

  if (prayersViewModel.prayerSchedule.length === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Daftar salat hari ini kosong.
      </p>
    );
  }

  return (
    <div className="border border-[#E1E1E1] rounded-3xl p-6 mx-6">
      <h2 className="text-[#1A6355] font-bold text-xl mb-3">Daftar Salat</h2>

      <div className="flex flex-col gap-3 mb-6">
        {prayersViewModel.prayerSchedule.map((item, index, prayerSchedule) => (
          <PrayerView
            key={item.id}
            nextPrayer={prayerSchedule[index + 1]}
            currentPrayer={item}
            currentDate={prayersViewModel.currentDate}
            currentSunriseDate={prayersViewModel.sunriseDate}
          />
        ))}
      </div>

      <h3 className="text-[#363636] font-medium mb-3">
        Ketepatan salat hari ini
      </h3>

      <div className="flex justify-between items-center gap-2">
        {prayersViewModel.prayerSchedule.map((item) => (
          <PrayerProgressView
            key={item.id + ":progress"}
            status={item.status}
            date={item.date}
            currentDate={prayersViewModel.currentDate}
          />
        ))}
      </div>
    </div>
  );
}

export { PrayersView };
