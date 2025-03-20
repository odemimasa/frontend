import { PrayerStatisticsView } from "./PrayerStatisticsView";
import { usePrayerReportViewModel } from "../../viewmodels/dashboard/usePrayerReportViewModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { PrayerModel } from "../../models/PrayerModel";
import { PrayerLeaderboardView } from "./PrayerLeaderboardView";
import { useMemo } from "react";
import { PrayerReportSkeletonView } from "./PrayerReportSkeletonView";

function PrayerReportView() {
  const { retryWithRefresh } = useAxiosContext();
  const prayerModel = useMemo((): PrayerModel => {
    return new PrayerModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const prayerReportViewModel = usePrayerReportViewModel(prayerModel);

  if (prayerReportViewModel.isLoading) {
    return <PrayerReportSkeletonView />;
  }

  if (prayerReportViewModel.prayerStatistics === undefined) {
    return (
      <p className="text-[#D9534F] text-center font-medium border border-[#D9534F] rounded-2xl p-6 mx-6 mt-6">
        Tidak dapat menampilkan statistik ibadah salat.
      </p>
    );
  }

  return (
    <div className="mt-16">
      <PrayerLeaderboardView
        prayerStatistics={prayerReportViewModel.prayerStatistics}
      />

      <PrayerStatisticsView
        prayerStatistics={prayerReportViewModel.prayerStatistics}
      />
    </div>
  );
}

export { PrayerReportView };
