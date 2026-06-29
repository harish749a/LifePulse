import { useState } from 'react';
import { Plus, Check, Search, Droplet, Dumbbell, BookOpen, Sparkles, Footprints, Languages } from 'lucide-react';
import { Habit, WaterProgress } from '../types';

interface HabitsListProps {
  habits: Habit[];
  water: WaterProgress;
  onNavigate: (screen: any) => void;
  onToggleHabit: (id: string) => void;
  onAddClick: () => void;
}

type TimeFilter = 'all' | 'morning' | 'afternoon' | 'evening';

export default function HabitsList({
  habits,
  water,
  onNavigate,
  onToggleHabit,
  onAddClick
}: HabitsListProps) {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map category to styles & icons
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'health':
        return {
          bg: 'bg-sky-50',
          text: 'text-sky-500',
          icon: <Droplet className="w-5 h-5" />
        };
      case 'fitness':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-600',
          icon: <Dumbbell className="w-5 h-5" />
        };
      case 'learning':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-500',
          icon: <BookOpen className="w-5 h-5" />
        };
      case 'mind':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-500',
          icon: <Sparkles className="w-5 h-5" />
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-500',
          icon: <Footprints className="w-5 h-5" />
        };
    }
  };

  // Helper to parse time string (e.g. "07:00 AM") and categorize
  const getTimeCategory = (timeStr: string): TimeFilter => {
    if (!timeStr) return 'all';
    const isPM = timeStr.toUpperCase().includes('PM');
    const [hourStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    
    if (isPM) {
      const pmHour = hour === 12 ? 12 : hour + 12;
      if (pmHour >= 17) return 'evening';
      return 'afternoon';
    } else {
      const amHour = hour === 12 ? 0 : hour;
      if (amHour < 12) return 'morning';
      return 'afternoon';
    }
  };

  const isHabitCompletedToday = (habit: Habit) => {
    if (habit.id === '1') {
      return water.current >= water.goal;
    }
    const todayStr = '2026-06-29';
    return habit.completedDates.includes(todayStr);
  };

  // Filter and search logic
  const filteredHabits = habits.filter((habit) => {
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (habit.note || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    return getTimeCategory(habit.time) === activeFilter && matchesSearch;
  });

  return (
    <div id="habits-list-screen" className="flex flex-col min-h-screen bg-slate-50/50 px-5 pt-8 pb-28">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 font-sans">Habits</h2>
        <button
          id="btn-add-habit-top"
          onClick={onAddClick}
          className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Elegant Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />
        <input
          id="input-habits-search"
          type="text"
          placeholder="Search your habits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
        />
      </div>

      {/* Time filters (Pill Row - Screen 4) */}
      <div className="flex items-center space-x-2.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'morning', 'afternoon', 'evening'] as TimeFilter[]).map((filter) => (
          <button
            id={`filter-btn-${filter}`}
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === filter
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Habits List Group */}
      {filteredHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-3xl border border-gray-50 p-6 shadow-sm">
          <p className="text-gray-400 text-sm font-medium mb-3">No habits found</p>
          <button
            onClick={onAddClick}
            className="text-xs text-emerald-600 font-bold hover:underline"
          >
            Create your first habit!
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredHabits.map((habit) => {
            const completed = isHabitCompletedToday(habit);
            const { bg, text, icon } = getCategoryDetails(habit.category);
            
            return (
              <div
                id={`habit-row-${habit.id}`}
                key={habit.id}
                className="flex items-center justify-between bg-white border border-gray-50/50 p-4.5 rounded-3xl shadow-sm hover:border-emerald-500 transition-all"
              >
                {/* Left details group - Clicking takes to detail screens */}
                <div
                  onClick={() => {
                    if (habit.id === '1') onNavigate('water');
                    else if (habit.id === '2') onNavigate('gym');
                    else if (habit.name.toLowerCase().includes('lunch') || habit.name.toLowerCase().includes('meal') || habit.name.toLowerCase().includes('breakfast')) {
                      onNavigate('meals');
                    }
                  }}
                  className="flex items-center space-x-4 cursor-pointer flex-1"
                >
                  <div className={`w-11 h-11 ${bg} ${text} rounded-2xl flex items-center justify-center transition-transform hover:scale-105`}>
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{habit.name}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {habit.note || 'Everyday'}
                    </p>
                  </div>
                </div>

                {/* Right checkbox action */}
                <div className="flex items-center space-x-3.5">
                  {habit.id === '1' && (
                    <span className="text-xs font-semibold text-sky-600 mr-1">
                      {water.current} / {water.goal}
                    </span>
                  )}
                  
                  <button
                    id={`btn-toggle-habit-${habit.id}`}
                    onClick={() => onToggleHabit(habit.id)}
                    className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                      completed
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-100'
                        : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/20 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
