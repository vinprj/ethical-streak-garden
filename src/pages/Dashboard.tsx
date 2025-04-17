
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Award, Sparkles } from "lucide-react";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHabits } from "@/context/HabitContext";
import { BadgeGrid } from "@/components/dashboard/BadgeGrid";
import { UserStats } from "@/components/dashboard/UserStats";
import { useThemeContext } from "@/hooks/use-theme";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { habits, badges } = useHabits();
  const { theme } = useThemeContext();
  
  // Animation effect when dashboard loads
  useEffect(() => {
    // Shorter timeout for better UX
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Get active habits (not archived)
  const activeHabits = habits.filter(h => !h.isArchived);
  
  // Get recently completed habits
  const today = new Date().toISOString().split('T')[0];
  const recentlyCompletedHabits = activeHabits.filter(
    habit => habit.completedDates.includes(today)
  );
  
  // Get habits by category for the overview section
  const healthHabits = activeHabits.filter(h => h.category === 'health');
  const mindfulnessHabits = activeHabits.filter(h => h.category === 'mindfulness');
  const productivityHabits = activeHabits.filter(h => h.category === 'productivity');
  
  // Get unlocked badges
  const unlockedBadges = badges.filter(b => b.isUnlocked);

  // Component skeleton for loading state
  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-8">
          <section>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-32 w-full mb-6" />
          </section>
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </section>
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </section>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={`flex flex-col gap-8 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Welcome section with user stats */}
        <section className="transition-all duration-500" style={{ transitionDelay: "100ms" }}>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome to HabitFlow</h1>
              <p className="text-muted-foreground">Track your progress and build lasting habits</p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="gap-1">
              <PlusCircle className="h-4 w-4" />
              New Habit
            </Button>
          </div>
          
          {/* User Stats Component */}
          {activeHabits.length > 0 && (
            <div className="mb-6">
              <UserStats />
            </div>
          )}
        </section>

        {/* Today's overview */}
        <section className="transition-all duration-500" style={{ transitionDelay: "150ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Today's Overview</h2>
          </div>
          
          {activeHabits.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recentlyCompletedHabits.length > 0 ? (
                <>
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Completed Today ({recentlyCompletedHabits.length}/{activeHabits.length})</p>
                  </div>
                  {recentlyCompletedHabits.slice(0, 3).map((habit) => (
                    <HabitCard key={habit.id} habit={habit} />
                  ))}
                </>
              ) : (
                <div className="col-span-full bg-muted/30 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No habits completed yet today</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start your day by completing a habit</p>
                  <Button variant="outline" onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Create your first habit
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No habits created yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first habit to get started</p>
              <Button onClick={() => setIsFormOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> Create your first habit
              </Button>
            </div>
          )}
        </section>

        {/* Badges section */}
        {unlockedBadges.length > 0 && (
          <section className="transition-all duration-500" style={{ transitionDelay: "200ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Your Badges</h2>
            </div>
            <BadgeGrid />
          </section>
        )}

        {/* Habit categories */}
        <section className="transition-all duration-500" style={{ transitionDelay: "250ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Habit Categories</h2>
          </div>
          
          {activeHabits.length > 0 ? (
            <div className="grid gap-6">
              {healthHabits.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Health</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {healthHabits.slice(0, 3).map((habit) => (
                      <HabitCard key={habit.id} habit={habit} />
                    ))}
                  </div>
                </div>
              )}
              
              {mindfulnessHabits.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Mindfulness</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {mindfulnessHabits.slice(0, 3).map((habit) => (
                      <HabitCard key={habit.id} habit={habit} />
                    ))}
                  </div>
                </div>
              )}
              
              {productivityHabits.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Productivity</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {productivityHabits.slice(0, 3).map((habit) => (
                      <HabitCard key={habit.id} habit={habit} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>
      </div>
      
      {/* Habit Form Modal */}
      <HabitForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </AppLayout>
  );
};

export default Dashboard;
