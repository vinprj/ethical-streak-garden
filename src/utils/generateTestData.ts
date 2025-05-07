import { Habit, HabitCategory, Badge, HabitFrequency } from "@/types/habit";
import { PlantData, PlantGrowthStage, PlantType } from "@/context/GardenContext";
import { Buddy, Message } from "@/types/buddy";

// Sample user profiles for testing
const userProfiles = [
  { id: "user-1", name: "Alex Chen", email: "alex@example.com" },
  { id: "user-2", name: "Taylor Kim", email: "taylor@example.com" },
  { id: "user-3", name: "Jordan Smith", email: "jordan@example.com" },
  { id: "user-4", name: "Sam Rodriguez", email: "sam@example.com" },
];

// Realistic habit names by category
const habitNamesByCategory: Record<HabitCategory, string[]> = {
  health: [
    "Drink 8 glasses of water",
    "Take vitamins",
    "Sleep 8 hours",
    "Eat a vegetable with each meal",
    "Floss teeth",
    "Meditation for 10 minutes",
    "No processed sugar",
    "Track calories"
  ],
  fitness: [
    "10,000 steps",
    "30-minute workout",
    "Stretching routine",
    "Go for a run",
    "Strength training",
    "Yoga session",
    "Take the stairs",
    "Sports practice"
  ],
  mindfulness: [
    "Morning meditation",
    "Gratitude journal",
    "Deep breathing exercise",
    "Digital detox hour",
    "Mindful eating",
    "Evening reflection",
    "Nature time",
    "Read spiritual text"
  ],
  productivity: [
    "Inbox zero",
    "Plan tomorrow today",
    "No social media until noon",
    "Complete MIT (Most Important Task)",
    "Pomodoro session",
    "Update task list",
    "Clear desk at end of day",
    "Track time usage"
  ],
  learning: [
    "Read 20 pages",
    "Learn new vocabulary",
    "Practice language skills",
    "Watch educational video",
    "Solve a puzzle",
    "Take online course lesson",
    "Study session",
    "Teach someone something new"
  ],
  creativity: [
    "Sketch for 15 minutes",
    "Write 500 words",
    "Play musical instrument",
    "Try new recipe",
    "Creative brainstorming",
    "Photography practice",
    "Dance session",
    "DIY project progress"
  ],
  social: [
    "Call a friend",
    "Family time",
    "Random act of kindness",
    "Attend community event",
    "Volunteer hour",
    "Write a thank you note",
    "Network connection",
    "Group activity"
  ],
  other: [
    "Home maintenance task",
    "Budget review",
    "Self-care activity",
    "Organize one area",
    "Digital cleanup",
    "Plan weekly meals",
    "Car maintenance",
    "Pet care routine"
  ]
};

// Reflection notes for completions
const reflectionNotes = [
  "Felt great doing this today!",
  "Struggled a bit but managed to complete it.",
  "This is becoming easier with practice.",
  "Almost skipped but glad I didn't.",
  "Need to adjust the difficulty of this habit.",
  "Enjoyed this more than expected.",
  "Found a better way to approach this habit.",
  "This is becoming second nature now.",
  "Had to push myself but worth it.",
  "Looking forward to continuing this streak.",
  "Not feeling the benefits yet, but staying consistent.",
  "This habit is really making a difference in my day.",
  "Noticed improvements since starting this habit.",
  "Combined this with another activity to save time.",
  "Challenging day but kept the streak alive!"
];

// Mood options for completions
const moodOptions = ["great", "good", "neutral", "bad", "terrible"];

// Random date within the past 60 days
const getRandomDateInPast = (daysAgo = 60): string => {
  const date = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  date.setDate(date.getDate() - randomDays);
  return date.toISOString().split('T')[0];
};

// Random date array based on a completion pattern (for streaks)
const generateDateArray = (
  pattern: "consistent" | "occasional" | "weekend" | "streak" | "multiple" | "recent",
  streakLength = 0
): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  switch (pattern) {
    case "consistent":
      // Almost every day for the past 30 days
      for (let i = 0; i < 30; i++) {
        // 90% chance of completion each day
        if (Math.random() < 0.9) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          dates.push(date.toISOString().split('T')[0]);
        }
      }
      break;
      
    case "occasional":
      // About twice a week for the past 30 days
      for (let i = 0; i < 30; i++) {
        // 30% chance of completion each day
        if (Math.random() < 0.3) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          dates.push(date.toISOString().split('T')[0]);
        }
      }
      break;
      
    case "weekend":
      // Primarily weekend completions
      for (let i = 0; i < 60; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        // Higher chance on weekends (0 = Sunday, 6 = Saturday)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        if ((isWeekend && Math.random() < 0.85) || (!isWeekend && Math.random() < 0.15)) {
          dates.push(date.toISOString().split('T')[0]);
        }
      }
      break;
      
    case "streak":
      // Current unbroken streak of specified length
      for (let i = 0; i < streakLength; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
      break;
      
    case "multiple":
      // Random pattern over 60 days
      for (let i = 0; i < 60; i++) {
        if (Math.random() < 0.4) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          dates.push(date.toISOString().split('T')[0]);
        }
      }
      break;
      
    case "recent":
      // Only started recently (last 10 days)
      for (let i = 0; i < 10; i++) {
        if (Math.random() < 0.7) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          dates.push(date.toISOString().split('T')[0]);
        }
      }
      break;
  }
  
  // Sort dates in ascending order
  return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
};

// Calculate streak based on completion dates
const calculateStreak = (completedDates: string[]): { current: number, longest: number } => {
  if (completedDates.length === 0) return { current: 0, longest: 0 };
  
  // Sort dates in descending order
  const sortedDates = [...completedDates].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Calculate current streak
  let currentStreak = 1;
  let currentDate = new Date(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    const diffTime = currentDate.getTime() - prevDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  let longestStreak = 1;
  let tempStreak = 1;
  
  const chronologicalDates = [...sortedDates].reverse();
  for (let i = 1; i < chronologicalDates.length; i++) {
    const currentDate = new Date(chronologicalDates[i]);
    const prevDate = new Date(chronologicalDates[i - 1]);
    
    const diffTime = currentDate.getTime() - prevDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  return {
    current: currentStreak,
    longest: Math.max(longestStreak, currentStreak)
  };
};

// Generate a single habit with realistic data
const generateHabit = (
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

// Generate plant data based on habits
const generatePlantFromHabit = (habit: Habit): PlantData => {
  // Map habit categories to plant types
  const categoryToPlantType: Record<HabitCategory, PlantType> = {
    health: "vegetable",
    fitness: "tree",
    mindfulness: "flower",
    productivity: "herb",
    learning: "fern",
    creativity: "fruit",
    social: "succulent",
    other: "flower"
  };

  // Determine plant growth stage based on streak
  let growthStage: PlantGrowthStage = "seed";
  if (habit.currentStreak >= 21) {
    growthStage = "fruiting";
  } else if (habit.currentStreak >= 15) {
    growthStage = "flowering";
  } else if (habit.currentStreak >= 10) {
    growthStage = "mature";
  } else if (habit.currentStreak >= 5) {
    growthStage = "growing";
  } else if (habit.currentStreak >= 2) {
    growthStage = "sprout";
  }

  // Determine plant color based on category
  const categoryToColor: Record<HabitCategory, string> = {
    health: "emerald",
    fitness: "blue",
    mindfulness: "purple",
    productivity: "amber",
    learning: "cyan",
    creativity: "pink",
    social: "indigo",
    other: "green"
  };

  // Add special effects based on streak milestones
  const specialEffects: string[] = [];
  if (habit.currentStreak >= 15) {
    specialEffects.push("butterfly");
  }
  if (habit.currentStreak >= 21) {
    specialEffects.push("bird");
  }

  // Generate last watered date based on most recent completion
  const lastWatered = habit.completedDates.length > 0 
    ? new Date(habit.completedDates[habit.completedDates.length - 1]).toISOString()
    : null;

  return {
    habitId: habit.id,
    type: categoryToPlantType[habit.category],
    growthStage,
    color: categoryToColor[habit.category],
    lastWatered,
    completionStreak: habit.currentStreak,
    specialEffects
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

// Generate plant data for all habits
export const generatePlantData = (habits: Habit[]): PlantData[] => {
  return habits
    .filter(habit => habit.currentStreak > 0) // Only create plants for habits with active streaks
    .map(habit => generatePlantFromHabit(habit));
};

// Generate buddy data for testing
export const generateBuddyData = (): { buddies: Buddy[], pendingRequests: Buddy[], messages: Message[] } => {
  // Demo buddies
  const buddies: Buddy[] = [
    {
      id: "buddy-1",
      name: "Alex Chen",
      connectionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      sharedHabits: ["habit-long-streak-1", "habit-long-streak-2"]
    },
    {
      id: "buddy-2",
      name: "Jordan Smith",
      connectionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      sharedHabits: ["habit-medium-streak"],
      isAnonymous: true
    },
    {
      id: "buddy-3",
      name: "Taylor Kim",
      connectionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      lastActive: new Date().toISOString(), // Active now
      sharedHabits: ["habit-0", "habit-1", "habit-2"]
    }
  ];

  // Pending buddy requests
  const pendingRequests: Buddy[] = [
    {
      id: "buddy-request-1",
      name: "Sam Rodriguez",
      connectionDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      sharedHabits: []
    },
    {
      id: "buddy-request-2",
      name: "Jamie Wong",
      connectionDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      sharedHabits: []
    }
  ];

  // Generate sample messages
  const messages: Message[] = [
    {
      id: "msg-1",
      fromId: "buddy-1",
      toId: "me",
      content: "Your meditation streak is impressive! How do you stay so consistent?",
      type: "text",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg-2",
      fromId: "me",
      toId: "buddy-1",
      content: "Thanks! I find mornings work best for me. Setting a specific time helps a lot.",
      type: "text",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
      read: true
    },
    {
      id: "msg-3",
      fromId: "buddy-2",
      toId: "me",
      content: "Keep it up!",
      type: "encouragement",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg-4",
      fromId: "buddy-3",
      toId: "me",
      content: "You're on a roll with your workout habit!",
      type: "encouragement",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: "msg-5",
      fromId: "buddy-3",
      toId: "me",
      content: "I just unlocked the '7-Day Streak' badge. Working toward the monthly one next!",
      type: "text",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ];

  return { buddies, pendingRequests, messages };
};

// Main function to generate all test data
export const generateAllTestData = () => {
  const habits = generateTestHabits(16);
  const badges = generateBadgeData(habits);
  const plants = generatePlantData(habits);
  const { buddies, pendingRequests, messages } = generateBuddyData();
  
  return {
    habits,
    badges,
    plants,
    buddies,
    pendingRequests,
    messages
  };
};
