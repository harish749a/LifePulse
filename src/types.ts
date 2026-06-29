export type AppScreen =
  | 'get-started'
  | 'login'
  | 'home'
  | 'habits'
  | 'add-habit'
  | 'water'
  | 'meals'
  | 'gym'
  | 'score'
  | 'stats'
  | 'reminders'
  | 'profile';

export type HabitCategory = 'health' | 'fitness' | 'mind' | 'learning' | 'other';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  repeat: string[]; // ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  time: string; // e.g. "07:00 AM"
  note?: string;
  icon?: string; // name of lucide icon
  completedDates: string[]; // e.g. ["2026-06-29"]
}

export interface WaterProgress {
  current: number;
  goal: number;
  history: { [date: string]: number };
}

export interface MealRemindersState {
  breakfast: boolean;
  lunch: boolean;
  snack: boolean;
  dinner: boolean;
  times: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
}

export interface GymState {
  completedThisWeek: number;
  goalThisWeek: number;
  workoutDays: string[]; // ['M', 'W', 'F']
  nextWorkout: string; // e.g. "Friday, 7:00 AM"
  description: string; // e.g. "Chest & Triceps"
}

export interface DailyScoreBreakdown {
  habitsCompleted: number; // e.g. 60
  waterIntake: number; // e.g. 10
  mealsOnTime: number; // e.g. 8
  workout: number; // e.g. 10
  sleep: number; // e.g. 8
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  streak: number;
  habitsCount: number;
  avgScore: number;
}

export interface ReminderSetting {
  id: string;
  name: string;
  time: string;
  enabled: boolean;
}
