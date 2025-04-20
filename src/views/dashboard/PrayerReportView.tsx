import { LineChartView } from "./LineChartView";
import { usePrayerReportViewModel } from "../../viewmodels/dashboard/usePrayerReportViewModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { PrayerModel } from "../../models/PrayerModel";
import { PrayerLeaderboardView } from "./PrayerLeaderboardView";
import { useMemo } from "react";
import { PrayerReportSkeletonView } from "./PrayerReportSkeletonView";
import { Button } from "@components/shadcn/Button";
import { Link } from "react-router";
import { PieChartView } from "./PieChartView";

function PrayerReportView() {
  const { retryWithRefresh } = useAxiosContext();
  const prayerModel = useMemo((): PrayerModel => {
    return new PrayerModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const prayerReportViewModel = usePrayerReportViewModel(prayerModel);

  if (prayerReportViewModel.isLoading) {
    return <PrayerReportSkeletonView />;
  }

  if (prayerReportViewModel.lineChartData === undefined) {
    return (
      <p className="text-[#D9534F] text-center font-medium border border-[#D9534F] rounded-2xl p-6 mx-6 mt-6">
        Tidak dapat menampilkan statistik ibadah salat.
      </p>
    );
  }

  return (
    <div className="mt-16">
      <PrayerLeaderboardView
        lineChartData={prayerReportViewModel.lineChartData}
      />

      <div className="relative overflow-hidden mx-6">
        {prayerReportViewModel.subscription ? (
          <></>
        ) : (
          <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-md drop-shadow-md w-full max-w-[80%] text-center p-4">
              <h3 className="text-[#363636] text-lg font-bold mb-2">
                Konten Premium
              </h3>

              <p className="text-[#7B7B7B] text-sm mb-6">
                Berlangganan untuk mengakses Prayer Statistics
              </p>

              <Button className="bg-[#BF8E50] hover:bg-[#BF8E50]/90">
                <Link to="/profile">Berlangganan</Link>
              </Button>
            </div>
          </div>
        )}

        <h2 className="text-[#363636] font-bold text-center text-2xl mb-1">
          Statistik Ibadah Salat
        </h2>

        <p className="text-[#7B7B7B] text-center text-sm mb-8">
          Semangat meningkatkan ketepatan waktu Shalat!
        </p>

        <LineChartView lineChartData={prayerReportViewModel.lineChartData} />

        <PieChartView
          pieChartData={prayerReportViewModel.pieChartData}
          selectedPieChart={prayerReportViewModel.selectedPieChart}
          setSelectedPieChart={prayerReportViewModel.setSelectedPieChart}
        />
      </div>
    </div>
  );
}

export { PrayerReportView };
