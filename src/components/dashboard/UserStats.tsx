
import React from "react";
import { Award, Flame, CheckCircle2, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHabits } from "@/context/HabitContext";

export const UserStats: React.FC = () => {
  const { stats, habits } = useHabits();

  // Calculate weekly completion rate
  const totalHabitsThisWeek = habits.filter(h => !h.isArchived && h.frequency === 'daily').length * 7 + 
    habits.filter(h => !h.isArchived && h.frequency === 'weekly').length;
  
  const completionsThisWeek = habits
    .filter(h => !h.isArchived)
    .reduce((acc, habit) => {
      const today = new Date();
      const weekStart = new Date();
      weekStart.setDate(today.getDate() - today.getDay());
      
      const thisWeekCompletions = habit.completedDates.filter(date => {
        const completionDate = new Date(date);
        return completionDate >= weekStart;
      });
      
      return acc + thisWeekCompletions.length;
    }, 0);
  
  const weeklyCompletionRate = totalHabitsThisWeek > 0 
    ? Math.round((completionsThisWeek / totalHabitsThisWeek) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Completions</p>
            <h3 className="text-2xl font-bold">{stats.totalCompletions}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Flame className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
            <h3 className="text-2xl font-bold">{stats.currentStreak} days</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Award className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Your Points</p>
            <h3 className="text-2xl font-bold">{stats.points}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Weekly Progress</p>
            <p className="text-sm font-bold">{weeklyCompletionRate}%</p>
          </div>
          <Progress value={weeklyCompletionRate} className="h-2" />
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>{completionsThisWeek} of {totalHabitsThisWeek} completed</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
