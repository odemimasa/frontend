import { Button } from "@components/shadcn/Button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Link } from "react-router";
import type { PrayerStatistics } from "../../viewmodels/dashboard/usePrayerReportViewModel";
import { useStore } from "../../stores";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PrayerStatisticsView({
  prayerStatistics,
}: {
  prayerStatistics: PrayerStatistics;
}) {
  const user = useStore((state) => state.user);

  return (
    <div className="relative overflow-hidden mx-6">
      {user?.subscription ? (
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

      <Line
        data={{
          labels: ["Tidak Terlaksana", "Terlambat", "Tepat Waktu"],
          datasets: [
            {
              label: "Subuh",
              data: prayerStatistics.get("subuh")!,
              borderColor: "#82A3D8",
              backgroundColor: "#82A3D8",
              fill: false,
            },
            {
              label: "Zuhur",
              data: prayerStatistics.get("zuhur")!,
              borderColor: "#F7EA78",
              backgroundColor: "#F7EA78",
              fill: false,
            },
            {
              label: "Asar",
              data: prayerStatistics.get("asar")!,
              borderColor: "#F1B25B",
              backgroundColor: "#F1B25B",
              fill: false,
            },
            {
              label: "Magrib",
              data: prayerStatistics.get("magrib")!,
              borderColor: "#BF7155",
              backgroundColor: "#BF7155",
              fill: false,
            },
            {
              label: "Isya",
              data: prayerStatistics.get("isya")!,
              borderColor: "#7866AE",
              backgroundColor: "#7866AE",
              fill: false,
            },
          ],
        }}
        options={{
          responsive: true,
          aspectRatio: 1,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 35,
              ticks: {
                autoSkip: false,
                stepSize: 5,
              },
            },
          },
        }}
      />
    </div>
  );
}

export { PrayerStatisticsView };
