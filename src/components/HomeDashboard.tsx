import { Bell, ChevronRight, Droplet, Dumbbell, BookOpen, Sparkles, Footprints, Moon, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Habit, WaterProgress, MealRemindersState, GymState, UserProfile } from '../types';

interface HomeDashboardProps {
  userProfile: UserProfile;
  habits: Habit[];
  water: WaterProgress;
  meals: MealRemindersState;
  gym: GymState;
  lifeScore: number;
  onNavigate: (screen: any) => void;
  onToggleHabit: (id: string) => void;
}

export default function HomeDashboard({
  userProfile,
  habits,
  water,
  meals,
  gym,
  lifeScore,
  onNavigate,
  onToggleHabit
}: HomeDashboardProps) {

  // Map of category icons for quick lookup
  const getIcon = (category: string) => {
    switch (category) {
      case 'health': return <Droplet className="w-5 h-5 text-sky-500" />;
      case 'fitness': return <Dumbbell className="w-5 h-5 text-emerald-600" />;
      case 'learning': return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'mind': return <Sparkles className="w-5 h-5 text-amber-500" />;
      default: return <Footprints className="w-5 h-5 text-gray-500" />;
    }
  };

  // Helper to get habit details
  const getHabitProgressText = (habit: Habit) => {
    if (habit.id === '1') {
      return `${water.current} / ${water.goal} Glasses`;
    }
    const todayStr = '2026-06-29';
    const isCompleted = habit.completedDates.includes(todayStr);
    return isCompleted ? 'Completed' : 'Pending';
  };

  const isHabitCompletedToday = (habit: Habit) => {
    if (habit.id === '1') {
      return water.current >= water.goal;
    }
    const todayStr = '2026-06-29';
    return habit.completedDates.includes(todayStr);
  };

  return (
    <div id="home-dashboard" className="flex flex-col min-h-screen bg-slate-50/50 px-5 pt-8 pb-28">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('profile')}>
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm hover:border-emerald-500 transition-all"
          />
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Good Morning,</p>
            <h3 className="text-base font-bold text-gray-900 font-sans">{userProfile.name} 👋</h3>
          </div>
        </div>

        {/* Notification Bell */}
        <button
          id="btn-notification-bell"
          onClick={() => onNavigate('reminders')}
          className="p-2.5 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-slate-50 transition-colors cursor-pointer relative"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>
      </div>

      {/* Life Score Card (Screen 3) */}
      <div
        id="life-score-card"
        onClick={() => onNavigate('score')}
        className="bg-emerald-850 text-white rounded-3xl p-5 mb-6 relative overflow-hidden shadow-md shadow-emerald-950/20 cursor-pointer hover:bg-emerald-900 transition-all group"
      >
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-emerald-800/20 rounded-l-full blur-xl pointer-events-none group-hover:scale-110 transition-transform"></div>

        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Life Score</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold tracking-tight">{lifeScore}</span>
              <span className="text-emerald-300/80 text-sm">/100</span>
            </div>
            <p className="text-emerald-100 text-xs font-medium pt-2">Great job! Keep it up!</p>
          </div>

          {/* Radial progress ring */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-emerald-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${lifeScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              {/* Heart SVG centered in Life Score ring */}
              <svg className="w-6 h-6 text-emerald-400 fill-emerald-400 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress Section */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-gray-800">Today's Progress</h4>
        <button
          id="btn-view-all-habits"
          onClick={() => onNavigate('habits')}
          className="text-xs text-emerald-600 font-semibold hover:underline flex items-center space-x-0.5 cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Habit Items Grid */}
      <div className="space-y-3 mb-6">
        {/* Drink Water Item (Interactive) */}
        <div
          id="habit-item-water"
          onClick={() => onNavigate('water')}
          className="flex items-center justify-between bg-white border border-gray-50/50 p-4 rounded-2xl shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5 text-sky-500 fill-sky-200" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Drink Water</p>
              <p className="text-[11px] text-gray-400 font-medium">5 / 8 Glasses</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-sky-600">{water.current} / {water.goal}</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>

        {/* Breakfast Item (Interactive to Meal screen) */}
        <div
          id="habit-item-meals"
          onClick={() => onNavigate('meals')}
          className="flex items-center justify-between bg-white border border-gray-50/50 p-4 rounded-2xl shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 17a5 5 0 100-10 5 5 0 000 10z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Breakfast</p>
              <p className="text-[11px] text-gray-400 font-medium">Completed</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
          </div>
        </div>

        {/* Gym Item (Interactive to Gym detail) */}
        <div
          id="habit-item-gym"
          onClick={() => onNavigate('gym')}
          className="flex items-center justify-between bg-white border border-gray-50/50 p-4 rounded-2xl shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Gym</p>
              <p className="text-[11px] text-gray-400 font-medium">Pending</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Circle className="w-5 h-5 text-gray-300" />
          </div>
        </div>

        {/* Additional habit list items (Read Book / Sleep) */}
        {habits.slice(2, 4).map((habit) => {
          const completed = isHabitCompletedToday(habit);
          return (
            <div
              id={`habit-item-${habit.id}`}
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className="flex items-center justify-between bg-white border border-gray-50/50 p-4 rounded-2xl shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getIcon(habit.category)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{habit.name}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{getHabitProgressText(habit)}</p>
                </div>
              </div>
              <div>
                {completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 hover:text-emerald-500 transition-colors" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Reminder Box */}
      <h4 className="text-sm font-bold text-gray-800 mb-3">Next Reminder</h4>
      <div
        id="next-reminder-card"
        onClick={() => onNavigate('meals')}
        className="flex items-center justify-between bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm hover:border-emerald-400 transition-all cursor-pointer group"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Lunch</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Today, 1:00 PM</p>
          </div>
        </div>
        <Clock className="w-5 h-5 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
      </div>
    </div>
  );
}
