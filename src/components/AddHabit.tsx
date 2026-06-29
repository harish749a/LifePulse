import React, { useState } from 'react';
import { Droplet, Dumbbell, BookOpen, Sparkles, Footprints, Clock, Languages, HelpCircle } from 'lucide-react';
import { Habit, HabitCategory } from '../types';

interface AddHabitProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  onBack: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'Droplet', icon: <Droplet className="w-5 h-5" /> },
  { name: 'Dumbbell', icon: <Dumbbell className="w-5 h-5" /> },
  { name: 'BookOpen', icon: <BookOpen className="w-5 h-5" /> },
  { name: 'Sparkles', icon: <Sparkles className="w-5 h-5" /> },
  { name: 'Footprints', icon: <Footprints className="w-5 h-5" /> },
  { name: 'Languages', icon: <Languages className="w-5 h-5" /> }
];

export default function AddHabit({ onAddHabit, onBack }: AddHabitProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [repeat, setRepeat] = useState<string[]>(['M', 'T', 'W', 'T', 'F']);
  const [time, setTime] = useState('07:00 AM');
  const [note, setNote] = useState('');
  const [selectedIconName, setSelectedIconName] = useState('Dumbbell');
  const [showIconSelector, setShowIconSelector] = useState(false);

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const toggleDay = (day: string) => {
    if (repeat.includes(day)) {
      setRepeat(repeat.filter((d) => d !== day));
    } else {
      setRepeat([...repeat, day]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddHabit({
      name,
      category,
      repeat,
      time,
      note: note.trim() ? note : undefined,
      icon: selectedIconName
    });
  };

  const selectedIconObj = AVAILABLE_ICONS.find(i => i.name === selectedIconName) || { icon: <HelpCircle className="w-5 h-5" /> };

  return (
    <div id="add-habit-screen" className="flex flex-col min-h-screen bg-white p-6 justify-between">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          id="btn-add-habit-back"
          onClick={onBack}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-bold text-gray-900 font-sans">Add New Habit</h3>
      </div>

      <form onSubmit={handleSave} className="flex-1 space-y-5">
        {/* Icon Picker (Screen 5) */}
        <div className="flex flex-col items-center justify-center space-y-2 py-2">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner relative">
            {selectedIconObj.icon}
          </div>
          <button
            id="btn-change-icon"
            type="button"
            onClick={() => setShowIconSelector(!showIconSelector)}
            className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
          >
            Change Icon
          </button>

          {/* Collapsible Icon selector grid */}
          {showIconSelector && (
            <div className="grid grid-cols-6 gap-2 p-3 bg-slate-50 rounded-2xl border border-gray-100 mt-2">
              {AVAILABLE_ICONS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setSelectedIconName(item.name);
                    setShowIconSelector(false);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    selectedIconName === item.name
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Habit Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Habit Name</label>
          <input
            id="input-habit-name"
            type="text"
            required
            placeholder="e.g. Reading, Meditation"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-xs text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Category</label>
          <select
            id="select-habit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as HabitCategory)}
            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-xs text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all appearance-none"
          >
            <option value="health">Health</option>
            <option value="fitness">Fitness</option>
            <option value="mind">Mindfulness & Sleep</option>
            <option value="learning">Learning & Productivity</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Repeat Selection days */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600">Repeat</label>
          <div className="flex items-center justify-between">
            {daysOfWeek.map((day, idx) => {
              const isSelected = repeat.includes(day);
              return (
                <button
                  id={`btn-repeat-day-${idx}-${day}`}
                  key={idx}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-50 text-gray-400 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reminder Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Reminder Time</label>
          <div className="relative">
            <Clock className="absolute left-4 top-3.5 text-gray-300 w-4 h-4" />
            <input
              id="input-reminder-time"
              type="text"
              placeholder="e.g. 07:00 AM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-xs text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Reminder Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Reminder Note (Optional)</label>
          <input
            id="input-reminder-note"
            type="text"
            placeholder="e.g. Don't skip your habit!"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-xs text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
          />
        </div>

        {/* Save Habit Action Button */}
        <button
          id="btn-save-habit"
          type="submit"
          className="w-full py-4 mt-6 bg-emerald-600 text-white font-semibold rounded-2xl shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-98 text-center cursor-pointer text-sm"
        >
          Save Habit
        </button>
      </form>
    </div>
  );
}
