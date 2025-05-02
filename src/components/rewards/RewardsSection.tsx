
import React, { useState } from "react";
import { Gift, Medal, Trophy, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserStats } from "@/types/habit";
import { useToast } from "@/hooks/use-toast";

// Define the available rewards
export interface RewardOption {
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

interface RewardsSectionProps {
  stats: UserStats;
}

export const RewardsSection: React.FC<RewardsSectionProps> = ({ stats }) => {
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
    <section>
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Rewards
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
  );
};
