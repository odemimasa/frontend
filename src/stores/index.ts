import { create } from "zustand";
import { createUserSlice, type UserSlice } from "./user";
import { createPrayerSlice, type PrayerSlice } from "./prayer";
import {
  createSubscriptionSlice,
  type SubscriptionSlice,
} from "./subscription";
import { createInvoiceSlice, type InvoiceSlice } from "./invoice";
import { createPlanSlice, type PlanSlice } from "./plan";
import { createPaymentSlice, type PaymentSlice } from "./payment";

type ResetAction = {
  reset: () => void;
};

const useStore = create<
  UserSlice &
    PrayerSlice &
    SubscriptionSlice &
    InvoiceSlice &
    PlanSlice &
    PaymentSlice &
    ResetAction
>()((...a) => ({
  ...createUserSlice(...a),
  ...createPrayerSlice(...a),
  ...createSubscriptionSlice(...a),
  ...createInvoiceSlice(...a),
  ...createPlanSlice(...a),
  ...createPaymentSlice(...a),
  reset: () => {
    a[0]({
      user: undefined,
      prayers: [],
      thisMonthPrayers: [],
      subscription: undefined,
      invoice: undefined,
      plans: [],
      payments: [],
    });
  },
}));

export { useStore };
