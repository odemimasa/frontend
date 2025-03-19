import type { AxiosInstance, AxiosResponse } from "axios";
import type { PlanResponse } from "../dtos/PlanDTO";

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
