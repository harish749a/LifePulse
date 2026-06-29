import { Habit, WaterProgress, MealRemindersState, GymState, UserProfile, ReminderSetting } from './types';

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Drink Water',
    category: 'health',
    repeat: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    time: '08:00 AM',
    note: 'Everyday 8 Glasses of water',
    icon: 'Droplet',
    completedDates: ['2026-06-28'] // Completed yesterday, not today (today is 5/8)
  },
  {
    id: '2',
    name: 'Gym',
    category: 'fitness',
    repeat: ['M', 'W', 'F'],
    time: '07:00 AM',
    note: 'Workout with chest and arms focus',
    icon: 'Dumbbell',
    completedDates: ['2026-06-26'] // Monday, Wednesday, Friday
  },
  {
    id: '3',
    name: 'Read Book',
    category: 'learning',
    repeat: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    time: '09:00 PM',
    note: 'Read at least 10 pages',
    icon: 'BookOpen',
    completedDates: ['2026-06-29', '2026-06-28'] // Completed today and yesterday
  },
  {
    id: '4',
    name: 'Meditation',
    category: 'mind',
    repeat: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    time: '06:30 AM',
    note: '15 mins mindfulness',
    icon: 'Sparkles',
    completedDates: ['2026-06-29', '2026-06-28'] // Completed today and yesterday
  },
  {
    id: '5',
    name: 'Learn Hindi',
    category: 'learning',
    repeat: ['T', 'T', 'S'], // Tue, Thu, Sat
    time: '08:00 PM',
    note: 'Duolingo streak',
    icon: 'Languages',
    completedDates: ['2026-06-27']
  },
  {
    id: '6',
    name: 'Walk 30 Min',
    category: 'fitness',
    repeat: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    time: '06:00 PM',
    note: 'Active recovery walk',
    icon: 'Footprints',
    completedDates: ['2026-06-29', '2026-06-28'] // Completed today and yesterday
  }
];

export const INITIAL_WATER: WaterProgress = {
  current: 5,
  goal: 8,
  history: {
    '2026-06-23': 8,
    '2026-06-24': 6,
    '2026-06-25': 7,
    '2026-06-26': 8,
    '2026-06-27': 5,
    '2026-06-28': 8,
    '2026-06-29': 5 // Current day
  }
};

export const INITIAL_MEALS: MealRemindersState = {
  breakfast: true, // completed
  lunch: false, // pending
  snack: false, // pending
  dinner: false, // pending
  times: {
    breakfast: '08:00 AM',
    lunch: '01:00 PM',
    snack: '05:00 PM',
    dinner: '08:00 PM'
  }
};

export const INITIAL_GYM: GymState = {
  completedThisWeek: 3,
  goalThisWeek: 5,
  workoutDays: ['M', 'W', 'F'],
  nextWorkout: 'Friday, 7:00 AM',
  description: 'Chest & Triceps'
};

export const INITIAL_PROFILE: UserProfile = {
  name: 'Harish A',
  email: 'harish@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', // Beautiful modern avatar portrait matching screenshots
  streak: 24,
  habitsCount: 8,
  avgScore: 82
};

export const INITIAL_REMINDERS: ReminderSetting[] = [
  { id: '1', name: 'Wake Up', time: '06:00 AM', enabled: true },
  { id: '2', name: 'Drink Water', time: 'Every 2 hours', enabled: true },
  { id: '3', name: 'Breakfast', time: '08:00 AM', enabled: true },
  { id: '4', name: 'Lunch', time: '01:00 PM', enabled: true },
  { id: '5', name: 'Dinner', time: '08:00 PM', enabled: true },
  { id: '6', name: 'Bed Time', time: '10:30 PM', enabled: true }
];
