
import React, { useState, useEffect } from "react";
import { Lightbulb, ArrowRight, Calendar, TrendingUp, Trophy } from "lucide-react";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SmartInsightsProps {
  activeHabits: Habit[];
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ activeHabits }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const navigate = useNavigate();
  
  // Calculate habit insights
  const morningHabits = activeHabits.filter(h => h.time === "morning").length;
  const eveningHabits = activeHabits.filter(h => h.time === "evening").length;
  const mostStreaked = activeHabits.length > 0 
    ? [...activeHabits].sort((a, b) => b.currentStreak - a.currentStreak)[0]
    : null;
  const missedHabits = activeHabits.filter(h => 
    new Date().getTime() - new Date(h.completedDates?.[h.completedDates.length - 1] || 0).getTime() > 86400000 * 2
  );
  
  const insights = [
    {
      title: "Time Pattern Insight",
      icon: <Calendar className="h-5 w-5" />,
      content: activeHabits.length > 0 
        ? `You tend to be more consistent with ${morningHabits > eveningHabits ? 'morning' : 'evening'} habits. Consider scheduling important habits during this time.`
        : "Add habits to get personalized insights about your daily patterns.",
      action: "Optimize Schedule",
      onClick: () => navigate('/today')
    },
    {
      title: "Streak Analysis",
      icon: <TrendingUp className="h-5 w-5" />,
      content: mostStreaked 
        ? `"${mostStreaked.name}" is your most consistent habit with a ${mostStreaked.currentStreak} day streak. Keep it up!`
        : "Start building streaks by completing habits consistently.",
      action: "View Streaks",
      onClick: () => navigate('/today')
    },
    {
      title: "Habit Recovery",
      icon: <Trophy className="h-5 w-5" />,
      content: missedHabits.length > 0
        ? `You have ${missedHabits.length} habit${missedHabits.length > 1 ? 's' : ''} that need attention. The longest neglected is "${missedHabits[0]?.name}".`
        : "Great job! You're keeping up with all your active habits.",
      action: "Recover Habits",
      onClick: () => navigate('/today')
    }
  ];
  
  // Auto-rotate insights every 10 seconds
  useEffect(() => {
    if (activeHabits.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveInsight(current => (current + 1) % insights.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [activeHabits.length, insights.length]);
  
  const currentInsight = insights[activeInsight];
  
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
          {currentInsight.icon || <Lightbulb className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-1">{currentInsight.title}</h3>
          <p className="text-sm text-muted-foreground">
            {currentInsight.content}
          </p>
          
          {activeHabits.length > 0 && (
            <div className="flex justify-between items-center mt-3">
              <button 
                className={cn(
                  "inline-flex items-center text-sm text-primary transition-all duration-300",
                  isHovering ? "gap-2" : "gap-1 hover:gap-2"
                )}
                onClick={currentInsight.onClick}
              >
                {currentInsight.action} <ArrowRight className={cn("h-4 w-4 transition-transform", isHovering ? "transform translate-x-1" : "")} />
              </button>
              
              <div className="flex gap-1">
                {insights.map((_, idx) => (
                  <button 
                    key={idx}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      activeInsight === idx ? "bg-primary w-3" : "bg-primary/30"
                    )}
                    onClick={() => setActiveInsight(idx)}
                    aria-label={`View insight ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
