
import React from "react";
import { Progress } from "@/components/ui/progress";
import { UserStats } from "@/types/habit";

interface LevelProgressProps {
  stats: UserStats;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ stats }) => {
  // Calculate level and progress
  const calculateLevel = (points: number) => {
    // Simple formula: each level requires level*100 points
    let level = 1;
    let remainingPoints = points;
    
    while (remainingPoints >= level * 100) {
      remainingPoints -= level * 100;
      level++;
    }
    
    // Calculate progress to next level
    const pointsForNextLevel = level * 100;
    const progress = Math.round((remainingPoints / pointsForNextLevel) * 100);
    
    return { level, progress, remainingPoints, pointsForNextLevel };
  };
  
  const { level, progress, remainingPoints, pointsForNextLevel } = calculateLevel(stats.points);

  return (
    <section className="bg-card rounded-lg border p-6">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary">{level}</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold mb-1">Level {level}</h2>
          <p className="text-muted-foreground mb-4">Consistency Champion</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {level + 1}</span>
              <span>{remainingPoints} / {pointsForNextLevel}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.points}</p>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-500">{stats.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Longest Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{stats.totalCompletions}</p>
              <p className="text-xs text-muted-foreground">Completions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
