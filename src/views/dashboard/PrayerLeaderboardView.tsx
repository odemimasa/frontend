import { Button } from "@components/shadcn/Button";
import { Link } from "react-router";
import { usePrayerLeaderboardViewModel } from "../../viewmodels/dashboard/usePrayerLeaderboardViewModel";
import type { LineChartData } from "../../viewmodels/dashboard/usePrayerReportViewModel";

function PrayerLeaderboardView({
  lineChartData,
}: {
  lineChartData: LineChartData;
}) {
  const prayerLeaderboardViewModel = usePrayerLeaderboardViewModel();

  const mostOnTimePrayer =
    prayerLeaderboardViewModel.findMostOnTimePrayer(lineChartData);
  const mostLatePrayer =
    prayerLeaderboardViewModel.findMostLatePrayer(lineChartData);
  const mostMissedPrayer =
    prayerLeaderboardViewModel.findMostMissedPrayer(lineChartData);

  return (
    <div className="relative overflow-hidden border border-[#C2C2C2] rounded-3xl py-5 px-4 mx-6 mb-16">
      {prayerLeaderboardViewModel.user?.subscription ? (
        <></>
      ) : (
        <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-md drop-shadow-md w-full max-w-[80%] text-center p-4">
            <h3 className="text-[#363636] text-lg font-bold mb-2">
              Konten Premium
            </h3>

            <p className="text-[#7B7B7B] text-sm mb-6">
              Berlangganan untuk mengakses Prayer Leaderboard
            </p>

            <Button className="bg-[#BF8E50] hover:bg-[#BF8E50]/90">
              <Link to="/profile">Berlangganan</Link>
            </Button>
          </div>
        </div>
      )}

      <h2 className="text-[#363636] font-bold text-center text-2xl mb-8">
        Rangkuman
      </h2>

      <div className="flex justify-center items-end gap-2">
        <div className="bg-[#F0AD4E] rounded-t-3xl h-[140px] w-full max-w-24 p-3.5">
          <div className="bg-white flex flex-col justify-center items-center gap-1 rounded-2xl py-1.5">
            <div className="bg-[#F0AD4E] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
              2
            </div>

            <span className="text-[#363636] text-sm capitalize">
              {mostLatePrayer ?? "Kosong"}
            </span>
          </div>
        </div>

        <div className="bg-[#238471] rounded-t-3xl h-[160px] w-full max-w-24 p-3.5">
          <div className="bg-white flex flex-col justify-center items-center gap-1 rounded-2xl py-1.5">
            <div className="bg-[#238471] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
              1
            </div>

            <span className="text-[#363636] text-sm capitalize">
              {mostOnTimePrayer ?? "Kosong"}
            </span>
          </div>
        </div>

        <div className="bg-[#D9534F] rounded-t-3xl h-[140px] w-full max-w-24 p-3.5">
          <div className="bg-white flex flex-col justify-center items-center gap-1 rounded-2xl py-1.5">
            <div className="bg-[#D9534F] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
              3
            </div>

            <span className="text-[#363636] text-sm capitalize">
              {mostMissedPrayer ?? "Kosong"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
          <div className="bg-[#238471] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
            1
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-[#7B7B7B] font-medium text-xs">
              Ibadah salat paling tepat waktu:
            </p>

            <p className="text-[#7B7B7B] font-bold text-sm capitalize">
              {mostOnTimePrayer ?? "Kosong"}
            </p>
          </div>
        </div>

        <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
          <div className="bg-[#F0AD4E] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
            2
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-[#7B7B7B] font-medium text-xs">
              Ibadah salat paling sering terlambat:
            </p>

            <p className="text-[#7B7B7B] font-bold text-sm capitalize">
              {mostLatePrayer ?? "Kosong"}
            </p>
          </div>
        </div>

        <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
          <div className="bg-[#D9534F] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
            3
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-[#7B7B7B] font-medium text-xs">
              Ibadah salat sering tidak terlaksana:
            </p>

            <p className="text-[#7B7B7B] font-bold text-sm capitalize">
              {mostMissedPrayer ?? "Kosong"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PrayerLeaderboardView };
