import type { AxiosInstance, AxiosResponse } from "axios";

interface InvoiceResponse {
  id: string;
  plan_id: string;
  ref_id: string;
  coupon_code: string;
  total_amount: number;
  qr_url: string;
  expires_at: string;
  created_at: string;
}

class InvoiceModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getActiveInvoice(): Promise<AxiosResponse<InvoiceResponse>> {
    return await this.fetch.get<InvoiceResponse>("/invoices/active");
  }
}

export { InvoiceModel };
export type { InvoiceResponse };
