
import { Habit, HabitCategory, Badge, HabitFrequency } from "@/types/habit";
import { calculateStreak, generateDateArray } from "./dateUtils";
import { habitNamesByCategory } from "./constants";

// Generate a single habit with realistic data
export const generateHabit = (
  id = `habit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  pattern: "consistent" | "occasional" | "weekend" | "streak" | "multiple" | "recent" = "consistent",
  streakLength = 0
): Habit => {
  const categories = Object.keys(habitNamesByCategory) as HabitCategory[];
  const randomCategoryIndex = Math.floor(Math.random() * categories.length);
  const category = categories[randomCategoryIndex];
  
  // Get a random habit name from the selected category
  const habitNames = habitNamesByCategory[category];
  const name = habitNames[Math.floor(Math.random() * habitNames.length)];
  
  // Determine frequency based on the habit and category
  let frequency: HabitFrequency;
  if (name.includes("weekly") || category === "social" || Math.random() < 0.2) {
    frequency = "weekly";
  } else if (Math.random() < 0.05) {
    frequency = "once";
  } else {
    frequency = "daily";
  }
  
  // Generate completion dates based on the pattern
  const completedDates = generateDateArray(pattern, streakLength);
  
  // Calculate streaks
  const streaks = calculateStreak(completedDates);
  
  return {
    id,
    name,
    description: `A habit to ${name.toLowerCase()} regularly.`,
    frequency,
    category,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
    completedDates,
    isArchived: false,
    currentStreak: streaks.current,
    longestStreak: streaks.longest
  };
};

// Generate a set of habits with various patterns
export const generateTestHabits = (count = 15): Habit[] => {
  const habits: Habit[] = [];
  
  // Generate a mix of habit patterns
  const patterns: Array<"consistent" | "occasional" | "weekend" | "streak" | "multiple" | "recent"> = [
    "consistent", "occasional", "weekend", "streak", "multiple", "recent"
  ];
  
  // Ensure we have some long streaks for garden visualization
  // First, add specific habit with a very long streak (30+ days)
  habits.push(generateHabit(`habit-long-streak-1`, "streak", 30));
  habits.push(generateHabit(`habit-long-streak-2`, "streak", 21));
  habits.push(generateHabit(`habit-medium-streak`, "streak", 15));
  
  // Add a mix of other habits with various patterns
  for (let i = 0; i < count - 3; i++) {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    let streakLength = 0;
    
    if (pattern === "streak") {
      // For streak pattern, generate random streak lengths
      streakLength = Math.floor(Math.random() * 14) + 1; // 1-14 day streaks
    }
    
    habits.push(generateHabit(`habit-${i}`, pattern, streakLength));
  }
  
  return habits;
};

// Generate badge data
export const generateBadgeData = (habits: Habit[]): Badge[] => {
  // Sample badges based on habit achievement
  const badges: Badge[] = [
    {
      id: "first-habit",
      name: "First Step",
      description: "Create your first habit",
      icon: "✨",
      isUnlocked: habits.length > 0,
      unlockedAt: habits.length > 0 ? new Date(Date.now() - 1000000000).toISOString() : undefined
    },
    {
      id: "3-day-streak",
      name: "Momentum",
      description: "Maintain a 3-day streak",
      icon: "🔥",
      isUnlocked: habits.some(h => h.currentStreak >= 3),
      unlockedAt: habits.some(h => h.currentStreak >= 3) ? new Date(Date.now() - 800000000).toISOString() : undefined
    },
    {
      id: "7-day-streak",
      name: "Week Champion",
      description: "Complete a habit for 7 days straight",
      icon: "🏆",
      isUnlocked: habits.some(h => h.currentStreak >= 7),
      unlockedAt: habits.some(h => h.currentStreak >= 7) ? new Date(Date.now() - 500000000).toISOString() : undefined
    },
    {
      id: "first-reflection",
      name: "Mindful Moment",
      description: "Write your first habit reflection",
      icon: "🧘",
      isUnlocked: Math.random() > 0.5,
      unlockedAt: Math.random() > 0.5 ? new Date(Date.now() - 600000000).toISOString() : undefined
    },
    {
      id: "5-habits",
      name: "Habit Builder",
      description: "Track 5 different habits",
      icon: "🏗️",
      isUnlocked: habits.length >= 5,
      unlockedAt: habits.length >= 5 ? new Date(Date.now() - 400000000).toISOString() : undefined
    },
    {
      id: "consistency-master",
      name: "Consistency Master",
      description: "Complete habits on 10 consecutive days",
      icon: "🌟",
      isUnlocked: habits.some(h => h.currentStreak >= 10),
      unlockedAt: habits.some(h => h.currentStreak >= 10) ? new Date(Date.now() - 200000000).toISOString() : undefined
    },
    {
      id: "category-diversity",
      name: "Renaissance",
      description: "Maintain habits in 4 different categories",
      icon: "🎨",
      isUnlocked: new Set(habits.map(h => h.category)).size >= 4,
      unlockedAt: new Set(habits.map(h => h.category)).size >= 4 ? new Date(Date.now() - 300000000).toISOString() : undefined
    },
    {
      id: "garden-master",
      name: "Garden Master",
      description: "Grow a plant to full bloom (21+ day streak)",
      icon: "🌸",
      isUnlocked: habits.some(h => h.currentStreak >= 21),
      unlockedAt: habits.some(h => h.currentStreak >= 21) ? new Date(Date.now() - 100000000).toISOString() : undefined
    },
    {
      id: "monthly-habit",
      name: "Monthly Master",
      description: "Maintain a habit for 30+ days",
      icon: "📅",
      isUnlocked: habits.some(h => h.currentStreak >= 30),
      unlockedAt: habits.some(h => h.currentStreak >= 30) ? new Date().toISOString() : undefined
    }
  ];
  
  return badges;
};
