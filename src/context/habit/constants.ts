
import { Badge, UserStats } from "@/types/habit";

export const STORAGE_KEY = "ethical-habit-tracker-data";

export const defaultStats: UserStats = {
  totalCompletions: 0,
  totalHabits: 0,
  currentStreak: 0,
  longestStreak: 0,
  points: 0
};

export const initialBadges: Badge[] = [
  {
    id: "first-habit",
    name: "First Step",
    description: "Create your first habit",
    icon: "✨",
    isUnlocked: false
  },
  {
    id: "3-day-streak",
    name: "Momentum",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    isUnlocked: false
  },
  {
    id: "7-day-streak",
    name: "Week Champion",
    description: "Complete a habit for 7 days straight",
    icon: "🏆",
    isUnlocked: false
  },
  {
    id: "first-reflection",
    name: "Mindful Moment",
    description: "Write your first habit reflection",
    icon: "🧘",
    isUnlocked: false
  },
  {
    id: "5-habits",
    name: "Habit Builder",
    description: "Track 5 different habits",
    icon: "🏗️",
    isUnlocked: false
  }
];
