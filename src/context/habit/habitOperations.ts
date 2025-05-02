
import { Habit } from "@/types/habit";
import { calculateStreak } from "@/lib/utils/habitUtils";
import { toast } from "sonner";

export const addHabit = (
  habits: Habit[],
  habitData: Omit<Habit, "id" | "createdAt" | "completedDates" | "isArchived" | "currentStreak" | "longestStreak">
): Habit[] => {
  const newHabit: Habit = {
    ...habitData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    completedDates: [],
    isArchived: false,
    currentStreak: 0,
    longestStreak: 0
  };

  toast("Habit Created", {
    description: `${habitData.name} has been added to your habits`,
  });
  
  return [...habits, newHabit];
};

export const updateHabit = (
  habits: Habit[],
  id: string,
  habitData: Partial<Habit>
): Habit[] => {
  const updatedHabits = habits.map(habit => 
    habit.id === id ? { ...habit, ...habitData } : habit
  );
  
  toast("Habit Updated", {
    description: "Your changes have been saved",
  });
  
  return updatedHabits;
};

export const deleteHabit = (
  habits: Habit[],
  id: string
): Habit[] => {
  const filteredHabits = habits.filter(habit => habit.id !== id);
  
  toast("Habit Deleted", {
    description: "The habit has been removed permanently",
  });
  
  return filteredHabits;
};

export const archiveHabit = (
  habits: Habit[],
  id: string
): Habit[] => {
  const updatedHabits = habits.map(habit => 
    habit.id === id ? { ...habit, isArchived: true } : habit
  );
  
  toast("Habit Archived", {
    description: "The habit has been moved to your archives",
  });
  
  return updatedHabits;
};

export const completeHabit = (
  habits: Habit[],
  id: string,
  date: string
): Habit[] => {
  return habits.map(habit => {
    if (habit.id !== id) return habit;
    
    const completedDates = [...habit.completedDates];
    if (!completedDates.includes(date)) {
      completedDates.push(date);
    }
    
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
  });
};

export const uncompleteHabit = (
  habits: Habit[],
  id: string,
  date: string
): Habit[] => {
  return habits.map(habit => {
    if (habit.id !== id) return habit;
    
    const completedDates = habit.completedDates.filter(d => d !== date);
    const newCurrentStreak = calculateStreak({...habit, completedDates});
    
    return {
      ...habit,
      completedDates,
      currentStreak: newCurrentStreak
    };
  });
};
