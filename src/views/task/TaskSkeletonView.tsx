import { Skeleton } from "@components/shadcn/Skeleton";

function TaskSkeletonView() {
  return (
    <>
      <div className="animate-pulse border border-[#C2C2C2] rounded-lg flex flex-col space-y-3 mx-6 mt-6 p-5">
        <div className="flex justify-between items-center gap-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="w-4 h-4 rounded-none" />
        </div>

        <Skeleton className="h-4 w-40" />
      </div>

      <div className="animate-pulse border border-[#C2C2C2] rounded-lg flex flex-col space-y-3 mx-6 mt-6 p-5">
        <div className="flex justify-between items-center gap-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="w-4 h-4 rounded-none" />
        </div>

        <Skeleton className="h-4 w-40" />
      </div>

      <div className="animate-pulse border border-[#C2C2C2] rounded-lg flex flex-col space-y-3 mx-6 mt-6 p-5">
        <div className="flex justify-between items-center gap-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="w-4 h-4 rounded-none" />
        </div>

        <Skeleton className="h-4 w-40" />
      </div>
    </>
  );
}

export { TaskSkeletonView };
