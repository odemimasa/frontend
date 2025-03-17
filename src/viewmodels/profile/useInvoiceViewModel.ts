import { useEffect, useState } from "react";
import { useStore } from "../../stores";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import type { InvoiceModel } from "../../models/InvoiceModel";

function useInvoiceViewModel(invoiceModel: InvoiceModel) {
  const [isLoading, setIsLoading] = useState(true);

  const user = useStore((state) => state.user);
  const invoice = useStore((state) => state.invoice);
  const setInvoice = useStore((state) => state.setInvoice);

  const { handleAxiosError } = useAxiosContext();

  useEffect(() => {
    if (invoice !== undefined) {
      return;
    }

    (async () => {
      try {
        const res = await invoiceModel.getActiveInvoice();
        if (res.data !== null) {
          setInvoice(res.data);
        }
      } catch (error) {
        handleAxiosError(error as Error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [invoice, setInvoice, handleAxiosError, invoiceModel]);

  return {
    isLoading,
    invoice,
    userTimezone: user?.timezone ?? "Asia/Jakarta",
  };
}

export { useInvoiceViewModel };
