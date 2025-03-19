import type { AxiosInstance, AxiosResponse } from "axios";
import type { PaymentResponse } from "../dtos/PaymentDTO";

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
