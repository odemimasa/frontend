import type { StateCreator } from "zustand";
import type { PlanResponse } from "../models/PlanModel";

interface PlanSlice {
  plans: PlanResponse[];
  setPlans: (
    plans: ((plans: PlanResponse[]) => PlanResponse[]) | PlanResponse[]
  ) => void;
}

const createPlanSlice: StateCreator<PlanSlice> = (set) => ({
  plans: [],
  setPlans: (plans) => {
    set((state) => {
      if (typeof plans === "function") {
        return { plans: plans(state.plans) };
      }
      return { plans };
    });
  },
});

export { createPlanSlice };
export type { PlanSlice };
