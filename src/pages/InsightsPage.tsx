
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, TrendingUp, Lightbulb, PieChart, ArrowRight } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const InsightsPage: React.FC = () => {
  const { habits, stats } = useHabits();
  const [chartAnimated, setChartAnimated] = useState(false);
  
  // Get active habits (not archived)
  const activeHabits = habits.filter(h => !h.isArchived);
  
  useEffect(() => {
    // Trigger chart animation after a short delay
    const timer = setTimeout(() => {
      setChartAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate weekly completion rates with proper date handling
  const getWeeklyCompletionData = () => {
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count habits completed on this day
      const completedCount = habits.filter(h => 
        h.completedDates.includes(dateStr)
      ).length;
      
      // Count daily habits that should have been completed
      const totalDailyHabits = habits.filter(h => 
        !h.isArchived && (h.frequency === 'daily' || 
          (h.frequency === 'weekly' && date.getDay() === 0) || 
          (h.frequency === 'custom' && h.customDays.includes(dayNames[date.getDay()].toLowerCase())))
      ).length;
      
      const percentage = totalDailyHabits > 0 ? Math.round((completedCount / totalDailyHabits) * 100) : 0;
      
      weekData.push({
        day: dayNames[date.getDay()],
        percentage,
        completed: completedCount,
        total: totalDailyHabits,
        isEmpty: totalDailyHabits === 0
      });
    }
    
    return weekData;
  };

  const weekData = getWeeklyCompletionData();

  // Get category distribution data
  const getCategoryData = () => {
    const categories: Record<string, number> = {};
    
    activeHabits.forEach(habit => {
      const category = habit.category || 'other';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };
  
  const categoryData = getCategoryData();
  
  // Get most consistent habits
  const getMostConsistentHabits = () => {
    return [...activeHabits]
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 3);
  };

  const mostConsistentHabits = getMostConsistentHabits();

  // Category colors
  const CATEGORY_COLORS = {
    health: '#10b981', // emerald-500
    fitness: '#3b82f6', // blue-500 
    mindfulness: '#a78bfa', // purple-400
    productivity: '#f59e0b', // amber-500
    learning: '#06b6d4', // cyan-500 
    creativity: '#ec4899', // pink-500
    social: '#6366f1', // indigo-500
    other: '#94a3b8' // slate-400
  };
  
  // Get color for category
  const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category.toLowerCase() as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.other;
  };

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
          <Card className={cn("transition-all duration-500", 
            chartAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Weekly Completion</CardTitle>
              </div>
              <CardDescription>Your daily habit completion rates</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]} 
                    />
                    <Tooltip 
                      formatter={(value, name, props) => {
                        if (props.payload.isEmpty) {
                          return ["No habits scheduled", ""];
                        }
                        return [`${value}% (${props.payload.completed}/${props.payload.total})`, "Completion"];
                      }}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar 
                      dataKey="percentage" 
                      fill="var(--primary)" 
                      radius={[4, 4, 0, 0]} 
                      isAnimationActive={chartAnimated}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    >
                      {weekData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isEmpty ? "var(--muted)" : "var(--primary)"} 
                          opacity={entry.isEmpty ? 0.3 : 1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Most Consistent Habits */}
          <Card className={cn("transition-all duration-500", 
            chartAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
            style={{ transitionDelay: "100ms" }}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Most Consistent</CardTitle>
              </div>
              <CardDescription>Habits with the longest streaks</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {mostConsistentHabits.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {mostConsistentHabits.map((habit, index) => (
                    <div
                      key={habit.id}
                      className={cn(
                        "flex items-center justify-between border-b border-border pb-3 last:border-0 transition-all duration-300",
                        chartAnimated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No streaks yet. Start completing your habits daily!</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Category Distribution */}
          <Card className={cn("transition-all duration-500", 
            chartAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
            style={{ transitionDelay: "200ms" }}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                <CardTitle>Habit Categories</CardTitle>
              </div>
              <CardDescription>Distribution of your habit categories</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[240px] flex items-center justify-center">
                {categoryData.length > 0 ? (
                  <div className="w-full flex flex-wrap justify-around items-center gap-2">
                    {categoryData.map((category, index) => (
                      <div 
                        key={category.name}
                        className={cn(
                          "flex flex-col items-center p-2 rounded-lg transition-all duration-500",
                          chartAnimated ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        )}
                        style={{ 
                          transitionDelay: `${200 + index * 100}ms`,
                          borderLeft: `3px solid ${getCategoryColor(category.name.toLowerCase())}`
                        }}
                      >
                        <div className="text-2xl font-bold">{category.value}</div>
                        <div className="text-sm text-muted-foreground">{category.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No habit categories found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* AI Insights (placeholder) */}
          <Card 
            className={cn("transition-all duration-500", 
            chartAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
            style={{ transitionDelay: "300ms" }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Smart Insights</CardTitle>
              </div>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-muted/30 rounded-lg p-6 mt-2">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse-light">
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
                      <button className="inline-flex items-center mt-3 text-sm text-primary hover:underline">
                        View detailed analysis <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    )}
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
