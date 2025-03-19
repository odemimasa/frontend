import type { StateCreator } from "zustand";
import type { PrayerResponse } from "../dtos/PrayerDTO";

interface PrayerSlice {
  prayers: PrayerResponse[];
  thisMonthPrayers: PrayerResponse[];
  setPrayers: (
    prayers:
      | ((prayers: PrayerResponse[]) => PrayerResponse[])
      | PrayerResponse[]
  ) => void;
  setThisMonthPrayers: (
    thisMonthPrayers:
      | ((thisMonthPrayers: PrayerResponse[]) => PrayerResponse[])
      | PrayerResponse[]
  ) => void;
}

const createPrayerSlice: StateCreator<PrayerSlice> = (set) => ({
  prayers: [],
  thisMonthPrayers: [],
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
