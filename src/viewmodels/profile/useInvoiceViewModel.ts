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
  const [isLoading, setIsLoading] = useState(true);

  const user = useStore((state) => state.user);
  const plans = useStore((state) => state.plans);
  const setPlans = useStore((state) => state.setPlans);
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

  useEffect(() => {
    if (invoice === undefined || plans.length > 0) {
      return;
    }

    (async () => {
      try {
        const res = await planModel.getPlans();
        if (res.data.length > 0) {
          setPlans(res.data);
        }
      } catch (error) {
        handleAxiosError(error as Error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [invoice, plans, setPlans, planModel, handleAxiosError]);

  const invoiceWithPlan = useMemo((): InvoiceWithPlan | undefined => {
    if (invoice === undefined) {
      return undefined;
    }

    if (plans.length === 0) {
      return undefined;
    }

    for (const plan of plans) {
      if (plan.id !== invoice.plan_id) {
        continue;
      }

      return { ...invoice, plan };
    }
  }, [invoice, plans]);

  return {
    isLoading,
    invoiceWithPlan,
    userTimezone: user?.timezone ?? "Asia/Jakarta",
  };
}

export { useInvoiceViewModel };
