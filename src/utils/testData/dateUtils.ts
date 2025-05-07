
// Date utility functions for test data generation

// Random date within the past 60 days
export const getRandomDateInPast = (daysAgo = 60): string => {
  const date = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  date.setDate(date.getDate() - randomDays);
  return date.toISOString().split('T')[0];
};

// Random date array based on a completion pattern (for streaks)
export const generateDateArray = (
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
export const calculateStreak = (completedDates: string[]): { current: number, longest: number } => {
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
