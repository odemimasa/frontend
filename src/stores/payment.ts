import type { StateCreator } from "zustand";
import type { PaymentResponse } from "../models/PaymentModel";

interface PaymentSlice {
  payments: PaymentResponse[];
  setPayments: (
    payments:
      | ((payments: PaymentResponse[]) => PaymentResponse[])
      | PaymentResponse[]
  ) => void;
}

const createPaymentSlice: StateCreator<PaymentSlice> = (set) => ({
  payments: [],
  setPayments: (payments) => {
    set((state) => {
      if (typeof payments === "function") {
        return { payments: payments(state.payments) };
      }
      return { payments };
    });
  },
});

export { createPaymentSlice };
export type { PaymentSlice };
