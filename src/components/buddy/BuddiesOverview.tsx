
import React from "react";
import { useBuddy } from "@/context/BuddyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Award, Calendar, Clock, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const BuddiesOverview: React.FC = () => {
  const { buddies } = useBuddy();
  const navigate = useNavigate();

  if (buddies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="h-12 w-12 text-muted-foreground/30 mb-2" />
        <h3 className="text-lg font-medium mb-2">No Buddies Yet</h3>
        <p className="text-muted-foreground max-w-md mb-4">
          Connect with friends to share your habit journey and motivate each other to build lasting habits
        </p>
        <Button onClick={() => navigate('/buddies')} variant="default" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Find Habit Buddies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buddies.map(buddy => (
          <BuddyCard key={buddy.id} buddy={buddy} />
        ))}
      </div>
    </div>
  );
};

interface BuddyCardProps {
  buddy: any;
}

const BuddyCard: React.FC<BuddyCardProps> = ({ buddy }) => {
  // Generate random statistics for demo purposes
  const daysConnected = Math.floor((new Date().getTime() - new Date(buddy.connectionDate).getTime()) / (1000 * 60 * 60 * 24));
  const maxStreak = Math.floor(Math.random() * 30) + 5;
  const currentStreak = Math.floor(Math.random() * maxStreak);
  const completionRate = Math.floor(Math.random() * 40) + 60;
  const lastActive = formatDistanceToNow(new Date(buddy.lastActive), { addSuffix: true });
  
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/40">
      <CardHeader className="bg-muted/30 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 h-9 w-9 rounded-full flex items-center justify-center">
              {buddy.avatar ? 
                <img src={buddy.avatar} alt={buddy.name} className="rounded-full" /> :
                <User className="h-4 w-4 text-primary" />
              }
            </div>
            <CardTitle className="text-base">{buddy.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{lastActive}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Current Streak</span>
            </div>
            <div className="text-lg font-semibold">{currentStreak} days</div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Days Connected</span>
            </div>
            <div className="text-lg font-semibold">{daysConnected} days</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Habit Completion</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-1.5" 
              style={{backgroundColor: "rgba(41, 171, 135, 0.2)"}} />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Streak Progress</span>
              <span className="font-medium">{currentStreak}/{maxStreak} days</span>
            </div>
            <Progress value={currentStreak / maxStreak * 100} className="h-1.5" 
              style={{backgroundColor: "rgba(41, 171, 135, 0.2)"}} />
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            Send Message
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Award className="h-3.5 w-3.5 mr-1.5" />
            Encourage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Add missing imports
import { UserPlus } from "lucide-react";
