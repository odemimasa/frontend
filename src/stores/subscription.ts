import type { StateCreator } from "zustand";
import type { SubscriptionResponse } from "../dtos/SubscriptionDTO";

interface SubscriptionSlice {
  subscription: SubscriptionResponse | undefined | null;
  setSubscription: (
    subscription:
      | ((
          subscription: SubscriptionResponse | undefined | null
        ) => SubscriptionResponse | undefined | null)
      | SubscriptionResponse
      | undefined
      | null
  ) => void;
}

const createSubscriptionSlice: StateCreator<SubscriptionSlice> = (set) => ({
  subscription: undefined,
  setSubscription: (subscription) => {
    set((state) => {
      if (typeof subscription === "function") {
        return { subscription: subscription(state.subscription) };
      }
      return { subscription };
    });
  },
});

export { createSubscriptionSlice };
export type { SubscriptionSlice };
