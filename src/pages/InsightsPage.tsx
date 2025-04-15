
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, TrendingUp, Lightbulb } from "lucide-react";

const InsightsPage: React.FC = () => {
  const { habits, stats } = useHabits();
  
  // Get active habits (not archived)
  const activeHabits = habits.filter(h => !h.isArchived);
  
  // Calculate weekly completion rates
  const getTrendData = () => {
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count habits completed on this day
      const completedCount = habits.filter(h => h.completedDates.includes(dateStr)).length;
      const totalDailyHabits = habits.filter(h => !h.isArchived && h.frequency === 'daily').length;
      
      const percentage = totalDailyHabits > 0 ? Math.round((completedCount / totalDailyHabits) * 100) : 0;
      
      weekData.push({
        day: dayNames[date.getDay()],
        percentage,
      });
    }
    
    return weekData;
  };

  const weekData = getTrendData();

  // Get most consistent habits
  const getMostConsistentHabits = () => {
    return [...activeHabits]
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 3);
  };

  const mostConsistentHabits = getMostConsistentHabits();

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Insights</h1>
              <p className="text-muted-foreground">Visual data to track your progress</p>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Trend */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Weekly Trend</CardTitle>
              </div>
              <CardDescription>Your daily completion rates</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-60 flex items-end justify-between gap-1">
                {weekData.map((data, index) => (
                  <div
                    key={index}
                    className="relative w-full flex flex-col items-center gap-2"
                  >
                    <div className="w-full flex justify-center">
                      <div
                        className="w-5/6 bg-primary rounded-t"
                        style={{
                          height: `${Math.max(4, data.percentage)}%`,
                          opacity: data.percentage > 0 ? 1 : 0.3,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {data.day}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Most Consistent Habits */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Most Consistent</CardTitle>
              </div>
              <CardDescription>Habits with the longest streaks</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {mostConsistentHabits.length > 0 ? (
                <div className="space-y-4">
                  {mostConsistentHabits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{habit.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {habit.frequency}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.5 0C7.5 0 7.5 0.846 7.5 1.5C7.5 2.154 7.846 2.5 8.5 2.5C9.154 2.5 9.5 2.154 9.5 1.5C9.5 0.846 9.5 0 9.5 0C9.5 0 10.991 0.096 12 1C13.009 1.904 13 3.5 13 3.5C13 3.5 13.846 3.5 14.5 3.5C15.154 3.5 15.5 3.846 15.5 4.5C15.5 5.154 15.154 5.5 14.5 5.5C13.846 5.5 13 5.5 13 5.5C13 5.5 13.009 7.096 12 8C10.991 8.904 9.5 9 9.5 9C9.5 9 9.5 10.09 9.5 11.5C9.5 12.91 8.5 13 7.5 13C6.5 13 5.5 12.91 5.5 11.5C5.5 10.09 5.5 9 5.5 9C5.5 9 4.009 8.904 3 8C1.991 7.096 2 5.5 2 5.5C2 5.5 1.154 5.5 0.5 5.5C-0.154 5.5 -0.5 5.154 -0.5 4.5C-0.5 3.846 -0.154 3.5 0.5 3.5C1.154 3.5 2 3.5 2 3.5C2 3.5 1.991 1.904 3 1C4.009 0.096 5.5 0 5.5 0" fill="currentColor" />
                        </svg>
                        <span className="font-medium">
                          {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No streaks yet. Start completing your habits daily!</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* AI Insights (placeholder) */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Smart Insights</CardTitle>
              </div>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Habit Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                      {activeHabits.length > 0 
                        ? "Based on your completion patterns, you seem to be more consistent in the morning. Consider scheduling important habits earlier in the day."
                        : "Add a few habits to get personalized insights about your patterns and consistency."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default InsightsPage;
