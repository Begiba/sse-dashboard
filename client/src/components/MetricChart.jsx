import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const metrics = [
  { key: "cpu", label: "CPU", color: "#8884d8" },
  { key: "memory", label: "Memory", color: "#82ca9d" },
  { key: "jobs", label: "Jobs", color: "#ffc658" },
];

export default function MetricChart({ data }) {
  const [selectedTab, setSelectedTab] = useState("all");

  // Force window resize event after tab change to make Recharts recalc dimensions
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);

    return () => clearTimeout(timeout);
  }, [selectedTab]);

  const renderLines = () => {
    if (selectedTab === "all") {
      return metrics.map(({ key, color }) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          stroke={color}
          dot={false}
          strokeWidth={2}
        />
      ));
    }
    const metric = metrics.find((m) => m.key === selectedTab);
    if (!metric) return null;
    return (
      <Line
        type="monotone"
        dataKey={metric.key}
        stroke={metric.color}
        dot={true}
        strokeWidth={3}
        activeDot={{ r: 8 }}
      />
    );
  };
useEffect(() => {
  if (data && data.length > 0) {
    console.log('Chart Data:', data); // For debugging
  }
}, [data]);
  return (
    <>
      <nav
        aria-label="Metrics Tabs"
        className="flex justify-center space-x-4 mb-6 flex-wrap"
      >
        <button
          onClick={() => setSelectedTab("all")}
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
            selectedTab === "all"
              ? "bg-blue-600 text-blue shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {metrics.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedTab(key)}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              selectedTab === key
                ? "bg-blue-600 text-blue shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {data && data.length > 0 ? (
        <div className="h-[300px] sm:h-[400px] min-h-[300px]">
          <ResponsiveContainer width="100%" aspect={3}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 12 }}                
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />              
              <Legend />
              {renderLines()}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-500">Waiting for data...</p>
      )}
    </>
  );
}
