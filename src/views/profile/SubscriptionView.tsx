import { Wallet } from "@components/Icons/Wallet";
import { Badge } from "@components/shadcn/Badge";
import { Button } from "@components/shadcn/Button";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { SubscriptionModel } from "../../models/SubscriptionModel";
import { useSubscriptionViewModel } from "../../viewmodels/profile/useSubscriptionViewModel";
import { formatISODate } from "@utils/index";
import { lazy, useMemo } from "react";
import { SubscriptionSkeletonView } from "./SubscriptionSkeletonView";

const PlansDialogView = lazy(() =>
  import("./PlansDialogView").then(({ PlansDialogView }) => ({
    default: PlansDialogView,
  }))
);

function SubscriptionView() {
  const { retryWithRefresh } = useAxiosContext();
  const subscriptionModel = useMemo((): SubscriptionModel => {
    return new SubscriptionModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const subscriptionViewModel = useSubscriptionViewModel(subscriptionModel);

  if (subscriptionViewModel.isLoading) {
    return <SubscriptionSkeletonView />;
  }

  if (subscriptionViewModel.subscription === undefined) {
    return (
      <p className="text-[#D9534F] text-center font-medium border border-[#D9534F] rounded-2xl p-6 mx-6">
        Tidak dapat menampilkan langganan.
      </p>
    );
  }

  if (subscriptionViewModel.subscription === null) {
    return (
      <div className="border border-[#C2C2C2] rounded-2xl p-6  mx-6">
        <Badge variant="outline" className="text-black border-[#E1E1E1]">
          Free
        </Badge>

        <p className="text-[#363636] font-bold text-sm mt-3.5">
          Beli Paket Premiun, Nikmati Semua Layanan
        </p>

        <Button
          disabled={!!subscriptionViewModel.invoice}
          onClick={() => subscriptionViewModel.setIsOpen(true)}
          type="button"
          variant="outline"
          className="text-[#363636] border-[#2F3D4A] mt-3.5"
        >
          <Wallet className="fill-[#363636]" />
          Beli Paket
        </Button>

        {subscriptionViewModel.isOpen ? (
          <PlansDialogView
            isOpen={subscriptionViewModel.isOpen}
            setIsOpen={subscriptionViewModel.setIsOpen}
          />
        ) : (
          <></>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#BF8E50] rounded-2xl p-6 mx-6">
      <Badge className="bg-white hover:bg-white text-black">Premium</Badge>

      <p className="text-white text-sm mt-3.5">
        Berlaku hingga:&nbsp;
        <strong>
          {formatISODate(
            subscriptionViewModel.subscription.end_date,
            subscriptionViewModel.userTimezone
          )}
        </strong>
      </p>

      <Button
        disabled
        type="button"
        className="bg-white hover:bg-white/90 text-[#363636] mt-3.5"
      >
        <Wallet className="fill-[#363636]" />
        Beli Paket
      </Button>
    </div>
  );
}

export { SubscriptionView };
