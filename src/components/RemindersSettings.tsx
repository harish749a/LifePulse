import { useState } from 'react';
import { Sun, Droplet, Coffee, Moon, Volume2, VolumeX, Eye, Bell, Clock } from 'lucide-react';
import { ReminderSetting } from '../types';

interface RemindersSettingsProps {
  reminders: ReminderSetting[];
  onToggleReminder: (id: string) => void;
  onBack: () => void;
}

export default function RemindersSettings({ reminders, onToggleReminder, onBack }: RemindersSettingsProps) {
  const [enableAll, setEnableAll] = useState(true);

  const handleToggleAll = () => {
    const nextVal = !enableAll;
    setEnableAll(nextVal);
    // Dynamically toggle all reminders in local scope for the prototype!
    reminders.forEach(r => {
      if (r.enabled !== nextVal) {
        onToggleReminder(r.id);
      }
    });
  };

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'wake up':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'drink water':
        return <Droplet className="w-5 h-5 text-sky-500 fill-sky-50" />;
      case 'breakfast':
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'lunch':
        return <Coffee className="w-5 h-5 text-emerald-600" />;
      case 'dinner':
        return <Moon className="w-5 h-5 text-indigo-500 fill-indigo-50" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div id="reminders-settings-screen" className="flex flex-col min-h-screen bg-slate-50/50 px-5 pt-8 pb-28">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          id="btn-reminders-back"
          onClick={onBack}
          className="p-2 bg-white hover:bg-slate-50 rounded-full border border-gray-100 shadow-sm transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-bold text-gray-800 font-sans">Reminders</h3>
      </div>

      {/* Enable All Master Row (Screen 11) */}
      <div className="flex items-center justify-between bg-white px-5 py-4.5 border border-gray-100 rounded-3xl shadow-sm mb-6">
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-gray-800">Enable All Reminders</span>
          <span className="text-[10px] text-gray-400 font-semibold block">Turn off to silent notifications</span>
        </div>

        {/* Master Switch */}
        <button
          id="btn-toggle-all-reminders"
          onClick={handleToggleAll}
          className={`w-12 h-6.5 rounded-full p-1 transition-all focus:outline-none flex items-center cursor-pointer ${
            enableAll ? 'bg-emerald-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`bg-white w-4.5 h-4.5 rounded-full shadow-sm transition-all transform ${
              enableAll ? 'translate-x-5.5' : 'translate-x-0'
            }`}
          ></div>
        </button>
      </div>

      {/* Daily Reminders List Title */}
      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3.5">Daily Reminders</h4>

      {/* Reminders List */}
      <div className="space-y-3.5">
        {reminders.map((reminder) => (
          <div
            id={`reminder-row-${reminder.id}`}
            key={reminder.id}
            className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-3xl shadow-sm hover:border-emerald-500 transition-all"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                {getIcon(reminder.name)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">{reminder.name}</h4>
                <p className="text-[11px] text-gray-400 font-semibold">{reminder.time}</p>
              </div>
            </div>

            {/* Switch Toggle */}
            <button
              id={`btn-toggle-reminder-${reminder.id}`}
              onClick={() => onToggleReminder(reminder.id)}
              className={`w-11 h-6 rounded-full p-0.5 transition-all focus:outline-none flex items-center cursor-pointer ${
                reminder.enabled ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-sm transition-all transform ${
                  reminder.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
