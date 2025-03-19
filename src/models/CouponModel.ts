import type { AxiosInstance, AxiosResponse } from "axios";
import type { CouponResponse } from "../dtos/CouponDTO";

class CouponModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getCoupon(code: string): Promise<AxiosResponse<CouponResponse>> {
    return await this.fetch.get<CouponResponse>(`/coupons/${code}`);
  }
}

export { CouponModel };
