import { Sun, Coffee, Cookie, Moon, Heart } from 'lucide-react';
import { MealRemindersState } from '../types';

interface MealRemindersProps {
  meals: MealRemindersState;
  onToggleMeal: (meal: keyof Omit<MealRemindersState, 'times'>) => void;
  onBack: () => void;
}

export default function MealReminders({ meals, onToggleMeal, onBack }: MealRemindersProps) {
  const mealItems = [
    {
      key: 'breakfast' as const,
      name: 'Breakfast',
      time: meals.times.breakfast,
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50'
    },
    {
      key: 'lunch' as const,
      name: 'Lunch',
      time: meals.times.lunch,
      icon: <Coffee className="w-5 h-5 text-sky-500" />,
      bg: 'bg-sky-50'
    },
    {
      key: 'snack' as const,
      name: 'Evening Snack',
      time: meals.times.snack,
      icon: <Cookie className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50'
    },
    {
      key: 'dinner' as const,
      name: 'Dinner',
      time: meals.times.dinner,
      icon: <Moon className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <div id="meal-reminders-screen" className="flex flex-col min-h-screen bg-slate-50/50 px-5 pt-8 pb-28">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <button
          id="btn-meals-back"
          onClick={onBack}
          className="p-2 bg-white hover:bg-slate-50 rounded-full border border-gray-100 shadow-sm transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-bold text-gray-800 font-sans">Meal Reminders</h3>
      </div>

      {/* Main Meal Reminder List */}
      <div className="space-y-4 mb-8">
        {mealItems.map((meal) => {
          const completed = meals[meal.key];
          return (
            <div
              id={`meal-row-${meal.key}`}
              key={meal.key}
              onClick={() => onToggleMeal(meal.key)}
              className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-3xl shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-11 h-11 ${meal.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105`}>
                  {meal.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{meal.name}</h4>
                  <p className="text-[11px] text-gray-400 font-semibold">{meal.time}</p>
                </div>
              </div>

              {/* Toggle switch or circular checkmark matching mockup */}
              <button
                id={`btn-toggle-meal-${meal.key}`}
                className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-gray-300 hover:border-emerald-500 text-transparent'
                }`}
              >
                {/* Checkmark SVG */}
                <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Advice card */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex items-start space-x-4">
        <div className="p-3 bg-white rounded-2xl text-rose-500 shadow-sm shrink-0">
          <Heart className="w-6 h-6 fill-rose-50" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-emerald-900 mb-1">Eat on time, stay healthy!</h5>
          <p className="text-[11px] text-emerald-700 leading-relaxed font-semibold">
            Your body loves a routine. Eating at standard times stabilizes insulin, boosts cognitive sharpness, and improves sleep quality.
          </p>
        </div>
      </div>
    </div>
  );
}
