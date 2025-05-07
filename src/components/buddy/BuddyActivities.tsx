
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Check, Clock, Award, CalendarCheck, Zap, Target } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { formatDistanceToNow, format } from "date-fns";

export const BuddyActivities: React.FC = () => {
  const { buddies } = useBuddy();
  
  // Generate mock activity data for demo purposes
  const activities = generateMockActivities(buddies);
  
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="h-12 w-12 text-muted-foreground/30 mb-2" />
        <h3 className="text-lg font-medium mb-2">No Activities</h3>
        <p className="text-muted-foreground max-w-md">
          Recent activities from your buddies will appear here
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Activities</h3>
        <span className="text-xs text-muted-foreground">Synced: {format(new Date(), "h:mm a")}</span>
      </div>
      
      <Card>
        <ScrollArea className="h-[400px]">
          <CardContent className="p-4">
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Separator />}
                  <div className="pt-3 first:pt-0">
                    <div className="flex gap-3">
                      <div>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-${activity.color}/10`}>
                          {activity.icon}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.buddyName}</span>
                          {' '}{activity.action}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {activity.detail && (
                      <div className="mt-2 ml-11 text-sm text-muted-foreground bg-muted/40 p-2 rounded-md">
                        {activity.detail}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
      
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Only approved activities that your buddies have chosen to share will appear here. Your privacy settings control what information is shared with your buddies.
        </p>
      </div>
    </div>
  );
};

// Helper function to generate mock activity data
function generateMockActivities(buddies: any[]) {
  if (buddies.length === 0) return [];
  
  const activityTypes = [
    { 
      action: "completed a habit", 
      icon: <Check className="h-4 w-4 text-green-500" />,
      color: "green",
      detailFn: () => `"${["Morning Meditation", "Evening Run", "Read for 30 minutes", "Drink Water"][Math.floor(Math.random() * 4)]}"`
    },
    { 
      action: "reached a new streak milestone", 
      icon: <Award className="h-4 w-4 text-amber-500" />,
      color: "amber",
      detailFn: () => `${Math.floor(Math.random() * 10) + 5}-day streak for "${["Daily Exercise", "Journaling", "Coding Practice", "Healthy Eating"][Math.floor(Math.random() * 4)]}"`
    },
    { 
      action: "created a new habit", 
      icon: <Zap className="h-4 w-4 text-blue-500" />,
      color: "blue",
      detailFn: () => `"${["Learn Spanish", "Meditate Daily", "Practice Guitar", "Take Vitamins"][Math.floor(Math.random() * 4)]}"`
    },
    { 
      action: "completed all habits today", 
      icon: <Target className="h-4 w-4 text-purple-500" />,
      color: "purple",
      detailFn: () => `Completed ${Math.floor(Math.random() * 3) + 3} habits today`
    },
    { 
      action: "sent an encouragement", 
      icon: <CalendarCheck className="h-4 w-4 text-cyan-500" />,
      color: "cyan",
      detailFn: () => null
    }
  ];
  
  const activities = [];
  
  // Generate 1-3 activities per buddy
  for (const buddy of buddies) {
    const numActivities = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numActivities; i++) {
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      // Random time within the last 48 hours
      const hoursAgo = Math.floor(Math.random() * 48);
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      
      activities.push({
        buddyName: buddy.name,
        action: activityType.action,
        icon: activityType.icon,
        color: activityType.color,
        timestamp,
        detail: activityType.detailFn ? activityType.detailFn() : null
      });
    }
  }
  
  // Sort by timestamp (newest first)
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
