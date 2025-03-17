import { useEffect, useMemo, useState } from "react";
import type { PlanModel, PlanResponse } from "../../models/PlanModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useStore } from "../../stores";

type PricingPlan = Map<string, PlanResponse[]>;

function usePlansDialogViewModel(planModel: PlanModel) {
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");

  const plans = useStore((state) => state.plans);
  const setPlans = useStore((state) => state.setPlans);

  const { handleAxiosError } = useAxiosContext();

  useEffect(() => {
    if (plans.length > 0) {
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
  }, [plans, setPlans, handleAxiosError, planModel]);

  const pricingPlan = useMemo((): PricingPlan => {
    if (plans.length === 0) {
      return new Map();
    }

    const pricingPlan: PricingPlan = new Map();
    for (const plan of plans) {
      const result = pricingPlan.get(plan.type);
      if (result) {
        pricingPlan.set(plan.type, [...result, plan]);
      } else {
        pricingPlan.set(plan.type, new Array<PlanResponse>(plan));
      }
    }

    setIsLoading(false);
    return pricingPlan;
  }, [plans]);

  return { isLoading, couponCode, pricingPlan, setCouponCode };
}

export { usePlansDialogViewModel };
export type { PricingPlan };
