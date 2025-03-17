import { create } from "zustand";
import { createUserSlice, type UserSlice } from "./user";
import { createPrayerSlice, type PrayerSlice } from "./prayer";
import {
  createSubscriptionSlice,
  type SubscriptionSlice,
} from "./subscription";
import { createInvoiceSlice, type InvoiceSlice } from "./invoice";
import { createPlanSlice, type PlanSlice } from "./plan";

const useStore = create<
  UserSlice & PrayerSlice & SubscriptionSlice & InvoiceSlice & PlanSlice
>()((...a) => ({
  ...createUserSlice(...a),
  ...createPrayerSlice(...a),
  ...createSubscriptionSlice(...a),
  ...createInvoiceSlice(...a),
  ...createPlanSlice(...a),
}));

export { useStore };
