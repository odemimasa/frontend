import { Skeleton } from "@components/shadcn/Skeleton";

function SubscriptionSkeletonView() {
  return (
    <div className="animate-pulse border border-[#C2C2C2] rounded-2xl p-6 mx-6">
      <Skeleton className="h-6 w-12" />
      <Skeleton className="h-4 mt-3.5" />
      <Skeleton className="h-4 w-4/5 mt-2" />
      <Skeleton className="h-9 w-32 mt-3.5" />
    </div>
  );
}

export { SubscriptionSkeletonView };
