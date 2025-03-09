import { useStore, type PrayerName } from "@hooks/useStore";

interface PrayerStatus {
  prayerName: PrayerName;
  numOfStatus: number;
}

function getLargestPrayerStatus(
  prayerStatuses: PrayerStatus[]
): PrayerName | undefined {
  const largestPrayerStatus: PrayerStatus = {
    prayerName: "subuh",
    numOfStatus: 0,
  };

  for (const prayerStatus of prayerStatuses) {
    if (prayerStatus.numOfStatus > largestPrayerStatus.numOfStatus) {
      largestPrayerStatus.prayerName = prayerStatus.prayerName;
      largestPrayerStatus.numOfStatus = prayerStatus.numOfStatus;
    }
  }

  return largestPrayerStatus.numOfStatus !== 0
    ? largestPrayerStatus.prayerName
    : undefined;
}

function PrayerLeaderboard() {
  const prayerStatistic = useStore((state) => state.prayerStatistic);

  const mostOnTimePrayer = getLargestPrayerStatus([
    {
      prayerName: "subuh",
      numOfStatus: prayerStatistic!.get("subuh")![2],
    },
    {
      prayerName: "zuhur",
      numOfStatus: prayerStatistic!.get("zuhur")![2],
    },
    {
      prayerName: "asar",
      numOfStatus: prayerStatistic!.get("asar")![2],
    },
    {
      prayerName: "magrib",
      numOfStatus: prayerStatistic!.get("magrib")![2],
    },
    {
      prayerName: "isya",
      numOfStatus: prayerStatistic!.get("isya")![2],
    },
  ]);

  const mostLatePrayer = getLargestPrayerStatus([
    {
      prayerName: "subuh",
      numOfStatus: prayerStatistic!.get("subuh")![1],
    },
    {
      prayerName: "zuhur",
      numOfStatus: prayerStatistic!.get("zuhur")![1],
    },
    {
      prayerName: "asar",
      numOfStatus: prayerStatistic!.get("asar")![1],
    },
    {
      prayerName: "magrib",
      numOfStatus: prayerStatistic!.get("magrib")![1],
    },
    {
      prayerName: "isya",
      numOfStatus: prayerStatistic!.get("isya")![1],
    },
  ]);

  const mostMissedPrayer = getLargestPrayerStatus([
    {
      prayerName: "subuh",
      numOfStatus: prayerStatistic!.get("subuh")![0],
    },
    {
      prayerName: "zuhur",
      numOfStatus: prayerStatistic!.get("zuhur")![0],
    },
    {
      prayerName: "asar",
      numOfStatus: prayerStatistic!.get("asar")![0],
    },
    {
      prayerName: "magrib",
      numOfStatus: prayerStatistic!.get("magrib")![0],
    },
    {
      prayerName: "isya",
      numOfStatus: prayerStatistic!.get("isya")![0],
    },
  ]);

  return (
    <div className="border border-[#C2C2C2] rounded-3xl py-5 px-4 mx-6 mb-16">
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

export { PrayerLeaderboard };
