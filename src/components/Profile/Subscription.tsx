import { Wallet } from "@components/Icons/Wallet";
import { Badge } from "@components/shadcn/Badge";
import { Button } from "@components/shadcn/Button";
import { useStore, type ActiveSubscription } from "@hooks/useStore";
import { lazy, useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthProvider";
import axiosRetry from "axios-retry";
import type { AxiosError } from "axios";
import { useToast } from "@hooks/shadcn/useToast";
import { formatISODate } from "@utils/index";

const PricingListDialog = lazy(() =>
  import("@components/Profile/PricingListDialog").then(
    ({ PricingListDialog }) => ({
      default: PricingListDialog,
    })
  )
);

function Subscription() {
  const user = useStore((state) => state.user);
  const activeSubscription = useStore((state) => state.activeSubscription);
  const activeInvoice = useStore((state) => state.activeInvoice);
  const setActiveSubscription = useStore(
    (state) => state.setActiveSubscription
  );

  const [isLoading, setIsLoading] = useState(true);
  const [pricingListOpened, setPricingListOpened] = useState(false);
  const { toast } = useToast();
  const { retryWithRefresh } = useAuthContext();

  useEffect(() => {
    if (activeSubscription !== undefined) return;

    (async () => {
      try {
        const res = await retryWithRefresh.get<ActiveSubscription>(
          "/subscriptions/active"
        );

        if (res.status === 200 && res.data !== null) {
          setActiveSubscription(res.data);
        }
      } catch (error) {
        const status = (error as AxiosError).response?.status;
        if (
          axiosRetry.isNetworkError(error as AxiosError) ||
          (status || 0) >= 500
        ) {
          toast({
            description: "Gagal mengecek langganan yang aktif.",
            variant: "destructive",
          });
        }

        console.error(
          new Error("failed to get active subscription", { cause: error })
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [activeSubscription, setActiveSubscription, retryWithRefresh, toast]);

  if (isLoading) {
    return (
      <p className="text-[#7B7B7B] text-center font-bold italic border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Loading...
      </p>
    );
  }

  if (activeSubscription === undefined) {
    return (
      <div className="border border-[#C2C2C2] rounded-2xl p-6  mx-6">
        <Badge variant="outline" className="text-black border-[#E1E1E1]">
          Free
        </Badge>

        <p className="text-[#363636] font-bold text-sm mt-3.5">
          Beli Paket Premiun, Nikmati Semua Layanan
        </p>

        <Button
          disabled={activeInvoice !== undefined}
          onClick={() => setPricingListOpened(true)}
          type="button"
          variant="outline"
          className="text-[#363636] border-[#2F3D4A] mt-3.5"
        >
          <Wallet className="fill-[#363636]" />
          Beli Paket
        </Button>

        {pricingListOpened ? (
          <PricingListDialog
            open={pricingListOpened}
            setOpen={setPricingListOpened}
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
          {formatISODate(activeSubscription.end_date, user!.timezone)}
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

export { Subscription };
