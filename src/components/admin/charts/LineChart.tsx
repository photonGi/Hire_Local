import React from 'react';

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  isDark?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  color = '#3B82F6',
  height = 220,
  isDark = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 text-sm text-gray-400">
        No data available
      </div>
    );
  }

  // --- Config ---
  const width = 370;
  const padding = { top: 25, right: 10, bottom: 25, left: 10 }; // more top padding for labels

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // --- Scaling ---
  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const yRange = maxVal === minVal ? 1 : maxVal - minVal;

  const stepX = chartWidth / Math.max(1, data.length - 1);
  const scaleY = (v: number) =>
    padding.top + (chartHeight - ((v - minVal) / yRange) * chartHeight);

  // --- Points ---
  const points = data
    .map((d, i) => `${padding.left + i * stepX},${scaleY(d.value).toFixed(1)}`)
    .join(' ');

  const textColor = isDark ? '#A1A1AA' : '#4B5563';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(100,116,139,0.2)';

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full rounded-lg select-none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="chartLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* === Grid Lines === */}
        <g stroke={gridColor} strokeWidth="1">
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const y = padding.top + chartHeight * p;
            return <line key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y} />;
          })}
        </g>

        {/* === Data Line === */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* === Data Points + Labels === */}
        {data.map((d, i) => {
          const cx = padding.left + i * stepX;
          const cy = scaleY(d.value);

          // Adjust label Y position if too high
          const labelY = cy < padding.top + 10 ? cy + 15 : cy - 10;

          return (
            <g key={i}>
              {/* Point */}
              <circle
                cx={cx}
                cy={cy}
                r="4"
                fill={color}
                style={{
                  transformOrigin: 'center',
                  transition: 'r 0.15s ease-out, opacity 0.15s ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.setAttribute('r', '6');
                  e.currentTarget.setAttribute('opacity', '0.85');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.setAttribute('r', '4');
                  e.currentTarget.setAttribute('opacity', '1');
                }}
              />

              {/* Value Label */}
              <text
                x={cx}
                y={labelY}
                textAnchor="middle"
                fontSize="8"
                fill={textColor}
                style={{ pointerEvents: 'none' }}
              >
                {d.value}
              </text>

              {/* Date Label (X-axis) */}
              <text
                x={cx}
                y={height - 5}
                textAnchor="middle"
                fontSize="8"
                fill={textColor}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default LineChart;
