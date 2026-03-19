import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await axios.get("http://localhost:8000/sessions/");

    const grouped: any = {};

    res.data.forEach((s: any) => {
      const date = new Date(s.date).toLocaleDateString();

      if (!grouped[date]) grouped[date] = 0;

      if (s.type === "focus") {
        grouped[date] += s.duration / 60;
      }
    });

    const chartData = Object.keys(grouped).map((date) => ({
      date,
      minutes: grouped[date],
    }));

    setData(chartData);
  };

  return (
    <div className="w-full h-[300px] bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3 text-center">
        📈 Daily Focus Graph
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="minutes" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;