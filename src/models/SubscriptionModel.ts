import type { AxiosInstance, AxiosResponse } from "axios";
import type { SubscriptionResponse } from "../dtos/SubscriptionDTO";

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
