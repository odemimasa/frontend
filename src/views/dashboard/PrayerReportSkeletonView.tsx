import { Skeleton } from "@components/shadcn/Skeleton";

function PrayerReportSkeletonView() {
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

export { PrayerReportSkeletonView };
