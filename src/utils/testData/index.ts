
import { generateTestHabits, generateBadgeData } from './habitGenerator';
import { generatePlantData } from './plantGenerator';
import { generateBuddyData } from './buddyGenerator';

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

export * from './habitGenerator';
export * from './plantGenerator';
export * from './buddyGenerator';
export * from './dateUtils';
export * from './constants';
