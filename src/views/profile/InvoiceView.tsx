import { Badge } from "@components/shadcn/Badge";
import { Button } from "@components/shadcn/Button";
import { formatISODateTime } from "@utils/index";
import { Link } from "react-router";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { InvoiceModel } from "../../models/InvoiceModel";
import { useInvoiceViewModel } from "../../viewmodels/profile/useInvoiceViewModel";
import { PlanModel } from "../../models/PlanModel";
import { useMemo } from "react";
import { InvoiceSkeletonView } from "./InvoiceSkeletonView";

function InvoiceView() {
  const { retryWithRefresh } = useAxiosContext();
  const invoiceModel = useMemo((): InvoiceModel => {
    return new InvoiceModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const planModel = useMemo((): PlanModel => {
    return new PlanModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const invoiceViewModel = useInvoiceViewModel(invoiceModel, planModel);

  if (invoiceViewModel.isLoading) {
    return <InvoiceSkeletonView />;
  }

  if (invoiceViewModel.invoiceWithPlan === undefined) {
    return (
      <p className="text-[#D9534F] text-center font-medium border border-[#D9534F] rounded-2xl p-6 mx-6">
        Tidak dapat menampilkan tagihan.
      </p>
    );
  }

  if (invoiceViewModel.invoiceWithPlan === null) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Belum ada tagihan.
      </p>
    );
  }

  return (
    <div className="border border-[#C2C2C2] rounded-2xl p-6 mx-6">
      <Badge variant="outline" className="bg-[#BF8E50] text-white py-1 px-2">
        {invoiceViewModel.invoiceWithPlan.plan.name}
      </Badge>

      <div className="flex justify-between items-center my-4">
        <p className="text-[#363636] font-bold">
          Rp
          {Intl.NumberFormat("id-ID").format(
            invoiceViewModel.invoiceWithPlan.total_amount
          )}
        </p>

        <Button
          asChild
          className="text-white hover:text-white bg-[#BF8E50] hover:bg-[#BF8E50]/90 w-24"
        >
          <Link
            to={invoiceViewModel.invoiceWithPlan.qr_url}
            target="_blank"
            rel="noopener"
          >
            Bayar
          </Link>
        </Button>
      </div>

      <p className="text-[#7B7B7B] font-medium text-sm flex justify-between items-center">
        <span>Berlaku hingga:</span>
        <span>
          {formatISODateTime(
            invoiceViewModel.invoiceWithPlan.expires_at,
            invoiceViewModel.userTimezone
          )}
        </span>
      </p>
    </div>
  );
}

export { InvoiceView };
