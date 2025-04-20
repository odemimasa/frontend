import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { Dispatch, SetStateAction } from "react";
import { Pie } from "react-chartjs-2";
import type { PrayerName } from "../../dtos/PrayerDTO";
import { Tabs, TabsList, TabsTrigger } from "@components/shadcn/Tabs";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartViewProps {
  pieChartData: Record<PrayerName, [number, number, number, number]>;
  selectedPieChart: PrayerName;
  setSelectedPieChart: Dispatch<SetStateAction<PrayerName>>;
}

function PieChartView({
  pieChartData,
  selectedPieChart,
  setSelectedPieChart,
}: PieChartViewProps) {
  return (
    <Tabs defaultValue="subuh" className="mt-8 grid place-items-center">
      <TabsList>
        <TabsTrigger
          onClick={() => setSelectedPieChart("subuh")}
          value="subuh"
          className="data-[state=active]:bg-[#BF8E50] data-[state=active]:text-white"
        >
          Subuh
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setSelectedPieChart("zuhur")}
          value="zuhur"
          className="data-[state=active]:bg-[#BF8E50] data-[state=active]:text-white"
        >
          Zuhur
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setSelectedPieChart("asar")}
          value="asar"
          className="data-[state=active]:bg-[#BF8E50] data-[state=active]:text-white"
        >
          Asar
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setSelectedPieChart("magrib")}
          value="magrib"
          className="data-[state=active]:bg-[#BF8E50] data-[state=active]:text-white"
        >
          Magrib
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setSelectedPieChart("isya")}
          value="isya"
          className="data-[state=active]:bg-[#BF8E50] data-[state=active]:text-white"
        >
          Isya
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <Pie
          data={{
            labels: [
              "Tepat Waktu",
              "Terlambat",
              "Tidak Terlaksana",
              "Akan Datang",
            ],
            datasets: [
              {
                data: pieChartData[selectedPieChart],
                backgroundColor: ["#4ade80", "#facc15", "#f87171", "#ECECEC"],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.label}: ${context.parsed.toFixed(1)}%`;
                  },
                },
              },
              datalabels: {
                color: "#333",
                clamp: true,
                font: {
                  weight: "bold",
                  size: 12,
                },
                formatter: (value, ctx) => {
                  const total = (ctx.dataset.data as number[]).reduce(
                    (acc, curr) => acc + curr,
                    0
                  );

                  const percentage = (value / total) * 100;
                  return value > 0 ? `${percentage.toFixed(1)}%` : "";
                },
              },
            },
          }}
        />
      </div>
    </Tabs>
  );
}

export { PieChartView };
