
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHabits } from "@/context/HabitContext";
import { BarChart3, Calendar, TrendingUp, Lightbulb, PieChart } from "lucide-react";
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

const InsightsPage: React.FC = () => {
  const { habits } = useHabits();
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
        </div>
      </div>
    </AppLayout>
  );
};

export default InsightsPage;
