
import React, { createContext, useContext, useState, useEffect } from "react";
import { Habit, Badge, UserStats } from "@/types/habit";
import { calculatePoints, calculateStreak } from "@/lib/utils/habitUtils";
import { toast } from "sonner";

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "isArchived" | "currentStreak" | "longestStreak">) => void;
  updateHabit: (id: string, habitData: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string) => void;
  completeHabit: (id: string, date: string, note?: string, mood?: Habit["completedDates"][0]) => void;
  uncompleteHabit: (id: string, date: string) => void;
  badges: Badge[];
  stats: UserStats;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  filterStatus: 'all' | 'completed' | 'pending';
  setFilterStatus: (status: 'all' | 'completed' | 'pending') => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
}

const defaultStats: UserStats = {
  totalCompletions: 0,
  totalHabits: 0,
  currentStreak: 0,
  longestStreak: 0,
  points: 0
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const STORAGE_KEY = "ethical-habit-tracker-data";

// Sample badges
const initialBadges: Badge[] = [
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

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { habits: savedHabits, badges: savedBadges } = JSON.parse(savedData);
        if (Array.isArray(savedHabits)) {
          setHabits(savedHabits);
        }
        if (Array.isArray(savedBadges)) {
          setBadges(savedBadges);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (habits.length > 0 || badges.some(b => b.isUnlocked)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, badges }));
    }
  }, [habits, badges]);

  // Calculate stats whenever habits change
  useEffect(() => {
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
    const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.longestStreak)) : 0;
    const currentStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak)) : 0;
    const points = calculatePoints(habits);

    setStats({
      totalCompletions,
      totalHabits: habits.filter(h => !h.isArchived).length,
      longestStreak,
      currentStreak,
      points
    });

    // Check for badge unlocks
    const newBadges = [...badges];
    
    // First habit badge
    if (habits.length > 0 && !newBadges.find(b => b.id === "first-habit")?.isUnlocked) {
      const index = newBadges.findIndex(b => b.id === "first-habit");
      if (index >= 0) {
        newBadges[index] = { ...newBadges[index], isUnlocked: true, unlockedAt: new Date().toISOString() };
        toast("Badge Unlocked: First Step! ✨", {
          description: "You've created your first habit",
        });
      }
    }

    // 3-day streak badge
    if (habits.some(h => h.currentStreak >= 3) && !newBadges.find(b => b.id === "3-day-streak")?.isUnlocked) {
      const index = newBadges.findIndex(b => b.id === "3-day-streak");
      if (index >= 0) {
        newBadges[index] = { ...newBadges[index], isUnlocked: true, unlockedAt: new Date().toISOString() };
        toast("Badge Unlocked: Momentum! 🔥", {
          description: "You've maintained a 3-day streak",
        });
      }
    }

    // 7-day streak badge
    if (habits.some(h => h.currentStreak >= 7) && !newBadges.find(b => b.id === "7-day-streak")?.isUnlocked) {
      const index = newBadges.findIndex(b => b.id === "7-day-streak");
      if (index >= 0) {
        newBadges[index] = { ...newBadges[index], isUnlocked: true, unlockedAt: new Date().toISOString() };
        toast("Badge Unlocked: Week Champion! 🏆", {
          description: "You've completed a habit for 7 days straight",
        });
      }
    }

    // 5 habits badge
    if (habits.length >= 5 && !newBadges.find(b => b.id === "5-habits")?.isUnlocked) {
      const index = newBadges.findIndex(b => b.id === "5-habits");
      if (index >= 0) {
        newBadges[index] = { ...newBadges[index], isUnlocked: true, unlockedAt: new Date().toISOString() };
        toast("Badge Unlocked: Habit Builder! 🏗️", {
          description: "You're tracking 5 different habits",
        });
      }
    }

    setBadges(newBadges);
  }, [habits]);

  const addHabit = (habitData: Omit<Habit, "id" | "createdAt" | "completedDates" | "isArchived" | "currentStreak" | "longestStreak">) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedDates: [],
      isArchived: false,
      currentStreak: 0,
      longestStreak: 0
    };

    setHabits(prevHabits => [...prevHabits, newHabit]);
    toast("Habit Created", {
      description: `${habitData.name} has been added to your habits`,
    });
  };

  const updateHabit = (id: string, habitData: Partial<Habit>) => {
    setHabits(prevHabits => prevHabits.map(habit => 
      habit.id === id ? { ...habit, ...habitData } : habit
    ));
    toast("Habit Updated", {
      description: "Your changes have been saved",
    });
  };

  const deleteHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
    toast("Habit Deleted", {
      description: "The habit has been removed permanently",
    });
  };

  const archiveHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.map(habit => 
      habit.id === id ? { ...habit, isArchived: true } : habit
    ));
    toast("Habit Archived", {
      description: "The habit has been moved to your archives",
    });
  };

  const completeHabit = (id: string, date: string, note?: string, mood?: Habit["completedDates"][0]) => {
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id !== id) return habit;
      
      const completedDates = [...habit.completedDates];
      if (!completedDates.includes(date)) {
        completedDates.push(date);
      }
      
      // Calculate new streak
      const newCurrentStreak = calculateStreak({...habit, completedDates});
      const newLongestStreak = Math.max(habit.longestStreak, newCurrentStreak);
      
      toast("Habit Completed", {
        description: `Great job! Keep up the consistency.`,
      });
      
      return {
        ...habit,
        completedDates,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak
      };
    }));
  };

  const uncompleteHabit = (id: string, date: string) => {
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id !== id) return habit;
      
      const completedDates = habit.completedDates.filter(d => d !== date);
      const newCurrentStreak = calculateStreak({...habit, completedDates});
      
      return {
        ...habit,
        completedDates,
        currentStreak: newCurrentStreak
      };
    }));
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(prev => !prev);
    if (!isOfflineMode) {
      toast("Offline Mode Enabled", {
        description: "Changes will sync when you're back online",
      });
    } else {
      toast("Back Online", {
        description: "Your data has been synced",
      });
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        archiveHabit,
        completeHabit,
        uncompleteHabit,
        badges,
        stats,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,
        isOfflineMode,
        toggleOfflineMode
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};
