
import React from "react";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";

interface SmartInsightsProps {
  activeHabits: Habit[];
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ activeHabits }) => {
  const [isHovering, setIsHovering] = React.useState(false);
  
  return (
    <div 
      className="bg-muted/30 rounded-lg p-6 mt-2 transition-all duration-300 hover:bg-muted/40"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary",
          isHovering ? "animate-pulse" : "animate-pulse-light"
        )}>
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Habit Optimization</h3>
          <p className="text-sm text-muted-foreground">
            {activeHabits.length > 0 
              ? "Based on your completion patterns, you seem to be more consistent in the morning. Consider scheduling important habits earlier in the day."
              : "Add a few habits to get personalized insights about your patterns and consistency."}
          </p>
          {activeHabits.length > 0 && (
            <button 
              className={cn(
                "inline-flex items-center mt-3 text-sm text-primary transition-all duration-300",
                isHovering ? "gap-2" : "gap-1 hover:gap-2"
              )}
            >
              View detailed analysis <ArrowRight className={cn("h-4 w-4 transition-transform", isHovering ? "transform translate-x-1" : "")} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
