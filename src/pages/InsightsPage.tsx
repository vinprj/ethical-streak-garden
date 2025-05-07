
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHabits } from "@/context/HabitContext";
import { useBuddy } from "@/context/BuddyContext";
import { BarChart3, Calendar, TrendingUp, Lightbulb, PieChart, Users } from "lucide-react";
import { WeeklyCompletionChart } from "@/components/insights/WeeklyCompletionChart";
import { MostConsistentHabits } from "@/components/insights/MostConsistentHabits";
import { CategoryDistribution } from "@/components/insights/CategoryDistribution";
import { SmartInsights } from "@/components/insights/SmartInsights";
import { InsightCard } from "@/components/insights/InsightCard";
import { 
  getWeeklyCompletionData, 
  getCategoryData, 
  getMostConsistentHabits, 
  getCategoryColor 
} from "@/utils/insightUtils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const InsightsPage: React.FC = () => {
  const { habits } = useHabits();
  const { buddies } = useBuddy();
  const navigate = useNavigate();
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

  // Get data for charts
  const weekData = getWeeklyCompletionData(habits);
  const categoryData = getCategoryData(activeHabits);
  const mostConsistentHabits = getMostConsistentHabits(activeHabits);

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
          <InsightCard 
            title="Weekly Completion" 
            description="Your daily habit completion rates" 
            icon={TrendingUp} 
            isAnimated={chartAnimated}
          >
            <WeeklyCompletionChart data={weekData} isAnimated={chartAnimated} />
          </InsightCard>
          
          {/* Most Consistent Habits */}
          <InsightCard 
            title="Most Consistent" 
            description="Habits with the longest streaks" 
            icon={Calendar} 
            isAnimated={chartAnimated}
            transitionDelay="100ms"
          >
            <MostConsistentHabits habits={mostConsistentHabits} isAnimated={chartAnimated} />
          </InsightCard>
          
          {/* Category Distribution */}
          <InsightCard 
            title="Habit Categories" 
            description="Distribution of your habit categories" 
            icon={PieChart} 
            isAnimated={chartAnimated}
            transitionDelay="200ms"
          >
            <CategoryDistribution 
              data={categoryData} 
              isAnimated={chartAnimated} 
              getCategoryColor={getCategoryColor} 
            />
          </InsightCard>
          
          {/* AI Insights */}
          <InsightCard 
            title="Smart Insights" 
            description="Personalized recommendations based on your data" 
            icon={Lightbulb} 
            isAnimated={chartAnimated}
            transitionDelay="300ms"
          >
            <SmartInsights activeHabits={activeHabits} />
          </InsightCard>
          
          {/* Habit Buddies Section */}
          <InsightCard
            title="Habit Buddies"
            description="Connect and track progress with friends"
            icon={Users}
            isAnimated={chartAnimated}
            transitionDelay="400ms"
            className="md:col-span-2"
          >
            <div className="p-1">
              {buddies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {buddies.map(buddy => (
                    <div key={buddy.id} className="bg-card rounded-lg border p-4 hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {buddy.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium">{buddy.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            Connected {new Date(buddy.connectionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-3">
                        <div className="flex justify-between">
                          <span>Shared habits:</span>
                          <span className="font-medium">{buddy.sharedHabits.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last active:</span>
                          <span className="font-medium">{new Date(buddy.lastActive).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full text-xs"
                        onClick={() => navigate('/buddies')}
                      >
                        View Buddy Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg p-6 text-center">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium mb-1">No Buddies Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with friends to track habits together and keep each other accountable
                  </p>
                  <Button 
                    variant="default" 
                    onClick={() => navigate('/buddies')}
                    className="flex items-center gap-1.5"
                  >
                    <Users className="h-4 w-4" />
                    Add Habit Buddies
                  </Button>
                </div>
              )}
            </div>
          </InsightCard>
        </div>
      </div>
    </AppLayout>
  );
};

export default InsightsPage;
