import type { StateCreator } from "zustand";
import type { InvoiceResponse } from "../models/InvoiceModel";

interface InvoiceSlice {
  invoice: InvoiceResponse | undefined;
  setInvoice: (
    invoice:
      | ((invoice: InvoiceResponse | undefined) => InvoiceResponse | undefined)
      | InvoiceResponse
      | undefined
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
