import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { LineChartData } from "../../viewmodels/dashboard/usePrayerReportViewModel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChartView({ lineChartData }: { lineChartData: LineChartData }) {
  return (
    <Line
      data={{
        labels: ["Tidak Terlaksana", "Terlambat", "Tepat Waktu"],
        datasets: [
          {
            label: "Subuh",
            data: lineChartData.get("subuh")!,
            borderColor: "#82A3D8",
            backgroundColor: "#82A3D8",
            fill: false,
          },
          {
            label: "Zuhur",
            data: lineChartData.get("zuhur")!,
            borderColor: "#F7EA78",
            backgroundColor: "#F7EA78",
            fill: false,
          },
          {
            label: "Asar",
            data: lineChartData.get("asar")!,
            borderColor: "#F1B25B",
            backgroundColor: "#F1B25B",
            fill: false,
          },
          {
            label: "Magrib",
            data: lineChartData.get("magrib")!,
            borderColor: "#BF7155",
            backgroundColor: "#BF7155",
            fill: false,
          },
          {
            label: "Isya",
            data: lineChartData.get("isya")!,
            borderColor: "#7866AE",
            backgroundColor: "#7866AE",
            fill: false,
          },
        ],
      }}
      options={{
        responsive: true,
        aspectRatio: 1,
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 35,
            ticks: {
              autoSkip: false,
              stepSize: 5,
            },
          },
        },
      }}
    />
  );
}

export { LineChartView };
