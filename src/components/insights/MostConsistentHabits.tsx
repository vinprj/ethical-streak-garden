
import React from "react";
import { cn } from "@/lib/utils";
import { Habit } from "@/types/habit";
import { Sun } from "lucide-react";

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
              "flex items-center justify-between border-b border-border pb-3 last:border-0 transition-all duration-500",
              isAnimated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}
            style={{ transitionDelay: `${250 + index * 150}ms` }}
          >
            <div>
              <p className="font-medium">{habit.name}</p>
              <p className="text-sm text-muted-foreground">
                {habit.category?.charAt(0).toUpperCase() + habit.category?.slice(1) || "Uncategorized"} • {habit.frequency}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Sun className={cn(
                "h-4 w-4",
                isAnimated && "animate-pulse-light"
              )} />
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
