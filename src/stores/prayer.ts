import type { StateCreator } from "zustand";
import type { PrayerResponse } from "../dtos/PrayerDTO";

interface PrayerSlice {
  prayers: PrayerResponse[] | undefined;
  thisMonthPrayers: PrayerResponse[] | undefined;
  setPrayers: (
    prayers:
      | ((
          prayers: PrayerResponse[] | undefined
        ) => PrayerResponse[] | undefined)
      | PrayerResponse[]
      | undefined
  ) => void;
  setThisMonthPrayers: (
    thisMonthPrayers:
      | ((
          thisMonthPrayers: PrayerResponse[] | undefined
        ) => PrayerResponse[] | undefined)
      | PrayerResponse[]
      | undefined
  ) => void;
}

const createPrayerSlice: StateCreator<PrayerSlice> = (set) => ({
  prayers: undefined,
  thisMonthPrayers: undefined,
  setPrayers: (prayers) => {
    set((state) => {
      if (typeof prayers === "function") {
        return { prayers: prayers(state.prayers) };
      }
      return { prayers };
    });
  },
  setThisMonthPrayers: (thisMonthPrayers) => {
    set((state) => {
      if (typeof thisMonthPrayers === "function") {
        return { thisMonthPrayers: thisMonthPrayers(state.thisMonthPrayers) };
      }
      return { thisMonthPrayers };
    });
  },
});

export { createPrayerSlice };
export type { PrayerSlice };
