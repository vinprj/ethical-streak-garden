
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Award, Gift, Shield, Star, Medal, Trophy } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { BadgeGrid } from "@/components/dashboard/BadgeGrid";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

// Define the available rewards
interface RewardOption {
  name: string;
  description: string;
  icon: React.ReactNode;
  pointsRequired: number;
  action: string;
  id: string;
}

const rewardOptions: RewardOption[] = [
  {
    id: "rest-day",
    name: "Rest Day Pass",
    description: "Take a day off without breaking your streak",
    icon: <Medal className="h-8 w-8 text-amber-500" />,
    pointsRequired: 500,
    action: "Claim Rest Day",
  },
  {
    id: "streak-recovery",
    name: "Streak Recovery",
    description: "Restore a lost streak (one time use)",
    icon: <Trophy className="h-8 w-8 text-emerald-500" />,
    pointsRequired: 1000,
    action: "Recover Streak",
  },
  {
    id: "double-points",
    name: "Double Points Day",
    description: "Earn double points for all completions today",
    icon: <Star className="h-8 w-8 text-blue-500" />,
    pointsRequired: 750,
    action: "Activate",
  },
];

const RewardsPage: React.FC = () => {
  const { stats } = useHabits();
  const { toast } = useToast();
  const [claimedRewards, setClaimedRewards] = useState<string[]>(() => {
    // Get claimed rewards from local storage if exists
    const saved = localStorage.getItem('claimedRewards');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeRewards, setActiveRewards] = useState<string[]>(() => {
    // Get active rewards from local storage if exists
    const saved = localStorage.getItem('activeRewards');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate level and progress
  const calculateLevel = (points: number) => {
    // Simple formula: each level requires level*100 points
    let level = 1;
    let remainingPoints = points;
    
    while (remainingPoints >= level * 100) {
      remainingPoints -= level * 100;
      level++;
    }
    
    // Calculate progress to next level
    const pointsForNextLevel = level * 100;
    const progress = Math.round((remainingPoints / pointsForNextLevel) * 100);
    
    return { level, progress, remainingPoints, pointsForNextLevel };
  };
  
  const { level, progress, remainingPoints, pointsForNextLevel } = calculateLevel(stats.points);

  // Claim a reward
  const handleClaimReward = (reward: RewardOption) => {
    if (stats.points < reward.pointsRequired) {
      toast({
        title: "Not Enough Points",
        description: `You need ${reward.pointsRequired - stats.points} more points to claim this reward.`,
        variant: "destructive",
      });
      return;
    }

    // Logic for different reward types
    switch (reward.id) {
      case "rest-day":
        // Add to active rewards
        if (!activeRewards.includes(reward.id)) {
          const newActiveRewards = [...activeRewards, reward.id];
          setActiveRewards(newActiveRewards);
          localStorage.setItem('activeRewards', JSON.stringify(newActiveRewards));
          
          toast({
            title: "Reward Claimed",
            description: "Rest Day Pass is now available in your Today view",
            variant: "default",
          });
        } else {
          toast({
            title: "Already Active",
            description: "You already have an active Rest Day Pass",
            variant: "default",
          });
        }
        break;
        
      case "streak-recovery":
        // Add to claimed rewards since it's one-time use
        if (!claimedRewards.includes(reward.id)) {
          const newClaimedRewards = [...claimedRewards, reward.id];
          setClaimedRewards(newClaimedRewards);
          localStorage.setItem('claimedRewards', JSON.stringify(newClaimedRewards));
          
          toast({
            title: "Streak Recovered",
            description: "Your longest streak has been restored",
            variant: "default",
          });
        } else {
          toast({
            title: "Already Used",
            description: "You've already used the Streak Recovery reward",
            variant: "default",
          });
        }
        break;
        
      case "double-points":
        // Add to active rewards
        if (!activeRewards.includes(reward.id)) {
          const newActiveRewards = [...activeRewards, reward.id];
          setActiveRewards(newActiveRewards);
          localStorage.setItem('activeRewards', JSON.stringify(newActiveRewards));
          
          // Set expiry time (end of today)
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          localStorage.setItem('doublePointsExpiry', today.toISOString());
          
          toast({
            title: "Double Points Activated",
            description: "You'll earn double points for the rest of today",
            variant: "default",
          });
        } else {
          toast({
            title: "Already Active",
            description: "Double Points is already active for today",
            variant: "default",
          });
        }
        break;
        
      default:
        toast({
          title: "Reward Claimed",
          description: `${reward.name} has been claimed successfully!`,
          variant: "default",
        });
    }
  };

  const isRewardActive = (rewardId: string) => {
    return activeRewards.includes(rewardId);
  };
  
  const isRewardClaimed = (rewardId: string) => {
    return claimedRewards.includes(rewardId);
  };
  
  // Get button status text based on reward state
  const getButtonText = (reward: RewardOption) => {
    if (isRewardClaimed(reward.id)) {
      return "Already Used";
    }
    
    if (isRewardActive(reward.id)) {
      return "Active";
    }
    
    return reward.action;
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Your Rewards</h1>
              <p className="text-muted-foreground">Celebrate your achievements</p>
            </div>
          </div>
        </section>
        
        {/* Level and points section */}
        <section className="bg-card rounded-lg border p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">{level}</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold mb-1">Level {level}</h2>
              <p className="text-muted-foreground mb-4">Consistency Champion</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {level + 1}</span>
                  <span>{remainingPoints} / {pointsForNextLevel}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{stats.points}</p>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-500">{stats.longestStreak}</p>
                  <p className="text-xs text-muted-foreground">Longest Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-500">{stats.totalCompletions}</p>
                  <p className="text-xs text-muted-foreground">Completions</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Badges section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Badges
            </h2>
          </div>
          <BadgeGrid />
        </section>
        
        {/* Rewards section - practical rewards instead of themes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Practical Rewards
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewardOptions.map((reward) => (
              <Card key={reward.id} className={isRewardActive(reward.id) ? "ring-2 ring-primary" : ""}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <h3 className="font-medium text-lg">{reward.name}</h3>
                  <div className="rounded-full p-2 bg-muted/50">
                    {reward.icon}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    {reward.description}
                  </p>
                  
                  <div className="mt-auto">
                    <p className="text-sm text-muted-foreground mb-3">
                      {stats.points >= reward.pointsRequired 
                        ? "Available to claim" 
                        : `Requires ${reward.pointsRequired} points (${reward.pointsRequired - stats.points} more needed)`}
                    </p>
                    
                    <Button 
                      variant={isRewardActive(reward.id) || isRewardClaimed(reward.id) ? "outline" : "default"} 
                      disabled={stats.points < reward.pointsRequired || 
                              (isRewardClaimed(reward.id) && reward.id === "streak-recovery")}
                      onClick={() => handleClaimReward(reward)}
                      className="w-full"
                    >
                      {getButtonText(reward)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default RewardsPage;
