import { create } from "zustand";
import { createUserSlice, type UserSlice } from "./user";
import { createPrayerSlice, type PrayerSlice } from "./prayer";
import {
  createSubscriptionSlice,
  type SubscriptionSlice,
} from "./subscription";
import { createInvoiceSlice, type InvoiceSlice } from "./invoice";

const useStore = create<
  UserSlice & PrayerSlice & SubscriptionSlice & InvoiceSlice
>()((...a) => ({
  ...createUserSlice(...a),
  ...createPrayerSlice(...a),
  ...createSubscriptionSlice(...a),
  ...createInvoiceSlice(...a),
}));

export { useStore };
