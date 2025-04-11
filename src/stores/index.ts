import { create } from "zustand";
import { createUserSlice, type UserSlice } from "./user";
import { createPrayerSlice, type PrayerSlice } from "./prayer";
import { createInvoiceSlice, type InvoiceSlice } from "./invoice";
import { createPlanSlice, type PlanSlice } from "./plan";
import { createPaymentSlice, type PaymentSlice } from "./payment";
import { createTaskSlice, type TaskSlice } from "./task";

const useStore = create<
  UserSlice & PrayerSlice & InvoiceSlice & PlanSlice & PaymentSlice & TaskSlice
>()((...a) => ({
  ...createUserSlice(...a),
  ...createPrayerSlice(...a),
  ...createInvoiceSlice(...a),
  ...createPlanSlice(...a),
  ...createPaymentSlice(...a),
  ...createTaskSlice(...a),
}));

export { useStore };
