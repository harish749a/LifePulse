import { Bell, GlassWater, Plus, Minus, Info } from 'lucide-react';
import { WaterProgress } from '../types';

interface WaterTrackerProps {
  water: WaterProgress;
  onUpdateWater: (newValue: number) => void;
  onBack: () => void;
}

export default function WaterTracker({ water, onUpdateWater, onBack }: WaterTrackerProps) {
  const increment = () => {
    onUpdateWater(water.current + 1);
  };

  const decrement = () => {
    if (water.current > 0) {
      onUpdateWater(water.current - 1);
    }
  };

  const percentage = Math.min(100, Math.round((water.current / water.goal) * 100));

  // Today's date nicely formatted
  const formattedDate = 'Today, 29 June';

  return (
    <div id="water-tracker-screen" className="flex flex-col min-h-screen bg-slate-50/50 px-5 pt-8 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          id="btn-water-back"
          onClick={onBack}
          className="p-2 bg-white hover:bg-slate-50 rounded-full border border-gray-100 shadow-sm transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-bold text-gray-800 font-sans">Water Tracker</h3>
        <button
          id="btn-water-alarm"
          className="p-2 bg-white hover:bg-slate-50 rounded-full border border-gray-100 shadow-sm transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Main Hydration Progress Circle (Screen 6) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center mb-6 text-center">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{formattedDate}</span>
        
        {/* Animated fluid circle representation */}
        <div className="relative w-36 h-36 flex items-center justify-center my-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-sky-400 transition-all duration-500 ease-out"
              strokeDasharray={`${percentage}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <GlassWater className="w-8 h-8 text-sky-500 fill-sky-100 animate-bounce mb-1" />
            <span className="text-3xl font-extrabold text-gray-800 tracking-tight">{water.current}</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">of {water.goal} Glasses</span>
          </div>
        </div>

        <p className="text-sm font-bold text-emerald-600 mt-2">
          {percentage >= 100 ? 'Fully Hydrated! Keep it up!' : 'Great! Keep drinking'}
        </p>
      </div>

      {/* Increment / Decrement Controls */}
      <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm mb-6">
        <button
          id="btn-water-minus"
          onClick={decrement}
          disabled={water.current === 0}
          className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-gray-500 font-bold active:scale-90 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-gray-800">Add 1 Glass</span>
        <button
          id="btn-water-plus"
          onClick={increment}
          className="w-10 h-10 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold active:scale-90 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* History section (Glasses grid) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Today's Log</span>
          <span className="text-xs font-bold text-sky-600">{water.current} / {water.goal}</span>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: water.goal }).map((_, index) => {
            const isFilled = index < water.current;
            return (
              <div
                key={index}
                className={`aspect-[3/4] rounded-lg flex items-center justify-center transition-all ${
                  isFilled ? 'bg-sky-500 text-white' : 'bg-slate-50 border border-gray-200 text-gray-300'
                }`}
              >
                <GlassWater className={`w-5 h-5 ${isFilled ? 'fill-sky-200' : ''}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Tip section */}
      <div className="bg-sky-50 border border-sky-100 rounded-3xl p-5 flex items-start space-x-4">
        <div className="p-2.5 bg-white rounded-2xl text-sky-500 shadow-sm shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-sky-900 mb-1">Health Tip</h5>
          <p className="text-[11px] text-sky-700 leading-relaxed font-medium">
            Drinking water in the morning boosts your metabolism and maintains skin moisture.
          </p>
        </div>
      </div>
    </div>
  );
}
