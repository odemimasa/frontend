import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../stores";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import type { InvoiceModel } from "../../models/InvoiceModel";
import type { PlanModel } from "../../models/PlanModel";
import type { PlanResponse } from "../../dtos/PlanDTO";
import type { InvoiceResponse } from "../../dtos/InvoiceDTO";

interface InvoiceWithPlan extends InvoiceResponse {
  plan: PlanResponse;
}

function useInvoiceViewModel(invoiceModel: InvoiceModel, planModel: PlanModel) {
  const [isLoading, setIsLoading] = useState(false);

  const user = useStore((state) => state.user);
  const plans = useStore((state) => state.plans);
  const setPlans = useStore((state) => state.setPlans);
  const invoice = useStore((state) => state.invoice);
  const setInvoice = useStore((state) => state.setInvoice);

  const { handleAxiosError } = useAxiosContext();

  useEffect(() => {
    if (invoice === undefined) {
      setIsLoading(true);
      (async () => {
        try {
          const res = await invoiceModel.getActiveInvoice();
          if (res.data) {
            setInvoice(res.data);
          } else {
            setInvoice(null);
          }
        } catch (error) {
          handleAxiosError(error as Error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [invoice, setInvoice, handleAxiosError, invoiceModel]);

  useEffect(() => {
    if (invoice && plans === undefined) {
      setIsLoading(true);
      (async () => {
        try {
          const res = await planModel.getPlans();
          setPlans(res.data);
        } catch (error) {
          handleAxiosError(error as Error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [invoice, plans, setPlans, planModel, handleAxiosError]);

  const invoiceWithPlan = useMemo((): InvoiceWithPlan | undefined | null => {
    if (invoice === undefined) {
      return undefined;
    }

    if (invoice === null) {
      return null;
    }

    if (plans === undefined) {
      return null;
    }

    for (const plan of plans) {
      if (plan.id === invoice.plan_id) {
        return { ...invoice, plan };
      }
    }

    setInvoice(null);
    return null;
  }, [invoice, plans, setInvoice]);

  return {
    isLoading,
    invoiceWithPlan,
    userTimezone: user?.timezone ?? "Asia/Jakarta",
  };
}

export { useInvoiceViewModel };
