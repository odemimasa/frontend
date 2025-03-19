import type { AxiosInstance, AxiosResponse } from "axios";
import type { PrayerRequest, PrayerResponse } from "../dtos/PrayerDTO";
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";

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

  getPrayerTimes(
    latitude: number,
    longitude: number,
    date: Date = new Date()
  ): PrayerTimes {
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.Singapore();
    params.madhab = Madhab.Shafi;

    let prayerTimes = new PrayerTimes(coordinates, date, params);
    const currentHours = prayerTimes.date.getHours();
    const fajrHours = prayerTimes.fajr.getHours();

    if (currentHours < fajrHours) {
      const previousDate = new Date(prayerTimes.date);
      previousDate.setDate(prayerTimes.date.getDate() - 1);
      prayerTimes = new PrayerTimes(coordinates, previousDate, params);
    }

    return prayerTimes;
  }
}

export { PrayerModel };
