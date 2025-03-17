// import { Badge } from "@components/shadcn/Badge";
import { Button } from "@components/shadcn/Button";
import { formatISODateTime } from "@utils/index";
import { Link } from "react-router";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { InvoiceModel } from "../../models/InvoiceModel";
import { useInvoiceViewModel } from "../../viewmodels/profile/useInvoiceViewModel";

function InvoiceView() {
  const { retryWithRefresh } = useAxiosContext();
  const invoiceModel = new InvoiceModel(retryWithRefresh);
  const invoiceViewModel = useInvoiceViewModel(invoiceModel);

  if (invoiceViewModel.isLoading) {
    return (
      <p className="text-[#7B7B7B] text-center font-bold italic border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Loading...
      </p>
    );
  }

  if (invoiceViewModel.invoice === undefined) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Belum ada tagihan
      </p>
    );
  }

  return (
    <div className="border border-[#C2C2C2] rounded-2xl p-6 mx-6">
      {/* <Badge variant="outline" className="bg-[#BF8E50] text-white py-1 px-2">
        {invoiceViewModel.invoice.plan.name}
      </Badge> */}

      <div className="flex justify-between items-center my-4">
        <p className="text-[#363636] font-bold">
          Rp
          {Intl.NumberFormat("id-ID").format(
            invoiceViewModel.invoice.total_amount
          )}
        </p>

        <Button
          asChild
          className="text-white hover:text-white bg-[#BF8E50] hover:bg-[#BF8E50]/90 w-24"
        >
          <Link
            to={invoiceViewModel.invoice.qr_url}
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
            invoiceViewModel.invoice.expires_at,
            invoiceViewModel.userTimezone
          )}
        </span>
      </p>
    </div>
  );
}

export { InvoiceView };
