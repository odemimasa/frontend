import type { AxiosInstance, AxiosResponse } from "axios";

type PrayerName = "subuh" | "zuhur" | "asar" | "magrib" | "isya";
type PrayerStatus = "pending" | "on_time" | "late" | "missed";

interface PrayerRequest {
  status: PrayerStatus;
}

interface PrayerResponse {
  id: string;
  name: PrayerName;
  status: PrayerStatus;
  year: number;
  month: number;
  day: number;
}

class PrayerModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getPrayers(
    year: number,
    month: number,
    day: number
  ): Promise<AxiosResponse<PrayerResponse[]>> {
    return await this.fetch.get<PrayerResponse[]>(
      `/prayers?year=${year}&month=${month}&day=${day}`
    );
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
export type { PrayerResponse };
