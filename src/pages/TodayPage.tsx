
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Filter, CheckCircle } from "lucide-react";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHabits } from "@/context/HabitContext";
import { formatDate } from "@/lib/utils/habitUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TodayPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { habits, filterCategory, setFilterCategory } = useHabits();
  
  // Get active habits (not archived)
  const activeHabits = habits.filter(h => !h.isArchived);
  
  // Get today's date
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Filter habits by category if filter is set
  const filteredHabits = filterCategory 
    ? activeHabits.filter(h => h.category === filterCategory)
    : activeHabits;
  
  // Daily habits are due today
  const dailyHabits = filteredHabits.filter(h => h.frequency === 'daily');
  
  // Weekly habits are due if they haven't been completed this week
  const weeklyHabits = filteredHabits.filter(h => {
    if (h.frequency !== 'weekly') return false;
    
    // Check if the habit has been completed this week
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const hasCompletedThisWeek = h.completedDates.some(dateStr => {
      const date = new Date(dateStr);
      return date >= weekStart && date <= today;
    });
    
    return !hasCompletedThisWeek;
  });
  
  // One-time habits that haven't been completed yet
  const oneTimeHabits = filteredHabits.filter(h => h.frequency === 'once' && h.completedDates.length === 0);
  
  // Completed habits today
  const completedHabits = filteredHabits.filter(h => h.completedDates.includes(todayStr));
  
  // All categories present in active habits
  const categories = Array.from(new Set(activeHabits.map(h => h.category)));

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <section>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{formatDate(today)}</h1>
                <p className="text-muted-foreground">Your habits for today</p>
              </div>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Habit
            </Button>
          </div>
        </section>
        
        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button 
              variant={filterCategory === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterCategory(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button 
                key={category} 
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        )}
        
        <Tabs defaultValue="due" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="due" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Due Today</span>
              <span className="ml-1 text-xs bg-primary/20 text-primary rounded-full px-2">
                {dailyHabits.length + weeklyHabits.length + oneTimeHabits.length - completedHabits.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
              <span className="ml-1 text-xs bg-primary/20 text-primary rounded-full px-2">
                {completedHabits.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="due" className="space-y-6">
            {/* Daily habits */}
            {dailyHabits.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-3">Daily Habits</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {dailyHabits
                    .filter(h => !h.completedDates.includes(todayStr))
                    .map((habit) => (
                      <HabitCard key={habit.id} habit={habit} />
                    ))}
                </div>
              </div>
            )}
            
            {/* Weekly habits */}
            {weeklyHabits.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-3">Weekly Habits</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {weeklyHabits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} />
                  ))}
                </div>
              </div>
            )}
            
            {/* One-time habits */}
            {oneTimeHabits.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-3">One-time Goals</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {oneTimeHabits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} />
                  ))}
                </div>
              </div>
            )}
            
            {dailyHabits.length === 0 && weeklyHabits.length === 0 && oneTimeHabits.length === 0 && (
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-sm text-muted-foreground mb-4">You've completed all your habits for today</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedHabits.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {completedHabits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No habits completed yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your habits to see them here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Habit Form Modal */}
      <HabitForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </AppLayout>
  );
};

export default TodayPage;
