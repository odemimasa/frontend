import type { StateCreator } from "zustand";
import type { InvoiceResponse } from "../dtos/InvoiceDTO";

interface InvoiceSlice {
  invoice: InvoiceResponse | undefined | null;
  setInvoice: (
    invoice:
      | ((
          invoice: InvoiceResponse | undefined | null
        ) => InvoiceResponse | undefined | null)
      | InvoiceResponse
      | undefined
      | null
  ) => void;
}

const createInvoiceSlice: StateCreator<InvoiceSlice> = (set) => ({
  invoice: undefined,
  setInvoice: (invoice) => {
    set((state) => {
      if (typeof invoice === "function") {
        return { invoice: invoice(state.invoice) };
      }
      return { invoice };
    });
  },
});

export { createInvoiceSlice };
export type { InvoiceSlice };
