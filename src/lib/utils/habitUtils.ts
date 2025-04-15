
import { Habit, HabitCompletion } from "@/types/habit";

// Check if a habit was completed on a specific date
export function isHabitCompletedOnDate(habit: Habit, date: Date): boolean {
  const dateString = date.toISOString().split('T')[0];
  return habit.completedDates.includes(dateString);
}

// Get the current streak for a habit
export function calculateStreak(habit: Habit): number {
  if (habit.completedDates.length === 0) return 0;
  
  // Sort dates in descending order
  const sortedDates = [...habit.completedDates].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  let streak = 1;
  let currentDate = new Date(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    
    // Check if dates are consecutive
    const diffTime = currentDate.getTime() - prevDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }
  
  return streak;
}

// Format a date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

// Calculate completion percentage for a habit
export function calculateCompletionPercentage(habit: Habit, period: 'week' | 'month' = 'week'): number {
  const today = new Date();
  let daysToCheck = period === 'week' ? 7 : 30;
  let completedCount = 0;
  
  // Daily habits
  if (habit.frequency === 'daily') {
    for (let i = 0; i < daysToCheck; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      if (habit.completedDates.includes(dateString)) {
        completedCount++;
      }
    }
    return Math.round((completedCount / daysToCheck) * 100);
  }
  
  // Weekly habits
  if (habit.frequency === 'weekly') {
    const weeksToCheck = period === 'week' ? 1 : 4;
    const weeklyCompletions = habit.completedDates.filter(date => {
      const completionDate = new Date(date);
      const diffTime = today.getTime() - completionDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= weeksToCheck * 7;
    });
    
    return Math.round((weeklyCompletions.length / weeksToCheck) * 100);
  }
  
  // One-time habits
  if (habit.frequency === 'once') {
    return habit.completedDates.length > 0 ? 100 : 0;
  }
  
  return 0;
}

// Get appropriate badges based on habit completion and streaks
export function getEarnedBadges(habits: Habit[]): string[] {
  const badges: string[] = [];
  const totalCompletions = habits.flatMap(h => h.completedDates).length;
  const maxStreak = Math.max(...habits.map(h => h.longestStreak));
  
  if (totalCompletions >= 50) badges.push('50-completions');
  if (totalCompletions >= 100) badges.push('100-completions');
  if (maxStreak >= 7) badges.push('7-day-streak');
  if (maxStreak >= 30) badges.push('30-day-streak');
  if (habits.filter(h => h.category === 'health').length >= 3) badges.push('health-enthusiast');
  
  return badges;
}

// Get total points based on completions and streaks
export function calculatePoints(habits: Habit[]): number {
  let points = 0;
  
  // Points for completions
  const totalCompletions = habits.flatMap(h => h.completedDates).length;
  points += totalCompletions * 5;
  
  // Points for streaks
  habits.forEach(habit => {
    points += habit.currentStreak * 2;
  });
  
  // Points for consistency (completing same habit for multiple days)
  habits.forEach(habit => {
    if (habit.longestStreak >= 7) points += 20;
    if (habit.longestStreak >= 30) points += 100;
  });
  
  return points;
}

// Generate a color based on habit category
export function getCategoryColor(category: string): string {
  switch(category) {
    case 'health': return 'bg-emerald-500';
    case 'fitness': return 'bg-blue-500';
    case 'mindfulness': return 'bg-purple-400';
    case 'productivity': return 'bg-amber-500';
    case 'learning': return 'bg-cyan-500';
    case 'creativity': return 'bg-pink-500';
    case 'social': return 'bg-indigo-500';
    default: return 'bg-gray-500';
  }
}
