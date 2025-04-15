
export type HabitFrequency = 'daily' | 'weekly' | 'once';

export type HabitCategory = 'health' | 'fitness' | 'mindfulness' | 'productivity' | 'learning' | 'creativity' | 'social' | 'other';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  category: HabitCategory;
  createdAt: string;
  completedDates: string[]; // ISO date strings
  isArchived: boolean;
  color?: string;
  targetValue?: number; // For habits with a target (e.g., drink 8 glasses of water)
  currentStreak: number;
  longestStreak: number;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  value?: number; // For habits with a target value
  note?: string;
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface UserStats {
  totalCompletions: number;
  totalHabits: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
}
