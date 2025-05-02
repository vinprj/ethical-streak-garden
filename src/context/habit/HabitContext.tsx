
import React, { createContext, useContext, useState, useEffect } from "react";
import { Habit, Badge, UserStats } from "@/types/habit";
import { calculatePoints } from "@/lib/utils/habitUtils";
import { toast } from "sonner";
import { 
  STORAGE_KEY, 
  defaultStats, 
  initialBadges 
} from "./constants";
import { 
  addHabit as addHabitOp,
  updateHabit as updateHabitOp,
  deleteHabit as deleteHabitOp,
  archiveHabit as archiveHabitOp,
  completeHabit as completeHabitOp,
  uncompleteHabit as uncompleteHabitOp
} from "./habitOperations";
import { updateBadges } from "./badgeUtils";

interface HabitContextType {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "isArchived" | "currentStreak" | "longestStreak">) => void;
  updateHabit: (id: string, habitData: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string) => void;
  completeHabit: (id: string, date: string, note?: string, mood?: Habit["completedDates"][0]) => void;
  uncompleteHabit: (id: string, date: string) => void;
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  stats: UserStats;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  filterStatus: 'all' | 'completed' | 'pending';
  setFilterStatus: (status: 'all' | 'completed' | 'pending') => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

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

  // Save data to localStorage
  useEffect(() => {
    if (habits.length > 0 || badges.some(b => b.isUnlocked)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, badges }));
    }
  }, [habits, badges]);

  // Update stats and badges when habits change
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

    const updatedBadges = updateBadges(habits, badges);
    if (JSON.stringify(updatedBadges) !== JSON.stringify(badges)) {
      setBadges(updatedBadges);
    }
  }, [habits]);

  // Handler functions
  const addHabit = (habitData: Omit<Habit, "id" | "createdAt" | "completedDates" | "isArchived" | "currentStreak" | "longestStreak">) => {
    setHabits(prevHabits => addHabitOp(prevHabits, habitData));
  };

  const updateHabit = (id: string, habitData: Partial<Habit>) => {
    setHabits(prevHabits => updateHabitOp(prevHabits, id, habitData));
  };

  const deleteHabit = (id: string) => {
    setHabits(prevHabits => deleteHabitOp(prevHabits, id));
  };

  const archiveHabit = (id: string) => {
    setHabits(prevHabits => archiveHabitOp(prevHabits, id));
  };

  const completeHabit = (id: string, date: string, note?: string, mood?: Habit["completedDates"][0]) => {
    setHabits(prevHabits => completeHabitOp(prevHabits, id, date));
  };

  const uncompleteHabit = (id: string, date: string) => {
    setHabits(prevHabits => uncompleteHabitOp(prevHabits, id, date));
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
        setHabits,
        addHabit,
        updateHabit,
        deleteHabit,
        archiveHabit,
        completeHabit,
        uncompleteHabit,
        badges,
        setBadges,
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
