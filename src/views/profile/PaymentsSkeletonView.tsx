import { Skeleton } from "@components/shadcn/Skeleton";

function PaymentsSkeletonView() {
  return (
    <div className="animate-pulse border border-[#C2C2C2] rounded-2xl p-6 mx-6">
      <Skeleton className="h-6 w-12" />

      <Skeleton className="h-4 w-32 mt-3.5" />

      <div className="flex justify-between items-center mt-3.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export { PaymentsSkeletonView };
