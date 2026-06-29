import { Home, ClipboardList, Plus, BarChart2, User } from 'lucide-react';
import { AppScreen } from '../types';

interface NavigationProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export default function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  // Determine if a screen belongs to one of the 5 nav items
  const activeTab = (screen: AppScreen) => {
    if (screen === 'home') return 'home';
    if (screen === 'habits') return 'habits';
    if (screen === 'stats') return 'stats';
    if (screen === 'profile') return 'profile';
    return '';
  };

  const tab = activeTab(currentScreen);

  return (
    <div id="bottom-nav-bar" className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-2 pb-6 flex items-center justify-between z-50 shadow-lg">
      {/* Home Button */}
      <button
        id="nav-btn-home"
        onClick={() => onNavigate('home')}
        className="flex flex-col items-center justify-center space-y-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
      >
        <Home
          className={`w-6 h-6 transition-colors ${
            tab === 'home' ? 'text-emerald-600' : 'text-gray-400'
          }`}
        />
        <span
          className={`text-[10px] font-medium transition-colors ${
            tab === 'home' ? 'text-emerald-600 font-semibold' : 'text-gray-400'
          }`}
        >
          Home
        </span>
      </button>

      {/* Habits Button */}
      <button
        id="nav-btn-habits"
        onClick={() => onNavigate('habits')}
        className="flex flex-col items-center justify-center space-y-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
      >
        <ClipboardList
          className={`w-6 h-6 transition-colors ${
            tab === 'habits' ? 'text-emerald-600' : 'text-gray-400'
          }`}
        />
        <span
          className={`text-[10px] font-medium transition-colors ${
            tab === 'habits' ? 'text-emerald-600 font-semibold' : 'text-gray-400'
          }`}
        >
          Habits
        </span>
      </button>

      {/* Center Floating Plus Button */}
      <button
        id="nav-btn-add"
        onClick={() => onNavigate('add-habit')}
        className="relative -top-5 flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-full text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 active:scale-90 transition-transform cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Stats Button */}
      <button
        id="nav-btn-stats"
        onClick={() => onNavigate('stats')}
        className="flex flex-col items-center justify-center space-y-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
      >
        <BarChart2
          className={`w-6 h-6 transition-colors ${
            tab === 'stats' ? 'text-emerald-600' : 'text-gray-400'
          }`}
        />
        <span
          className={`text-[10px] font-medium transition-colors ${
            tab === 'stats' ? 'text-emerald-600 font-semibold' : 'text-gray-400'
          }`}
        >
          Stats
        </span>
      </button>

      {/* Profile Button */}
      <button
        id="nav-btn-profile"
        onClick={() => onNavigate('profile')}
        className="flex flex-col items-center justify-center space-y-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
      >
        <User
          className={`w-6 h-6 transition-colors ${
            tab === 'profile' ? 'text-emerald-600' : 'text-gray-400'
          }`}
        />
        <span
          className={`text-[10px] font-medium transition-colors ${
            tab === 'profile' ? 'text-emerald-600 font-semibold' : 'text-gray-400'
          }`}
        >
          Profile
        </span>
      </button>
    </div>
  );
}
