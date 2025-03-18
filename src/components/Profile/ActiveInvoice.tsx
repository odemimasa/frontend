import { useToast } from "@hooks/shadcn/useToast";
import {
  useStore,
  type ActiveInvoice as ActiveInvoiceType,
  type SubscriptionPlan,
} from "@hooks/useStore";
import { useEffect, useState } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import axiosRetry from "axios-retry";
import type { AxiosError } from "axios";
import { formatISODateTime } from "@utils/index";
import { Badge } from "@components/shadcn/Badge";
import { Button } from "@components/shadcn/Button";
import { Link } from "react-router";

function ActiveInvoice() {
  const user = useStore((state) => state.user);
  const activeInvoice = useStore((state) => state.activeInvoice);
  const setActiveInvoice = useStore((state) => state.setActiveInvoice);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { retryWithRefresh } = useAxiosContext();

  useEffect(() => {
    if (activeInvoice !== undefined) return;
    setIsLoading(true);

    (async () => {
      try {
        const activeInvoiceRes = await retryWithRefresh.get<
          ActiveInvoiceType & { plan_id: string }
        >("/invoices/active");

        if (activeInvoiceRes.status === 200 && activeInvoiceRes.data !== null) {
          const planRes = await retryWithRefresh.get<SubscriptionPlan>(
            `/plans/${activeInvoiceRes.data.plan_id}`
          );

          if (planRes.status === 200 && planRes.data !== null) {
            setActiveInvoice({ ...activeInvoiceRes.data, plan: planRes.data });
          }
        }
      } catch (error) {
        const status = (error as AxiosError).response?.status;
        if (
          axiosRetry.isNetworkError(error as AxiosError) ||
          (status || 0) >= 500
        ) {
          toast({
            description: "Gagal mengecek tagihan.",
            variant: "destructive",
          });
        }

        console.error(
          new Error("failed to get active invoice", { cause: error })
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [activeInvoice, setActiveInvoice, toast, retryWithRefresh]);

  if (isLoading) {
    return (
      <p className="text-[#7B7B7B] text-center font-bold italic border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Loading...
      </p>
    );
  }

  if (activeInvoice === undefined) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Belum ada transaksi
      </p>
    );
  }

  return (
    <div className="border border-[#C2C2C2] rounded-2xl p-6 mx-6">
      <Badge variant="outline" className="bg-[#BF8E50] text-white py-1 px-2">
        {activeInvoice.plan.name}
      </Badge>

      <div className="flex justify-between items-center my-4">
        <p className="text-[#363636] font-bold">
          Rp{Intl.NumberFormat("id-ID").format(activeInvoice.total_amount)}
        </p>

        <Button
          asChild
          className="text-white hover:text-white bg-[#BF8E50] hover:bg-[#BF8E50]/90 w-24"
        >
          <Link to={activeInvoice.qr_url} target="_blank" rel="noopener">
            Bayar
          </Link>
        </Button>
      </div>

      <p className="text-[#7B7B7B] font-medium text-sm flex justify-between items-center">
        <span>Berlaku hingga:</span>
        <span>
          {formatISODateTime(activeInvoice.expires_at, user!.timezone)}
        </span>
      </p>
    </div>
  );
}

export { ActiveInvoice };
