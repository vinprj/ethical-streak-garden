
import { Habit } from "@/types/habit";
import { PlantData, PlantGrowthStage, PlantType } from "@/context/GardenContext";

// Generate plant data based on habits
export const generatePlantFromHabit = (habit: Habit): PlantData => {
  // Map habit categories to plant types
  const categoryToPlantType: Record<string, PlantType> = {
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
  const categoryToColor: Record<string, string> = {
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

// Generate plant data for all habits
export const generatePlantData = (habits: Habit[]): PlantData[] => {
  return habits
    .filter(habit => habit.currentStreak > 0) // Only create plants for habits with active streaks
    .map(habit => generatePlantFromHabit(habit));
};
