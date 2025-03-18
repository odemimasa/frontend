import type { AxiosInstance, AxiosResponse } from "axios";

interface CouponResponse {
  code: string;
  influencer_username: string;
  quota: number;
  created_at: string;
}

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
export type { CouponResponse };
