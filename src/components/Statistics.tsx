import { useState } from 'react';
import { TrendingUp, Flame, Award, Calendar, HelpCircle } from 'lucide-react';

interface StatisticsProps {
  onBack: () => void;
}

type PeriodFilter = 'week' | 'month' | 'year';

export default function Statistics({ onBack }: StatisticsProps) {
  const [activePeriod, setActivePeriod] = useState<PeriodFilter>('week');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Line chart coordinates for Life Score
  // Points: Mon: 60, Tue: 70, Wed: 65, Thu: 80, Fri: 75, Sat: 82, Sun: 85 (matches Screen 10)
  const linePoints = [
    { day: 'Mon', score: 60, x: 20, y: 110 },
    { day: 'Tue', score: 70, x: 70, y: 80 },
    { day: 'Wed', score: 65, x: 120, y: 95 },
    { day: 'Thu', score: 80, x: 170, y: 50 },
    { day: 'Fri', score: 75, x: 220, y: 65 },
    { day: 'Sat', score: 82, x: 270, y: 44 },
    { day: 'Sun', score: 85, x: 320, y: 35 }
  ];

  // SVG Line path builder
  const linePath = linePoints.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  // Bar chart completions for Mon-Sun (percentages)
  const barCompletions = [
    { day: 'Mon', percentage: 70 },
    { day: 'Tue', percentage: 65 },
    { day: 'Wed', percentage: 80 },
    { day: 'Thu', percentage: 75 },
    { day: 'Fri', percentage: 90 },
    { day: 'Sat', percentage: 85 },
    { day: 'Sun', percentage: 95 }
  ];

  return (
    <div id="statistics-screen" className="flex flex-col min-h-screen bg-slate-50/50 px-5 pt-8 pb-28">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-900 font-sans">Statistics</h2>
        <button
          onClick={onBack}
          className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
        >
          Reset View
        </button>
      </div>

      {/* Period filters (Pill Row - Screen 10) */}
      <div className="flex bg-white border border-gray-100 p-1 rounded-2xl mb-6 shadow-sm">
        {(['week', 'month', 'year'] as PeriodFilter[]).map((period) => (
          <button
            id={`period-btn-${period}`}
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              activePeriod === period
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Life Score line chart (Screen 10) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Life Score Trend</span>
            <span className="text-lg font-bold text-gray-800">82 <span className="text-xs font-semibold text-gray-400">Avg Score</span></span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>

        {/* Interactive SVG Chart wrapper */}
        <div className="relative w-full h-36">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 340 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grid helper lines */}
            <line x1="20" y1="35" x2="320" y2="35" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="20" y1="80" x2="320" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="20" y1="110" x2="320" y2="110" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

            {/* Glowing bottom gradient under the trend line */}
            <path
              d={`${linePath} L 320 135 L 20 135 Z`}
              fill="url(#gradient-line-bg)"
              opacity="0.15"
            />

            {/* Main Trend Line */}
            <path
              d={linePath}
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Coordinate dots */}
            {linePoints.map((point, idx) => (
              <g key={idx}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint === idx ? "7" : "5"}
                  fill="#FFFFFF"
                  stroke="#10B981"
                  strokeWidth="3"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {hoveredPoint === idx && (
                  <g>
                    {/* Tooltip background rectangle */}
                    <rect x={point.x - 18} y={point.y - 30} width="36" height="20" rx="6" fill="#1E2937" />
                    <text x={point.x} y={point.y - 17} fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {point.score}
                    </text>
                  </g>
                )}
              </g>
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient-line-bg" x1="170" y1="35" x2="170" y2="135" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between items-center px-1.5 mt-2">
          {linePoints.map((point, idx) => (
            <span key={idx} className="text-[10px] font-bold text-gray-400 font-mono w-10 text-center">
              {point.day}
            </span>
          ))}
        </div>
      </div>

      {/* Habit Completion rate (Bar chart - Screen 10) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Habit Completion</span>
            <span className="text-lg font-bold text-gray-800">85% <span className="text-xs font-semibold text-emerald-600">Average this week</span></span>
          </div>
          <Award className="w-5 h-5 text-emerald-600" />
        </div>

        {/* Bar chart graphics row */}
        <div className="flex items-end justify-between px-2 h-24 mb-2">
          {barCompletions.map((bar, idx) => {
            const barHeight = `${bar.percentage}%`;
            return (
              <div key={idx} className="flex flex-col items-center space-y-2 flex-1">
                <div className="w-full max-w-[14px] bg-slate-50 h-20 rounded-full flex items-end overflow-hidden relative">
                  <div
                    className="w-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ height: barHeight }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 font-mono">
                  {bar.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats summary cards (Screen 10) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Best Streak Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4.5 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Best Streak</span>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 fill-amber-100" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-800 tracking-tight">12 <span className="text-xs font-semibold text-gray-400">days</span></p>
            <p className="text-[10px] text-gray-400 font-semibold pt-1 uppercase">All-time high</p>
          </div>
        </div>

        {/* Total Habits Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4.5 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Habits</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-800 tracking-tight">8 <span className="text-xs font-semibold text-gray-400">active</span></p>
            <p className="text-[10px] text-gray-400 font-semibold pt-1 uppercase">2 completed today</p>
          </div>
        </div>
      </div>
    </div>
  );
}
