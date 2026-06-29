import { Dumbbell, Calendar, Trophy, Zap } from 'lucide-react';
import { GymState } from '../types';

interface GymTrackerProps {
  gym: GymState;
  onUpdateGym: (newVal: number) => void;
  onBack: () => void;
}

export default function GymTracker({ gym, onUpdateGym, onBack }: GymTrackerProps) {
  const handleStartWorkout = () => {
    if (gym.completedThisWeek < gym.goalThisWeek) {
      onUpdateGym(gym.completedThisWeek + 1);
    }
  };

  const daysOfWeek = [
    { day: 'M', active: gym.workoutDays.includes('M') },
    { day: 'T', active: gym.workoutDays.includes('T') },
    { day: 'W', active: gym.workoutDays.includes('W') },
    { day: 'T', active: gym.workoutDays.includes('Th') },
    { day: 'F', active: gym.workoutDays.includes('F') },
    { day: 'S', active: gym.workoutDays.includes('S') },
    { day: 'S', active: gym.workoutDays.includes('Su') }
  ];

  return (
    <div id="gym-tracker-screen" className="flex flex-col min-h-screen bg-slate-50/50 px-5 pt-8 pb-28">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          id="btn-gym-back"
          onClick={onBack}
          className="p-2 bg-white hover:bg-slate-50 rounded-full border border-gray-100 shadow-sm transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-bold text-gray-800 font-sans">Gym</h3>
      </div>

      {/* Prominent Green Workout Card (Screen 8) */}
      <div className="bg-emerald-850 text-white rounded-3xl p-5 mb-6 relative overflow-hidden shadow-md shadow-emerald-950/10">
        <div className="absolute right-0 bottom-0 top-0 w-2/5 bg-emerald-800/20 rounded-l-full blur-xl pointer-events-none"></div>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">This Week</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-4xl font-extrabold tracking-tight">{gym.completedThisWeek}</span>
              <span className="text-emerald-300 text-xl font-bold">/ {gym.goalThisWeek}</span>
            </div>
            <p className="text-emerald-100 text-xs font-medium pt-2">Workouts Completed</p>
          </div>

          {/* Biceps muscular arm icon vector */}
          <div className="relative w-20 h-20 bg-emerald-800/40 rounded-2xl flex items-center justify-center border border-emerald-700/50">
            <svg className="w-12 h-12 text-emerald-300 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 6c0-1.1-.9-2-2-2-2.12 0-3.89 1.44-4.31 3.4L7 9.5M14 6c0 1.1-.9 2-2 2h-1M14 6h3M12 8l-3.3 5.5M16 11c1.33 0 4 .67 4 2v2H8v-2c0-1.33 2.67-2 4-2M12 15h4M12 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 20c2 0 4-1 4-3m-6 3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Workout Days list */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">Workout Days</h4>
        <div className="flex items-center justify-between">
          {daysOfWeek.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  item.active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-50 text-gray-400'
                }`}
              >
                {item.day}
              </div>
              {item.active && (
                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 animate-bounce" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Workout detail box */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Nest Workout</span>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{gym.nextWorkout}</p>
              <p className="text-[11px] text-gray-400 font-semibold">{gym.description}</p>
            </div>
          </div>
          <Dumbbell className="w-6 h-6 text-emerald-600 fill-emerald-50" />
        </div>
      </div>

      {/* Start Workout button */}
      <button
        id="btn-start-workout-action"
        onClick={handleStartWorkout}
        disabled={gym.completedThisWeek >= gym.goalThisWeek}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-md shadow-emerald-100 hover:shadow-emerald-200 transition-all active:scale-98 text-center disabled:opacity-50 text-sm cursor-pointer mb-6"
      >
        {gym.completedThisWeek >= gym.goalThisWeek ? 'Weekly Goal Completed!' : 'Start Workout'}
      </button>

      {/* Discipline quotes card */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="w-5 h-5 text-amber-500 fill-amber-50 shrink-0" />
          <span className="text-xs font-bold text-emerald-800">Discipline today, strength tomorrow.</span>
        </div>
        <span className="text-xs">🏆</span>
      </div>
    </div>
  );
}
