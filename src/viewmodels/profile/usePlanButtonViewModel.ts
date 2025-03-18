import { useState, type Dispatch, type SetStateAction } from "react";
import type { InvoiceModel } from "../../models/InvoiceModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore } from "../../stores";
import type { PlanResponse } from "../../models/PlanModel";

function usePlanButtonViewModel(invoiceModel: InvoiceModel) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const user = useStore((state) => state.user);
  const setInvoice = useStore((state) => state.setInvoice);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const createInvoice = async (
    plan: PlanResponse,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    coupon_code?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await invoiceModel.createInvoice({
        customer_name: user?.name ?? "John Doe",
        customer_email: user?.email ?? "example@gmail.com",
        plan,
        coupon_code,
      });

      toast({ description: "Tagihan berhasil dibuat.", variant: "default" });
      setInvoice(res.data);
      setIsAlertDialogOpen(false);
      setIsOpen(false);
    } catch (error) {
      handleAxiosError(error as Error, (response) => {
        if (response.status === 400) {
          console.error(new Error("invalid request body"));
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isAlertDialogOpen, setIsAlertDialogOpen, createInvoice };
}

export { usePlanButtonViewModel };
