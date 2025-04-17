
import { PlantGrowthStage, PlantType } from "@/context/GardenContext";
import { Habit } from "@/types/habit";

// Plant type mapping based on habit category
export const getPlantTypeForCategory = (category: string): PlantType => {
  switch(category) {
    case 'health': return 'vegetable';
    case 'fitness': return 'tree';
    case 'mindfulness': return 'flower';
    case 'productivity': return 'herb';
    case 'learning': return 'fern';
    case 'creativity': return 'fruit';
    case 'social': return 'succulent';
    default: return 'flower';
  }
};

// Get next growth stage
export const getNextGrowthStage = (current: PlantGrowthStage, streak: number): PlantGrowthStage => {
  if (streak < 2) return 'seed';
  if (streak < 5) return 'sprout';
  if (streak < 10) return 'growing';
  if (streak < 15) return 'mature';
  if (streak < 21) return 'flowering';
  return 'fruiting';
};

// Get a color based on habit category
export const getColorForHabit = (category: string): string => {
  switch(category) {
    case 'health': return 'emerald';
    case 'fitness': return 'blue';
    case 'mindfulness': return 'purple';
    case 'productivity': return 'amber';
    case 'learning': return 'cyan';
    case 'creativity': return 'pink';
    case 'social': return 'indigo';
    default: return 'emerald';
  }
};

export const getGrowthLabel = (stage: PlantGrowthStage): string => {
  switch (stage) {
    case 'seed': return 'Just planted';
    case 'sprout': return 'Sprouting';
    case 'growing': return 'Growing';
    case 'mature': return 'Maturing';
    case 'flowering': return 'Flowering';
    case 'fruiting': return 'Fruiting';
    default: return 'Just planted';
  }
};

export const getPlantEmoji = (type: string, stage: PlantGrowthStage): string => {
  if (stage === 'seed') return '🌱';
  if (stage === 'sprout') return '🌿';
  
  switch (type) {
    case 'flower': return stage === 'fruiting' ? '🌸' : stage === 'flowering' ? '🌷' : '🌿';
    case 'tree': return stage === 'fruiting' ? '🌳' : stage === 'flowering' ? '🌲' : '🌱';
    case 'herb': return stage === 'fruiting' ? '🌿' : stage === 'flowering' ? '🪴' : '🌱';
    case 'vegetable': return stage === 'fruiting' ? '🥕' : stage === 'flowering' ? '🥬' : '🌱';
    case 'fruit': return stage === 'fruiting' ? '🍎' : stage === 'flowering' ? '🌸' : '🌱';
    case 'succulent': return stage === 'fruiting' ? '🌵' : stage === 'flowering' ? '🪴' : '🌱';
    case 'fern': return stage === 'fruiting' ? '🌿' : stage === 'flowering' ? '🌿' : '🌱';
    default: return '🌱';
  }
};
