import type { StateCreator } from "zustand";
import type { PaymentResponse } from "../dtos/PaymentDTO";

interface PaymentSlice {
  payments: PaymentResponse[] | undefined;
  setPayments: (
    payments:
      | ((
          payments: PaymentResponse[] | undefined
        ) => PaymentResponse[] | undefined)
      | PaymentResponse[]
      | undefined
  ) => void;
}

const createPaymentSlice: StateCreator<PaymentSlice> = (set) => ({
  payments: undefined,
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
