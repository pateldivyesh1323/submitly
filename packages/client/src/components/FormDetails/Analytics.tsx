import { useQuery } from "@tanstack/react-query";
import { FORM_ANALYTICS } from "../../lib/constants";
import { getFormAnalytics } from "../../queries/formAnalytics";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { AnalyticsChartDataType } from "../../types/Form";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

export default function Analytics() {
  const { id } = useParams();

  const [chartData, setChartData] = useState<AnalyticsChartDataType[]>([]);
  const [formAnalyticsData, setFormAnalyticsData] = useState({
    totalSubmissionCount: 0,
    timeSubmissionCount: 0,
    pastMonthAverage: 0,
    pastYearAverage: 0,
  });

  const { data: formAnalytics, isLoading } = useQuery({
    queryKey: [FORM_ANALYTICS],
    queryFn: () => getFormAnalytics(id as string),
  });

  useEffect(() => {
    if (formAnalytics) {
      setFormAnalyticsData(formAnalytics.data);
      setChartData(formAnalytics.data.perTimeCount);
    }
  }, [formAnalytics]);

  const calcChartData = {
    labels: chartData.map((data) => data._id),
    datasets: [
      {
        label: "Submissions by time",
        data: chartData.map((data) => data.submissionCount),
        backgroundColor: "#0090ff",
        borderColor: "#0090ff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    color: "white",
    plugins: {
      title: {
        display: true,
        text: "Yearly Acquisitions",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timeline",
          color: "white",
        },
        grid: {
          color: "#a8a8a8",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Submissions",
          color: "white",
        },
        grid: {
          color: "#a8a8a8",
        },
        ticks: {
          color: "white",
        },
        min: 0,
      },
    },
    showLines: true,
  };

  return isLoading ? (
    <div className="flex justify-center w-full">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <div>
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col items-center bg-neutral-800 p-4 rounded-md">
          <div className="text-5xl font-semibold">
            {formAnalyticsData.totalSubmissionCount}
          </div>
          <div className="text-neutral-300 text-sm">Total submissions</div>
        </div>
        <div className="flex flex-col items-center bg-neutral-800 p-4 rounded-md">
          <div className="text-5xl font-semibold">
            {formAnalyticsData.timeSubmissionCount}
          </div>
          <div className="text-neutral-300 text-sm">Past 30 days</div>
        </div>
        <div className="flex flex-col items-center bg-neutral-800 p-4 rounded-md">
          <div className="text-5xl font-semibold">
            {formAnalyticsData.pastMonthAverage.toPrecision(1)}
          </div>
          <div className="text-neutral-300 text-sm">Past 30 days average</div>
        </div>
        <div className="flex flex-col items-center bg-neutral-800 p-4 rounded-md">
          <div className="text-5xl font-semibold">
            {formAnalyticsData.pastYearAverage.toPrecision(1)}
          </div>
          <div className="text-neutral-300 text-sm">Past 365 days average</div>
        </div>
      </div>
      <div className="flex justify-center mx-auto border border-neutral-700 text-black lg:p-8 rounded-sm max-h-[600px]">
        <Line data={calcChartData} options={options} />
      </div>
    </div>
  );
}
