import { useEffect, useMemo, useState } from "react";
import type { PlanModel } from "../../models/PlanModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useStore } from "../../stores";
import type { CouponModel } from "../../models/CouponModel";
import { useToast } from "@hooks/shadcn/useToast";
import type { CouponResponse } from "../../dtos/CouponDTO";
import type { PlanResponse } from "../../dtos/PlanDTO";

type PricingPlan = Map<string, PlanResponse[]>;

function usePlansDialogViewModel(
  planModel: PlanModel,
  couponModel: CouponModel
) {
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<CouponResponse | undefined>(undefined);

  const plans = useStore((state) => state.plans);
  const setPlans = useStore((state) => state.setPlans);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const getCoupon = async (code: string) => {
    setIsLoading(true);
    try {
      const res = await couponModel.getCoupon(code);
      toast({
        description: `Kupon ditemukan. Sisa kode adalah ${res.data.quota}.`,
        variant: "default",
      });
      setCoupon(res.data);
    } catch (error) {
      handleAxiosError(error as Error, (response) => {
        if (response.status === 404) {
          setCoupon(undefined);
          toast({
            description: "Kupon tidak ditemukan.",
            variant: "destructive",
          });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return {
    isLoading,
    couponCode,
    coupon,
    pricingPlan,
    setCouponCode,
    getCoupon,
  };
}

export { usePlansDialogViewModel };
export type { PricingPlan };
