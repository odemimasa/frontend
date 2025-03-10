import { Badge } from "@components/shadcn/Badge";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore, type Payment } from "@hooks/useStore";
import type { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../contexts/AuthProvider";
import { formatISODate } from "@utils/index";

interface TxHistoryItemProps
  extends Pick<Payment, "status" | "amount_paid" | "created_at"> {
  index: number;
  txLength: number;
}

function TxHistoryItem({
  status,
  amount_paid,
  created_at,
  index,
  txLength,
}: TxHistoryItemProps) {
  const user = useStore((state) => state.user);

  const statusColor = useMemo((): string => {
    switch (status) {
      case "paid":
        return "border-[#67ACE8] text-[#67ACE8]";
      case "expired":
        return "border-[#7B7B7B] text-[#7B7B7B]";
      case "failed":
        return "border-[#D9534F] text-[#D9534F]";
      case "refund":
        return "border-[#7866AE] text-[#7866AE]";
    }
  }, [status]);

  return (
    <div
      className={`${index === txLength - 1 ? "mb-0" : "mb-4"} border border-[#C2C2C2] rounded-2xl p-6 mx-6`}
    >
      <Badge
        variant="outline"
        className={`${statusColor} capitalize py-1 px-2`}
      >
        {status}
      </Badge>

      <p className="text-[#363636] font-bold my-4">
        Rp{Intl.NumberFormat("id-ID").format(amount_paid)}
      </p>

      <p className="text-[#7B7B7B] font-medium text-sm flex justify-between items-center">
        <span>Dibayar pada:</span>
        <span>{formatISODate(created_at, user!.timezone)}</span>
      </p>
    </div>
  );
}

function TxHistory() {
  const user = useStore((state) => state.user);
  const payments = useStore((state) => state.payments);
  const setPayments = useStore((state) => state.setPayments);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { retryWithRefresh } = useAuthContext();

  useEffect(() => {
    if (payments !== undefined) return;
    setIsLoading(true);

    (async () => {
      try {
        const res = await retryWithRefresh.get<Payment[]>("/payments");
        if (res.status === 200) {
          setPayments(res.data);
        }
      } catch (error) {
        const status = (error as AxiosError).response?.status;
        if (
          axiosRetry.isNetworkError(error as AxiosError) ||
          (status || 0) >= 500
        ) {
          toast({
            description: "Gagal menampilkan daftar riwayat transaksi.",
            variant: "destructive",
          });
        }

        console.error(new Error("failed to get payments", { cause: error }));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [payments, user, toast, retryWithRefresh, setPayments]);

  if (isLoading) {
    return (
      <p className="text-[#7B7B7B] text-center font-bold italic border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Loading...
      </p>
    );
  }

  if (payments === undefined || payments.length === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Belum ada transaksi
      </p>
    );
  }

  return payments.map((item, index) => (
    <TxHistoryItem
      key={item.id}
      amount_paid={item.amount_paid}
      created_at={item.created_at}
      index={index}
      status={item.status}
      txLength={payments.length}
    />
  ));
}

export { TxHistory };
