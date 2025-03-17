import type { AxiosInstance, AxiosResponse } from "axios";

type PlanType = "premium";

interface PlanResponse {
  id: string;
  type: PlanType;
  name: string;
  price: number;
  duration_in_months: number;
  created_at: string;
}

class PlanModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getPlans(): Promise<AxiosResponse<PlanResponse[]>> {
    return await this.fetch.get<PlanResponse[]>("/plans");
  }
}

export { PlanModel };
export type { PlanResponse };
