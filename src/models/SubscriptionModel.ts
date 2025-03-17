import type { AxiosInstance, AxiosResponse } from "axios";

interface SubscriptionResponse {
  id: string;
  plan_id: string;
  payment_id: string;
  start_date: string;
  end_date: string;
}

class SubscriptionModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getActiveSubscription(): Promise<AxiosResponse<SubscriptionResponse>> {
    return await this.fetch.get<SubscriptionResponse>("/subscriptions/active");
  }
}

export { SubscriptionModel };
export type { SubscriptionResponse };
