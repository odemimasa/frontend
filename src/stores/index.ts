import { create } from "zustand";
import { createUserSlice, type UserSlice } from "./user";
import { createPrayerSlice, type PrayerSlice } from "./prayer";
import {
  createSubscriptionSlice,
  type SubscriptionSlice,
} from "./subscription";

const useStore = create<UserSlice & PrayerSlice & SubscriptionSlice>()(
  (...a) => ({
    ...createUserSlice(...a),
    ...createPrayerSlice(...a),
    ...createSubscriptionSlice(...a),
  })
);

export { useStore };
