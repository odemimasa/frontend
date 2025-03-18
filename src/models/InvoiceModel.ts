import type { AxiosInstance, AxiosResponse } from "axios";
import type { PlanResponse } from "./PlanModel";

interface InvoiceRequest {
  coupon_code?: string;
  customer_name: string;
  customer_email: string;
  plan: Pick<
    PlanResponse,
    "id" | "type" | "name" | "price" | "duration_in_months"
  >;
}

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

  async createInvoice(
    invoiceRequest: InvoiceRequest
  ): Promise<AxiosResponse<InvoiceResponse>> {
    return await this.fetch.post<
      InvoiceResponse,
      AxiosResponse<InvoiceResponse>,
      InvoiceRequest
    >("/invoices", invoiceRequest);
  }
}

export { InvoiceModel };
export type { InvoiceResponse, InvoiceRequest };
