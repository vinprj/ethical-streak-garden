
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Award, Gift, Shield } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { BadgeGrid } from "@/components/dashboard/BadgeGrid";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const RewardsPage: React.FC = () => {
  const { stats } = useHabits();

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
    <AppLayout>
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Your Rewards</h1>
              <p className="text-muted-foreground">Celebrate your achievements</p>
            </div>
          </div>
        </section>
        
        {/* Level and points section */}
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
        
        {/* Badges section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Badges
            </h2>
          </div>
          <BadgeGrid />
        </section>
        
        {/* Rewards section - placeholder for theme customizations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Theme Customizations
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="text-center py-4">
                <h3 className="font-medium">Ocean Theme</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-center">
                <div className="h-24 rounded-md bg-gradient-to-r from-blue-400 to-cyan-300 mb-4"></div>
                <p className="text-sm text-muted-foreground mb-4">Unlocks at 500 points</p>
                <Button variant="outline" disabled={stats.points < 500}>
                  {stats.points >= 500 ? "Apply Theme" : "Locked"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center py-4">
                <h3 className="font-medium">Forest Theme</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-center">
                <div className="h-24 rounded-md bg-gradient-to-r from-emerald-400 to-lime-300 mb-4"></div>
                <p className="text-sm text-muted-foreground mb-4">Unlocks at 1000 points</p>
                <Button variant="outline" disabled={stats.points < 1000}>
                  {stats.points >= 1000 ? "Apply Theme" : "Locked"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center py-4">
                <h3 className="font-medium">Sunset Theme</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-center">
                <div className="h-24 rounded-md bg-gradient-to-r from-orange-400 to-pink-300 mb-4"></div>
                <p className="text-sm text-muted-foreground mb-4">Unlocks at 2000 points</p>
                <Button variant="outline" disabled={stats.points < 2000}>
                  {stats.points >= 2000 ? "Apply Theme" : "Locked"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default RewardsPage;
