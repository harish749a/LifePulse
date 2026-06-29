import { ChevronLeft, ChevronRight, Droplet, Dumbbell, Clock, Moon, ClipboardCheck, Sparkles } from 'lucide-react';
import { DailyScoreBreakdown } from '../types';

interface DailyScoreProps {
  score: number;
  breakdown: DailyScoreBreakdown;
  onBack: () => void;
}

export default function DailyScore({ score, breakdown, onBack }: DailyScoreProps) {
  // SVG Calculations for the semi-circular gauge dial
  // Radius = 50, Center = (60, 60), Circumference of semi-circle = Math.PI * r = 157
  const r = 50;
  const strokeDasharray = `${(score / 100) * 157} 157`;

  // Angle for the needle pointing (0 to 180 degrees)
  const needleAngle = (score / 100) * 180 - 90; // offset for starting at left

  const breakdownItems = [
    {
      name: 'Habits Completed',
      value: breakdown.habitsCompleted,
      max: 70,
      icon: <ClipboardCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50'
    },
    {
      name: 'Water Intake',
      value: breakdown.waterIntake,
      max: 10,
      icon: <Droplet className="w-5 h-5 text-sky-500 fill-sky-50" />,
      bg: 'bg-sky-50'
    },
    {
      name: 'Meals on Time',
      value: breakdown.mealsOnTime,
      max: 10,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50'
    },
    {
      name: 'Workout',
      value: breakdown.workout,
      max: 10,
      icon: <Dumbbell className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50'
    },
    {
      name: 'Sleep',
      value: breakdown.sleep,
      max: 10,
      icon: <Moon className="w-5 h-5 text-indigo-500 fill-indigo-50" />,
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <div id="daily-score-screen" className="flex flex-col min-h-screen bg-slate-50/50 px-5 pt-8 pb-28">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          id="btn-score-back"
          onClick={onBack}
          className="p-2 bg-white hover:bg-slate-50 rounded-full border border-gray-100 shadow-sm transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-bold text-gray-800 font-sans">Daily Score</h3>
      </div>

      {/* Date Switcher */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-100 rounded-2xl shadow-sm mb-6">
        <button className="p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <span className="text-xs font-bold text-gray-700">29 June 2026</span>
        <button className="p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Semicircle Dial Gauge Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center mb-6">
        <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden mb-2">
          {/* Semicircle dial SVG */}
          <svg className="w-full h-full transform" viewBox="0 0 120 70">
            {/* Background Arch */}
            <path
              className="text-slate-100"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M10,60 a 50,50 0 0 1 100,0"
            />
            {/* Colored Progress Arch (with gradient colors) */}
            <path
              className="text-emerald-500 transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              stroke="currentColor"
              fill="none"
              d="M10,60 a 50,50 0 0 1 100,0"
            />
            {/* Gauge needle indicator */}
            <g transform={`translate(60, 60) rotate(${needleAngle})`}>
              <line x1="0" y1="0" x2="0" y2="-45" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="0" r="4.5" fill="#047857" />
            </g>
          </svg>

          {/* Centered text */}
          <div className="absolute bottom-0 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-gray-800 tracking-tight">{score}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">of 100</span>
          </div>
        </div>

        <p className="text-sm font-bold text-gray-800 text-center mb-1">Great job! You are consistent.</p>
        <span className="text-[10px] text-gray-400 font-semibold uppercase">Daily Score breakdown</span>
      </div>

      {/* Score Breakdown List (Screen 9) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 mb-6">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Score Breakdown</h4>
        <div className="space-y-3">
          {breakdownItems.map((item, index) => {
            const barWidth = `${Math.min(100, (item.value / item.max) * 100)}%`;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                  <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-gray-800 truncate">{item.name}</span>
                      <span className="text-xs font-semibold text-emerald-600">{item.value}/{item.max}</span>
                    </div>
                    {/* Visual miniature loading bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: barWidth }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom star/success tip */}
      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-50 shrink-0" />
          <span className="text-xs font-bold text-amber-850">Small steps every day lead to big changes.</span>
        </div>
        <span className="text-xs">⭐</span>
      </div>
    </div>
  );
}
