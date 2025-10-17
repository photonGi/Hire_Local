import React from "react";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  isDark?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  color = "#3B82F6",
  isDark = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 text-sm text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
        >
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid
            stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            vertical={false}
          />

          {/* X Axis */}
          <XAxis
            dataKey="label"
            angle={data.length > 10 ? -30 : 0}
            textAnchor={data.length > 10 ? "end" : "middle"}
            interval={data.length > 15 ? 2 : 0}
            tick={{
              fill: isDark ? "#A1A1AA" : "#4B5563",
              fontSize: 12,
            }}
            height={50}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fill: isDark ? "#A1A1AA" : "#4B5563", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1E293B" : "#F8FAFC",
              border: "none",
              borderRadius: "8px",
              color: isDark ? "#E2E8F0" : "#334155",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`${value} calls`, "API Calls"]}
          />

          {/* Area Fill */}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorArea)"
            strokeWidth={3}
            dot={{
              r: 4,
              strokeWidth: 2,
              stroke: color,
              fill: "#fff",
            }}
            activeDot={{
              r: 6,
              strokeWidth: 0,
              fill: color,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
