
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserStats } from "@/types/habit";
import { RewardOption } from "./RewardsSection";

interface RewardCardProps {
  reward: RewardOption;
  stats: UserStats;
  isActive: boolean;
  isClaimed: boolean;
  onClaim: (reward: RewardOption) => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ 
  reward, 
  stats, 
  isActive, 
  isClaimed,
  onClaim
}) => {
  // Get button status text based on reward state
  const getButtonText = () => {
    if (isClaimed) {
      return "Already Used";
    }
    
    if (isActive) {
      return "Active";
    }
    
    return reward.action;
  };
  
  return (
    <Card className={isActive ? "ring-2 ring-primary" : ""}>
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
            variant={isActive || isClaimed ? "outline" : "default"} 
            disabled={stats.points < reward.pointsRequired || 
                    (isClaimed && reward.id === "streak-recovery")}
            onClick={() => onClaim(reward)}
            className="w-full"
          >
            {getButtonText()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
