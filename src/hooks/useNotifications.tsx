
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHabits } from "@/context/HabitContext";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "achievement";
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { habits, stats } = useHabits();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateNotifications = () => {
    if (!user) return [];

    const newNotifications: Notification[] = [];
    const now = new Date();
    const userCreatedAt = new Date(user.created_at);
    const isNewUser = (now.getTime() - userCreatedAt.getTime()) < (24 * 60 * 60 * 1000); // Less than 24 hours

    // Welcome notification for new users
    if (isNewUser) {
      newNotifications.push({
        id: 'welcome',
        title: 'Welcome to HabitFlow! 🎉',
        message: 'Start building your first habit and join the community!',
        type: 'info',
        timestamp: userCreatedAt,
        read: false,
      });
    }

    // Current streak notifications
    if (stats.currentStreak >= 3 && stats.currentStreak % 3 === 0) {
      newNotifications.push({
        id: `streak-${stats.currentStreak}`,
        title: 'Streak Milestone! 🔥',
        message: `Amazing! You've maintained your habits for ${stats.currentStreak} days in a row!`,
        type: 'achievement',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
      });
    }

    // Badge unlock notifications
    if (stats.longestStreak >= 7 && stats.longestStreak < 14) {
      newNotifications.push({
        id: 'week-warrior',
        title: 'Badge Unlocked! 🏆',
        message: 'You\'ve earned the "Week Warrior" badge for maintaining a 7-day streak!',
        type: 'success',
        timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
        read: false,
      });
    }

    // Habit completion reminders
    const today = new Date().toISOString().split('T')[0];
    const uncompletedHabits = habits.filter(habit => 
      !habit.completedDates.includes(today)
    );

    if (uncompletedHabits.length > 0 && !isNewUser) {
      newNotifications.push({
        id: 'daily-reminder',
        title: 'Daily Reminder 💪',
        message: `You have ${uncompletedHabits.length} habit${uncompletedHabits.length > 1 ? 's' : ''} left to complete today!`,
        type: 'info',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
      });
    }

    return newNotifications;
  };

  useEffect(() => {
    if (user && habits.length >= 0) {
      const generatedNotifications = generateNotifications();
      setNotifications(generatedNotifications);
    }
  }, [user, habits, stats.currentStreak, stats.longestStreak]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
};
