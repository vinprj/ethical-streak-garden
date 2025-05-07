
// This file is maintained for backward compatibility
// Import and re-export everything from the modular system
import {
  generateAllTestData,
  generateTestHabits,
  generateBadgeData,
  generatePlantData,
  generateBuddyData,
  calculateStreak,
  generateDateArray,
  getRandomDateInPast
} from './testData';

export {
  generateAllTestData,
  generateTestHabits,
  generateBadgeData,
  generatePlantData,
  generateBuddyData,
  calculateStreak,
  generateDateArray,
  getRandomDateInPast
};

// For backward compatibility
export default generateAllTestData;
