
import React from "react";
import { cn } from "@/lib/utils";
import { Habit } from "@/types/habit";

interface MostConsistentHabitsProps {
  habits: Habit[];
  isAnimated: boolean;
}

export const MostConsistentHabits: React.FC<MostConsistentHabitsProps> = ({ 
  habits, 
  isAnimated 
}) => {
  return (
    <div className="space-y-4 mt-4">
      {habits.length > 0 ? (
        habits.map((habit, index) => (
          <div
            key={habit.id}
            className={cn(
              "flex items-center justify-between border-b border-border pb-3 last:border-0 transition-all duration-300",
              isAnimated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}
            style={{ transitionDelay: `${150 + index * 100}ms` }}
          >
            <div>
              <p className="font-medium">{habit.name}</p>
              <p className="text-sm text-muted-foreground">
                {habit.category?.charAt(0).toUpperCase() + habit.category?.slice(1) || "Uncategorized"} • {habit.frequency}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse-light">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <span className="font-medium">
                {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No streaks yet. Start completing your habits daily!</p>
        </div>
      )}
    </div>
  );
};
