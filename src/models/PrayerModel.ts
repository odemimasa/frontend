import type { AxiosInstance, AxiosResponse } from "axios";
import type { PrayerRequest, PrayerResponse } from "../dtos/PrayerDTO";

class PrayerModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getPrayers(
    year: number,
    month: number,
    day?: number
  ): Promise<AxiosResponse<PrayerResponse[]>> {
    let URL = `/prayers?year=${year}&month=${month}`;
    if (day) {
      URL = `/prayers?year=${year}&month=${month}&day=${day}`;
    }

    return await this.fetch.get<PrayerResponse[]>(URL);
  }

  async updatePrayer(
    id: string,
    prayerRequest: PrayerRequest
  ): Promise<AxiosResponse<PrayerResponse>> {
    return await this.fetch.put<
      PrayerResponse,
      AxiosResponse<PrayerResponse>,
      PrayerRequest
    >(`/prayers/${id}`, prayerRequest);
  }
}

export { PrayerModel };
