/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppScreen, Habit, WaterProgress, MealRemindersState, GymState, UserProfile, ReminderSetting } from './types';
import { api } from './services/api';
import {
  INITIAL_HABITS,
  INITIAL_WATER,
  INITIAL_MEALS,
  INITIAL_GYM,
  INITIAL_PROFILE,
  INITIAL_REMINDERS
} from './data';
import GetStarted from './components/GetStarted';
import Login from './components/Login';
import HomeDashboard from './components/HomeDashboard';
import HabitsList from './components/HabitsList';
import AddHabit from './components/AddHabit';
import WaterTracker from './components/WaterTracker';
import MealReminders from './components/MealReminders';
import GymTracker from './components/GymTracker';
import DailyScore from './components/DailyScore';
import Statistics from './components/Statistics';
import RemindersSettings from './components/RemindersSettings';
import Profile from './components/Profile';
import Navigation from './components/Navigation';

export default function App() {
  // --- View State ---
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('get-started');

  // --- Persistence states ---
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [water, setWater] = useState<WaterProgress>(INITIAL_WATER);
  const [meals, setMeals] = useState<MealRemindersState>(INITIAL_MEALS);
  const [gym, setGym] = useState<GymState>(INITIAL_GYM);
  const [reminders, setReminders] = useState<ReminderSetting[]>(INITIAL_REMINDERS);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('lifepulse_profile');
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));

      const storedHabits = localStorage.getItem('lifepulse_habits');
      if (storedHabits) setHabits(JSON.parse(storedHabits));

      const storedWater = localStorage.getItem('lifepulse_water');
      if (storedWater) setWater(JSON.parse(storedWater));

      const storedMeals = localStorage.getItem('lifepulse_meals');
      if (storedMeals) setMeals(JSON.parse(storedMeals));

      const storedGym = localStorage.getItem('lifepulse_gym');
      if (storedGym) setGym(JSON.parse(storedGym));

      const storedReminders = localStorage.getItem('lifepulse_reminders');
      if (storedReminders) setReminders(JSON.parse(storedReminders));

      const storedScreen = localStorage.getItem('lifepulse_screen');
      if (storedScreen) setCurrentScreen(storedScreen as AppScreen);
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  // Save changes to LocalStorage
  const saveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('lifepulse_profile', JSON.stringify(newProfile));
  };

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem('lifepulse_habits', JSON.stringify(newHabits));
  };

  const saveWater = (newWater: WaterProgress) => {
    setWater(newWater);
    localStorage.setItem('lifepulse_water', JSON.stringify(newWater));
  };

  const saveMeals = (newMeals: MealRemindersState) => {
    setMeals(newMeals);
    localStorage.setItem('lifepulse_meals', JSON.stringify(newMeals));
  };

  const saveGym = (newGym: GymState) => {
    setGym(newGym);
    localStorage.setItem('lifepulse_gym', JSON.stringify(newGym));
  };

  const saveReminders = (newReminders: ReminderSetting[]) => {
    setReminders(newReminders);
    localStorage.setItem('lifepulse_reminders', JSON.stringify(newReminders));
  };

  const navigateTo = (screen: AppScreen) => {
    setCurrentScreen(screen);
    localStorage.setItem('lifepulse_screen', screen);
  };

  // --- Dynamic Life Score Calculation ---
  // Calculates score out of 100 based on daily tasks
  const getDailyScoreBreakdown = () => {
    const todayStr = '2026-06-29';

    // 1. Regular habits completed (40 points)
    // Find habits except water & gym
    const regularHabits = habits.filter(h => h.id !== '1' && h.id !== '2');
    const completedRegular = regularHabits.filter(h => h.completedDates.includes(todayStr)).length;
    const habitsCompletedScore = regularHabits.length > 0 
      ? Math.round((completedRegular / regularHabits.length) * 40)
      : 40;

    // 2. Water score (20 points)
    const waterScore = Math.round(Math.min(1, water.current / water.goal) * 20);

    // 3. Gym score (20 points)
    const gymScore = Math.round(Math.min(1, gym.completedThisWeek / gym.goalThisWeek) * 20);

    // 4. Meals score (20 points total: 5 pts per meal completed)
    let mealsScore = 0;
    if (meals.breakfast) mealsScore += 5;
    if (meals.lunch) mealsScore += 5;
    if (meals.snack) mealsScore += 5;
    if (meals.dinner) mealsScore += 5;

    // 5. Sleep duration proxy score (fixed high value for representation)
    const sleepScore = 8; // out of 10

    return {
      habitsCompleted: habitsCompletedScore,
      waterIntake: waterScore,
      mealsOnTime: mealsScore,
      workout: gymScore,
      sleep: sleepScore,
      total: habitsCompletedScore + waterScore + mealsScore + gymScore
    };
  };

  const scoreBreakdown = getDailyScoreBreakdown();
  const currentLifeScore = Math.min(100, Math.max(10, scoreBreakdown.total + 2)); // Dynamic padding

  // --- Actions & Event Handlers ---
  const handleToggleHabit = (id: string) => {
    const todayStr = '2026-06-29';
    if (id === '1') {
      // Toggle water tracker completion shortcut
      const nextVal = water.current >= water.goal ? 0 : water.goal;
      saveWater({ ...water, current: nextVal });
      if (nextVal > water.current) {
        api.syncWaterLog(nextVal - water.current).catch(() => {});
      }
      return;
    }

    const updated = habits.map((h) => {
      if (h.id === id) {
        const completedDates = [...h.completedDates];
        const index = completedDates.indexOf(todayStr);
        if (index > -1) {
          completedDates.splice(index, 1);
        } else {
          completedDates.push(todayStr);
        }
        return { ...h, completedDates };
      }
      return h;
    });

    saveHabits(updated);
  };

  const handleAddHabit = (newHabit: Omit<Habit, 'id' | 'completedDates'>) => {
    const freshHabit: Habit = {
      ...newHabit,
      id: String(habits.length + 1),
      completedDates: []
    };
    const nextList = [...habits, freshHabit];
    saveHabits(nextList);
    saveProfile({
      ...userProfile,
      habitsCount: nextList.length
    });
    api.syncHabit(freshHabit).catch(() => {});
    navigateTo('habits');
  };

  const handleUpdateWater = (newVal: number) => {
    const diff = newVal - water.current;
    saveWater({
      ...water,
      current: newVal
    });
    if (diff > 0) {
      api.syncWaterLog(diff).catch(() => {});
    }
  };

  const handleToggleMeal = (mealKey: keyof Omit<MealRemindersState, 'times'>) => {
    const nextVal = !meals[mealKey];
    saveMeals({
      ...meals,
      [mealKey]: nextVal
    });
    if (nextVal) {
      api.syncMealLog(`${mealKey.charAt(0).toUpperCase() + mealKey.slice(1)} Logged`, mealKey, 450).catch(() => {});
    }
  };

  const handleUpdateGym = (newVal: number) => {
    const diff = newVal - gym.completedThisWeek;
    saveGym({
      ...gym,
      completedThisWeek: newVal
    });
    if (diff > 0) {
      api.syncWorkoutLog(gym.description || 'Gym Workout Session', 45, 300).catch(() => {});
    }
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) => {
      if (r.id === id) return { ...r, enabled: !r.enabled };
      return r;
    });
    saveReminders(updated);
  };

  const handleLoginSuccess = (email: string, name: string) => {
    saveProfile({
      ...userProfile,
      email,
      name
    });
    navigateTo('home');
  };

  const handleLogout = () => {
    // Call api logout to blacklist refresh token on backend if live
    api.logout().catch(console.error);

    // Save configuration settings before clearing
    const apiUrl = localStorage.getItem('lifepulse_api_url');
    const apiMode = localStorage.getItem('lifepulse_api_mode');

    localStorage.clear();

    // Re-apply configuration settings
    if (apiUrl) localStorage.setItem('lifepulse_api_url', apiUrl);
    if (apiMode) localStorage.setItem('lifepulse_api_mode', apiMode);

    setUserProfile(INITIAL_PROFILE);
    setHabits(INITIAL_HABITS);
    setWater(INITIAL_WATER);
    setMeals(INITIAL_MEALS);
    setGym(INITIAL_GYM);
    setReminders(INITIAL_REMINDERS);
    navigateTo('get-started');
  };

  // Render current screen inside styled mobile-responsive mock container
  const renderScreen = () => {
    switch (currentScreen) {
      case 'get-started':
        return (
          <GetStarted
            onGetStarted={() => navigateTo('login')}
            onLogIn={() => navigateTo('login')}
          />
        );
      case 'login':
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onBack={() => navigateTo('get-started')}
          />
        );
      case 'home':
        return (
          <HomeDashboard
            userProfile={userProfile}
            habits={habits}
            water={water}
            meals={meals}
            gym={gym}
            lifeScore={currentLifeScore}
            onNavigate={navigateTo}
            onToggleHabit={handleToggleHabit}
          />
        );
      case 'habits':
        return (
          <HabitsList
            habits={habits}
            water={water}
            onNavigate={navigateTo}
            onToggleHabit={handleToggleHabit}
            onAddClick={() => navigateTo('add-habit')}
          />
        );
      case 'add-habit':
        return (
          <AddHabit
            onAddHabit={handleAddHabit}
            onBack={() => navigateTo('habits')}
          />
        );
      case 'water':
        return (
          <WaterTracker
            water={water}
            onUpdateWater={handleUpdateWater}
            onBack={() => navigateTo('home')}
          />
        );
      case 'meals':
        return (
          <MealReminders
            meals={meals}
            onToggleMeal={handleToggleMeal}
            onBack={() => navigateTo('home')}
          />
        );
      case 'gym':
        return (
          <GymTracker
            gym={gym}
            onUpdateGym={handleUpdateGym}
            onBack={() => navigateTo('home')}
          />
        );
      case 'score':
        return (
          <DailyScore
            score={currentLifeScore}
            breakdown={{
              habitsCompleted: scoreBreakdown.habitsCompleted,
              waterIntake: scoreBreakdown.waterIntake,
              mealsOnTime: scoreBreakdown.mealsOnTime,
              workout: scoreBreakdown.workout,
              sleep: scoreBreakdown.sleep
            }}
            onBack={() => navigateTo('home')}
          />
        );
      case 'stats':
        return <Statistics onBack={() => navigateTo('home')} />;
      case 'reminders':
        return (
          <RemindersSettings
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onBack={() => navigateTo('home')}
          />
        );
      case 'profile':
        return (
          <Profile
            userProfile={userProfile}
            onLogout={handleLogout}
            onNavigate={navigateTo}
            onUpdateName={(name) => saveProfile({ ...userProfile, name })}
          />
        );
      default:
        return (
          <HomeDashboard
            userProfile={userProfile}
            habits={habits}
            water={water}
            meals={meals}
            gym={gym}
            lifeScore={currentLifeScore}
            onNavigate={navigateTo}
            onToggleHabit={handleToggleHabit}
          />
        );
    }
  };

  const showNavbar = ![ 'get-started', 'login', 'add-habit' ].includes(currentScreen);

  return (
    <div id="lifepulse-viewport" className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:py-6 selection:bg-emerald-100 font-sans">
      {/* Premium smartphone mockup wrapping frame for high-fidelity presentation */}
      <div id="phone-mockup-frame" className="relative w-full max-w-md bg-white sm:rounded-[36px] sm:shadow-2xl overflow-hidden min-h-screen sm:min-h-[820px] flex flex-col border border-gray-100">
        
        {/* Dynamic status notch bar for realistic visual aesthetic */}
        <div className="hidden sm:flex bg-slate-50 border-b border-gray-100/50 justify-between items-center px-6 py-2.5 z-50 text-gray-500 text-xs font-semibold">
          <span className="font-sans">9:41 AM</span>
          <div className="w-24 h-4 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-400">
            LifePulse Active
          </div>
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 11.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
            <span>100%</span>
          </div>
        </div>

        {/* Core application body view container */}
        <div className="flex-1 overflow-y-auto bg-slate-50/20">
          {renderScreen()}
        </div>

        {/* Global sticky Bottom Navigation */}
        {showNavbar && (
          <Navigation currentScreen={currentScreen} onNavigate={navigateTo} />
        )}
      </div>
    </div>
  );
}

