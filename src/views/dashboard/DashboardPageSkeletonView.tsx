import { PrayersSkeletonView } from "./PrayersSkeletonView";
import { PrayerReportSkeletonView } from "./PrayerReportSkeletonView";
import { DemiMasaHeaderView } from "../DemiMasaHeaderView";

function DashboardPageSkeletonView() {
  return (
    <>
      <DemiMasaHeaderView />

      <div className="mx-6 py-8">
        <h1 className="text-black font-bold text-center text-xl mb-1">
          Tandain ibadah hari ini yuk!
        </h1>

        <p className="text-[#7B7B7B] text-center">
          Hari ini sudah ibadah apa saja? yuk tandain ibadahmu!
        </p>
      </div>

      <PrayersSkeletonView />
      <PrayerReportSkeletonView />
    </>
  );
}

export { DashboardPageSkeletonView };
