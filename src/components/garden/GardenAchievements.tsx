
import React from "react";
import { Habit } from "@/types/habit";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Lock, Check, Flower, Bird, Butterfly, Trees } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (habits: Habit[]) => boolean;
  progress: (habits: Habit[]) => number;
  reward: string;
}

interface GardenAchievementsProps {
  habits: Habit[];
}

export const GardenAchievements: React.FC<GardenAchievementsProps> = ({ habits }) => {
  // Define achievements
  const achievements: Achievement[] = [
    {
      id: "first-plant",
      name: "First Sprout",
      description: "Complete your first habit streak of 3 days",
      icon: <Sprout className="h-5 w-5" />,
      condition: (habits) => habits.some(h => h.currentStreak >= 3),
      progress: (habits) => {
        const maxStreak = Math.max(...habits.map(h => h.currentStreak), 0);
        return Math.min(100, (maxStreak / 3) * 100);
      },
      reward: "🌱 New seed type unlocked"
    },
    {
      id: "butterfly-garden",
      name: "Butterfly Garden",
      description: "Maintain any habit for 15 days",
      icon: <Butterfly className="h-5 w-5" />,
      condition: (habits) => habits.some(h => h.currentStreak >= 15),
      progress: (habits) => {
        const maxStreak = Math.max(...habits.map(h => h.currentStreak), 0);
        return Math.min(100, (maxStreak / 15) * 100);
      },
      reward: "🦋 Butterflies will visit your garden"
    },
    {
      id: "bird-sanctuary",
      name: "Bird Sanctuary",
      description: "Maintain any habit for 21 days",
      icon: <Bird className="h-5 w-5" />,
      condition: (habits) => habits.some(h => h.currentStreak >= 21),
      progress: (habits) => {
        const maxStreak = Math.max(...habits.map(h => h.currentStreak), 0);
        return Math.min(100, (maxStreak / 21) * 100);
      },
      reward: "🐦 Birds will visit your garden"
    },
    {
      id: "diverse-garden",
      name: "Diverse Garden",
      description: "Maintain habits across 4 different categories",
      icon: <Flower className="h-5 w-5" />,
      condition: (habits) => {
        const categories = new Set(habits.filter(h => h.currentStreak > 0).map(h => h.category));
        return categories.size >= 4;
      },
      progress: (habits) => {
        const categories = new Set(habits.filter(h => h.currentStreak > 0).map(h => h.category));
        return Math.min(100, (categories.size / 4) * 100);
      },
      reward: "🌈 Special rainbow plant unlocked"
    },
    {
      id: "forest",
      name: "Personal Forest",
      description: "Grow 10 plants to maturity (15+ day streaks)",
      icon: <Trees className="h-5 w-5" />,
      condition: (habits) => habits.filter(h => h.currentStreak >= 15).length >= 10,
      progress: (habits) => {
        const maturePlants = habits.filter(h => h.currentStreak >= 15).length;
        return Math.min(100, (maturePlants / 10) * 100);
      },
      reward: "🌳 Forest background option unlocked"
    },
  ];

  // Calculate achievements
  const achievementStatus = achievements.map(achievement => ({
    ...achievement,
    isUnlocked: achievement.condition(habits),
    progressValue: achievement.progress(habits)
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievementStatus.map((achievement) => (
          <Card 
            key={achievement.id}
            className={cn(
              "transition-all duration-300",
              achievement.isUnlocked ? "border-primary bg-primary/5" : "opacity-85"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    achievement.isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center">
                      {achievement.name}
                      {achievement.isUnlocked && <Check className="h-4 w-4 text-primary ml-2" />}
                    </h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
                {!achievement.isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>
              
              <div className="mt-3">
                <Progress value={achievement.progressValue} className="h-1.5 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{achievement.isUnlocked ? "Completed" : `${Math.round(achievement.progressValue)}%`}</span>
                  <span className={achievement.isUnlocked ? "text-primary" : ""}>
                    {achievement.reward}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {achievementStatus.every(a => !a.isUnlocked) && (
        <div className="text-center text-muted-foreground p-4 italic">
          Complete your habits consistently to unlock garden achievements!
        </div>
      )}
    </div>
  );
};

// Export Sprout icon for use in component
export const Sprout = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 20h10" />
    <path d="M12 20v-6" />
    <path d="M8.75 14c.14-.66.78-1.77 2.65-2a3 3 0 0 1 3.33 2.5" />
    <path d="M5.75 11.95a5.25 5.25 0 0 1 7.5-7.45" />
    <path d="M18.25 11.95a5.25 5.25 0 0 0-7.5-7.45" />
  </svg>
);
