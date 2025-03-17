import { Skeleton } from "@components/shadcn/Skeleton";
import { PrayerStatisticView } from "./PrayerStatisticView";
import { usePrayerReportViewModel } from "../../viewmodels/dashboard/usePrayerReportViewModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { PrayerModel } from "../../models/PrayerModel";
import { PrayerLeaderboardView } from "./PrayerLeaderboardView";

function PrayerReportView() {
  const { retryWithRefresh } = useAxiosContext();
  const prayerModel = new PrayerModel(retryWithRefresh);
  const prayerReportViewModel = usePrayerReportViewModel(prayerModel);

  if (prayerReportViewModel.isLoading) {
    return (
      <div className="animate-pulse border border-[#C2C2C2] rounded-3xl py-5 px-4 mx-6 mt-16">
        <div className="flex justify-between items-end gap-2">
          <Skeleton className="rounded-t-3xl h-[140px] w-full max-w-24" />
          <Skeleton className="rounded-t-3xl h-[160px] w-full max-w-24" />
          <Skeleton className="rounded-t-3xl h-[140px] w-full max-w-24" />
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
            <Skeleton className="shrink-0 rounded-full w-6 h-6"></Skeleton>

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
            <Skeleton className="shrink-0 rounded-full w-6 h-6"></Skeleton>

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
            <Skeleton className="shrink-0 rounded-full w-6 h-6"></Skeleton>

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (prayerReportViewModel.prayerStatistic.size === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6 mt-16">
        Tidak dapat menampilkan statistik ibadah salat.
      </p>
    );
  }

  return (
    <div className="mt-16">
      <PrayerLeaderboardView
        prayerStatistic={prayerReportViewModel.prayerStatistic}
      />

      <PrayerStatisticView
        prayerStatistic={prayerReportViewModel.prayerStatistic}
      />
    </div>
  );
}

export { PrayerReportView };
