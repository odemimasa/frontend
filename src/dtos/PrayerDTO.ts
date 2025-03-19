type PrayerName = "subuh" | "zuhur" | "asar" | "magrib" | "isya";
type PrayerStatus = "pending" | "on_time" | "late" | "missed";

interface PrayerRequest {
  status?: PrayerStatus;
}

interface PrayerResponse {
  id: string;
  name: PrayerName;
  status: PrayerStatus;
  year: number;
  month: number;
  day: number;
}

export type { PrayerName, PrayerStatus, PrayerRequest, PrayerResponse };
