import type { AxiosInstance, AxiosResponse } from "axios";

type PaymentStatus = "paid" | "expired" | "failed" | "refund";

interface PaymentResponse {
  id: string;
  invoice_id: string;
  amount_paid: number;
  status: PaymentStatus;
  created_at: string;
}

class PaymentModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getPayments(): Promise<AxiosResponse<PaymentResponse[]>> {
    return await this.fetch.get<PaymentResponse[]>("/payments");
  }
}

export { PaymentModel };
export type { PaymentResponse };
