import React from 'react';
import { themeClass } from '../theme-config';

interface HeatMapProps {
  data: { x: number; y: number; value: number; location: string }[];
  isDark?: boolean;
}

const HeatMap: React.FC<HeatMapProps> = ({ data, isDark = true }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64 text-slate-400 text-sm">
        No geographic data available
      </div>
    );
  }

  // 🔹 Compute range for color intensity scaling
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const getColorIntensity = (value: number) => {
  const ratio = (value - minValue) / (maxValue - minValue || 1);
  const lightness = 80 - ratio * 40; // slightly darker base for visibility
  const saturation = 90;
  return `hsl(217, ${saturation}%, ${lightness}%)`;
};

const getPointStyle = (value: number) => {
  const ratio = (value - minValue) / (maxValue - minValue || 1);
  const size = 18 + ratio * 28;
  const opacity = 0.65 + ratio * 0.35; // more visible for low values
  return { size, opacity, color: getColorIntensity(value) };
};



  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className={`relative w-full h-full rounded-lg overflow-hidden ${
          themeClass(
            isDark,
            'bg-gradient-to-br from-slate-800 to-slate-900',
            'bg-gradient-to-br from-slate-200 to-slate-300'
          )
        }`}
      >
        {/* === Base grid (background map) === */}
        <div className="absolute inset-0 opacity-25">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <rect
              x="50"
              y="50"
              width="300"
              height="100"
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(71,85,105,0.3)'}
              strokeWidth="2"
              rx="10"
            />
            <g stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(71,85,105,0.2)'} strokeWidth="1">
              {[100, 150, 200, 250, 300].map((x) => (
                <line key={x} x1={x} y1={50} x2={x} y2={150} />
              ))}
              {[80, 110, 140].map((y) => (
                <line key={y} x1={50} y1={y} x2={350} y2={y} />
              ))}
            </g>
          </svg>
        </div>

        {/* === Heat Points === */}
        <div className="absolute inset-0">
          {data.map((point, index) => {
            const { size, opacity, color } = getPointStyle(point.value);
            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  opacity,
                  boxShadow: `0 0 ${size * 1.2}px ${color}, 0 0 4px rgba(255,255,255,0.2)`,
                  border: `1px solid rgba(255,255,255,0.1)`,
                  zIndex: 20,
                }}
                title={`${point.location}: ${point.value.toLocaleString()} searches`}
              />
            );
          })}
        </div>

        {/* === Legend === */}
        <div className={`absolute bottom-4 right-4 ${isDark ? 'text-white' : 'text-slate-700'}`}>
          <div
            className={`${
              isDark
                ? 'bg-black/50 text-white'
                : 'bg-white/90 text-slate-800 border border-slate-200'
            } backdrop-blur-sm rounded-lg p-3 shadow-sm`}
          >
            <div className="text-xs font-semibold mb-1">Search Volume</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs opacity-70">Low</span>
              <div className="w-16 h-2 bg-gradient-to-r from-blue-200 to-blue-700 rounded"></div>
              <span className="text-xs opacity-70">High</span>
            </div>
          </div>
        </div>

        {/* === Top Regions Box === */}
        <div className={`absolute top-4 right-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <div
            className={`${
              isDark
                ? 'bg-black/50 text-white'
                : 'bg-white/90 text-slate-800 border border-slate-200'
            } backdrop-blur-sm rounded-lg p-3 shadow-sm`}
          >
            <div className="text-xs font-semibold mb-2">Top Regions</div>
            {data
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map((point, index) => (
                <div key={index} className="text-xs opacity-80 mb-1">
                  {point.location}: {point.value.toLocaleString()} searches
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
