
import { Badge, Habit } from "@/types/habit";
import { toast } from "sonner";

export const updateBadges = (
  habits: Habit[],
  currentBadges: Badge[]
): Badge[] => {
  const newBadges = [...currentBadges];
  
  if (habits.length > 0 && !newBadges.find(b => b.id === "first-habit")?.isUnlocked) {
    const index = newBadges.findIndex(b => b.id === "first-habit");
    if (index >= 0) {
      newBadges[index] = { ...newBadges[index], isUnlocked: true, unlockedAt: new Date().toISOString() };
      toast("Badge Unlocked: First Step! ✨", {
        description: "You've created your first habit",
      });
    }
  }

  if (habits.some(h => h.currentStreak >= 3) && !newBadges.find(b => b.id === "3-day-streak")?.isUnlocked) {
    const index = newBadges.findIndex(b => b.id === "3-day-streak");
    if (index >= 0) {
      newBadges[index] = { ...newBadges[index], isUnlocked: true, unlockedAt: new Date().toISOString() };
      toast("Badge Unlocked: Momentum! 🔥", {
        description: "You've maintained a 3-day streak",
      });
    }
  }

  if (habits.some(h => h.currentStreak >= 7) && !newBadges.find(b => b.id === "7-day-streak")?.isUnlocked) {
    const index = newBadges.findIndex(b => b.id === "7-day-streak");
    if (index >= 0) {
      newBadges[index] = { ...newBadges[index], isUnlocked: true, unlockedAt: new Date().toISOString() };
      toast("Badge Unlocked: Week Champion! 🏆", {
        description: "You've completed a habit for 7 days straight",
      });
    }
  }

  if (habits.length >= 5 && !newBadges.find(b => b.id === "5-habits")?.isUnlocked) {
    const index = newBadges.findIndex(b => b.id === "5-habits");
    if (index >= 0) {
      newBadges[index] = { ...newBadges[index], isUnlocked: true, unlockedAt: new Date().toISOString() };
      toast("Badge Unlocked: Habit Builder! 🏗️", {
        description: "You're tracking 5 different habits",
      });
    }
  }

  return newBadges;
};
