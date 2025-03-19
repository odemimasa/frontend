import type { AxiosInstance, AxiosResponse } from "axios";
import type { InvoiceRequest, InvoiceResponse } from "../dtos/InvoiceDTO";

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
