import { Badge } from "@components/shadcn/Badge";
import { formatISODate } from "@utils/index";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { PaymentModel } from "../../models/PaymentModel";
import { usePaymentsViewModel } from "../../viewmodels/profile/usePaymentsViewModel";
import { useMemo } from "react";
import { PaymentsSkeletonView } from "./PaymentsSkeletonView";

function PaymentsView() {
  const { retryWithRefresh } = useAxiosContext();
  const paymentModel = useMemo((): PaymentModel => {
    return new PaymentModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const paymentsViewModel = usePaymentsViewModel(paymentModel);

  if (paymentsViewModel.isLoading) {
    return <PaymentsSkeletonView />;
  }

  if (paymentsViewModel.payments === undefined) {
    return (
      <p className="text-[#D9534F] text-center font-medium border border-[#D9534F] rounded-2xl p-6 mx-6">
        Tidak dapat menampilkan daftar transaksi.
      </p>
    );
  }

  if (paymentsViewModel.payments.length === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Belum ada transaksi.
      </p>
    );
  }

  return paymentsViewModel.payments.map((item, index, payments) => {
    let statusColor = "";
    switch (item.status) {
      case "paid":
        statusColor = "border-[#67ACE8] text-[#67ACE8]";
        break;
      case "expired":
        statusColor = "border-[#7B7B7B] text-[#7B7B7B]";
        break;
      case "failed":
        statusColor = "border-[#D9534F] text-[#D9534F]";
        break;
      case "refund":
        statusColor = "border-[#7866AE] text-[#7866AE]";
        break;
    }

    return (
      <div
        key={item.id}
        className={`${index === payments.length - 1 ? "mb-0" : "mb-4"} border border-[#C2C2C2] rounded-2xl p-6 mx-6`}
      >
        <Badge
          variant="outline"
          className={`${statusColor} capitalize py-1 px-2`}
        >
          {item.status}
        </Badge>

        <p className="text-[#363636] font-bold my-4">
          Rp{Intl.NumberFormat("id-ID").format(item.amount_paid)}
        </p>

        <p className="text-[#7B7B7B] font-medium text-sm flex justify-between items-center">
          <span>Dibayar pada:</span>
          <span>
            {formatISODate(item.created_at, paymentsViewModel.userTimezone)}
          </span>
        </p>
      </div>
    );
  });
}

export { PaymentsView };
