import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import MetricChart from "./components/MetricChart";

export default function App() {
  const [data, setData] = useState([]);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:4123/events");
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      const formatted = {
      ...parsedData,
      timestamp: new Date(parsedData.timestamp).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

      setData((prevData) => [...prevData.slice(-29), formatted]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="bg-gray-500 min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-6xl shadow-xl rounded-2xl">
        <CardContent className="p-6 md:p-10">
          <h2 className="text-2xl text-red-100 md:text-3xl font-bold mb-6 text-center">
            SSE Dashboard
          </h2>
          <MetricChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
