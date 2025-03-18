import { useMemo } from "react";
import type { PrayerSchedule } from "../../viewmodels/dashboard/usePrayersViewModel";

interface PrayerProgressViewProps
  extends Pick<PrayerSchedule, "status" | "date"> {
  currentDate: Date;
}

function PrayerProgressView({
  status,
  date,
  currentDate,
}: PrayerProgressViewProps) {
  const boxColor = useMemo((): string => {
    if (currentDate.getTime() < date.getTime() || status === "pending") {
      return "bg-[#ECECEC]";
    }

    if (status === "on_time") {
      return "bg-[#238471]";
    } else if (status === "late") {
      return "bg-[#F0AD4E]";
    } else {
      return "bg-[#D9534F]";
    }
  }, [status, date, currentDate]);

  return <div className={`${boxColor} w-12 h-6`}></div>;
}

export { PrayerProgressView };
