
import { generateTestHabits, generateBadgeData } from './habitGenerator';
import { generatePlantData } from './plantGenerator';

// Main function to generate all test data (excluding buddy data)
export const generateAllTestData = () => {
  const habits = generateTestHabits(16);
  const badges = generateBadgeData(habits);
  const plants = generatePlantData(habits);
  
  return {
    habits,
    badges,
    plants
  };
};

export * from './habitGenerator';
export * from './plantGenerator';
export * from './buddyGenerator';
export * from './dateUtils';
export * from './constants';
