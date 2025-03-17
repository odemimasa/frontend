import { Skeleton } from "@components/shadcn/Skeleton";
import { usePrayersViewModel } from "../../viewmodels/dashboard/usePrayersViewModel";
import { PrayerModel } from "../../models/PrayerModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { PrayerProgressView } from "./PrayerProgressView";
import { PrayerView } from "./PrayerView";

function PrayersView() {
  const { retryWithRefresh } = useAxiosContext();
  const prayerModel = new PrayerModel(retryWithRefresh);
  const prayersViewModel = usePrayersViewModel(prayerModel);

  if (prayersViewModel.isLoading) {
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

  if (prayersViewModel.prayerSchedule.length === 0) {
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
        {prayersViewModel.prayerSchedule.map((item, index) => (
          <PrayerView
            key={item.id}
            prayer={item}
            currentDate={prayersViewModel.currentDate}
            sunriseDate={prayersViewModel.sunriseDate}
            index={index}
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
