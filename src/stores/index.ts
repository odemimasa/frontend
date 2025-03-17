import { create } from "zustand";
import { createUserSlice, type UserSlice } from "./user";
import { createPrayerSlice, type PrayerSlice } from "./prayer";

const useStore = create<UserSlice & PrayerSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createPrayerSlice(...a),
}));

export { useStore };
