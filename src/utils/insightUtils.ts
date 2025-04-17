
import { Habit } from "@/types/habit";

// Category colors mapping
export const CATEGORY_COLORS: Record<string, string> = {
  health: '#10b981', // emerald-500
  fitness: '#3b82f6', // blue-500 
  mindfulness: '#a78bfa', // purple-400
  productivity: '#f59e0b', // amber-500
  learning: '#06b6d4', // cyan-500 
  creativity: '#ec4899', // pink-500
  social: '#6366f1', // indigo-500
  other: '#94a3b8' // slate-400
};

// Get color for category
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase() as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.other;
}

// Calculate weekly completion rates
export function getWeeklyCompletionData(habits: Habit[]) {
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Count habits completed on this day
    const completedCount = habits.filter(h => 
      h.completedDates.includes(dateStr)
    ).length;
    
    // Count daily habits that should have been completed
    const totalDailyHabits = habits.filter(h => 
      !h.isArchived && (h.frequency === 'daily' || 
        (h.frequency === 'weekly' && date.getDay() === 0))
    ).length;
    
    const percentage = totalDailyHabits > 0 ? Math.round((completedCount / totalDailyHabits) * 100) : 0;
    
    weekData.push({
      day: dayNames[date.getDay()],
      percentage,
      completed: completedCount,
      total: totalDailyHabits,
      isEmpty: totalDailyHabits === 0
    });
  }
  
  return weekData;
}

// Get category distribution data
export function getCategoryData(habits: Habit[]) {
  const categories: Record<string, number> = {};
  
  habits.forEach(habit => {
    const category = habit.category || 'other';
    categories[category] = (categories[category] || 0) + 1;
  });
  
  return Object.entries(categories).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));
}

// Get most consistent habits
export function getMostConsistentHabits(habits: Habit[], limit = 3) {
  return [...habits]
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, limit);
}
