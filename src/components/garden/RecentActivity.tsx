
import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Habit } from "@/types/habit";
import { format, parseISO } from "date-fns";

interface RecentActivityProps {
  habits: Habit[];
}

interface ActivityItem {
  date: string;
  habitName: string;
  habitId: string;
  formattedDate: string;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ habits }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Get all completed dates for all habits and sort them by most recent
    const allActivities: ActivityItem[] = [];
    
    habits.forEach(habit => {
      const habitActivities = habit.completedDates.map(date => ({
        date,
        habitName: habit.name,
        habitId: habit.id,
        formattedDate: format(parseISO(date), 'MMM d')
      }));
      
      allActivities.push(...habitActivities);
    });
    
    // Sort by date (newest first)
    allActivities.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // Get the most recent 10 activities
    setActivities(allActivities.slice(0, 10));
  }, [habits]);

  if (activities.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No recent activity to display.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Complete habits to see your activity here!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <Card key={`${activity.habitId}-${activity.date}-${index}`} className="overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-2 bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{activity.habitName}</p>
              <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                <span>{activity.formattedDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
