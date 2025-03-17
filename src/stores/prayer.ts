import type { StateCreator } from "zustand";
import type { PrayerResponse } from "../models/PrayerModel";

interface PrayerSlice {
  prayers: PrayerResponse[];
  setPrayers: (
    prayers:
      | ((prayers: PrayerResponse[]) => PrayerResponse[])
      | PrayerResponse[]
  ) => void;
}

const createPrayerSlice: StateCreator<PrayerSlice> = (set) => ({
  prayers: [],
  setPrayers: (prayers) => {
    set((state) => {
      if (typeof prayers === "function") {
        return { prayers: prayers(state.prayers) };
      }
      return { prayers };
    });
  },
});

export { createPrayerSlice };
export type { PrayerSlice };
