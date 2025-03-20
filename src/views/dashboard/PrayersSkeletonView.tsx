import { Skeleton } from "@components/shadcn/Skeleton";

function PrayersSkeletonView() {
  return (
    <div className="animate-pulse border border-[#E1E1E1] rounded-3xl flex flex-col gap-6 p-6 mx-6">
      <div className="animate-pulse border border-[#E1E1E1] rounded-lg flex flex-col gap-6 p-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="animate-pulse border border-[#E1E1E1] rounded-lg flex flex-col gap-6 p-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-48" />
      </div>

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

export { PrayersSkeletonView };
