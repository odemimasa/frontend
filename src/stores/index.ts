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

const useStore = create<
  UserSlice &
    PrayerSlice &
    SubscriptionSlice &
    InvoiceSlice &
    PlanSlice &
    PaymentSlice
>()((...a) => ({
  ...createUserSlice(...a),
  ...createPrayerSlice(...a),
  ...createSubscriptionSlice(...a),
  ...createInvoiceSlice(...a),
  ...createPlanSlice(...a),
  ...createPaymentSlice(...a),
}));

export { useStore };
