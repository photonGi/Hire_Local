import React, { useEffect, useState } from "react";
import { themeClass } from "../theme-config";

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  isDark?: boolean;
  filter?: "7d" | "30d" | "range";
  dateRange?: { from: string; to: string };
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  isDark = true,
  filter = "7d",
  dateRange,
}) => {
  const [animatedData, setAnimatedData] = useState(data);
  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedData(data), 150);
    return () => clearTimeout(timeout);
  }, [data, filter, dateRange]);

  const total = data.reduce((s, d) => s + d.value, 0);
  const topCategory =
    data.reduce(
      (p, c) => (c.value > p.value ? c : p),
      data[0] || { label: "N/A", value: 0 }
    )?.label || "N/A";

  const getLabelText = () => {
    if (filter === "7d") return "Past 7 Days";
    if (filter === "30d") return "Past Month";
    if (filter === "range" && dateRange?.from && dateRange?.to)
      return `${dateRange.from} → ${dateRange.to}`;
    return "";
  };

  let currentAngle = 0;

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      {/* Donut */}
      <div className="relative aspect-square w-60 flex items-center justify-center">
        <svg
          className="absolute w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke={
              isDark ? "rgba(255,255,255,0.1)" : "rgba(148,163,184,0.3)"
            }
            strokeWidth="16"
          />
          {animatedData.map((item, i) => {
            const pct = total > 0 ? (item.value / total) * 100 : 0;
            const dash = `${pct * 4.4} 440`;
            const offset = -currentAngle * 4.4;
            currentAngle += pct;
            return (
              <circle
                key={i}
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke={item.color}
                strokeWidth="16" // same width for all
                strokeDasharray={dash}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out hover:opacity-80"
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center text-center">
          <span
            className={`text-base font-semibold ${themeClass(
              isDark,
              "text-white",
              "text-slate-800"
            )}`}
          >
            {topCategory}
          </span>
          <span
            className={`text-xs ${themeClass(
              isDark,
              "text-gray-400",
              "text-slate-600"
            )}`}
          >
            Most Popular
          </span>
          {getLabelText() && (
            <span
              className={`text-[10px] mt-1 ${themeClass(
                isDark,
                "text-gray-500",
                "text-slate-500"
              )}`}
            >
              {getLabelText()}
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="w-full grid grid-cols-3 gap-y-2 justify-items-center mt-0">
        {animatedData.map((item, i) => (
          <div key={i} className="flex items-center space-x-1 text-xs truncate">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span
              className={themeClass(isDark, "text-gray-300", "text-slate-700")}
            >
              {item.label} (
              {total > 0 ? Math.round((item.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
