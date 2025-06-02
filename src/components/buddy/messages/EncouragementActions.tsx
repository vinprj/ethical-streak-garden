
import React from "react";
import { Button } from "@/components/ui/button";
import { Award, Heart, Trophy, Star, Target, Zap } from "lucide-react";

interface EncouragementActionsProps {
  onSendEncouragement: (message: string) => void;
}

const encouragementOptions = [
  {
    icon: Award,
    message: "Amazing progress! You're crushing your goals! 🏆",
    label: "Celebrate Achievement"
  },
  {
    icon: Heart,
    message: "Your dedication is truly inspiring! Keep going! 💝",
    label: "Show Support"
  },
  {
    icon: Trophy,
    message: "You're setting such a great example! Well done! 🥇",
    label: "Acknowledge Excellence"
  },
  {
    icon: Star,
    message: "Your consistency is absolutely stellar! ⭐",
    label: "Praise Consistency"
  },
  {
    icon: Target,
    message: "You're hitting your targets perfectly! Keep it up! 🎯",
    label: "Goal Achievement"
  },
  {
    icon: Zap,
    message: "Your energy and commitment are contagious! ⚡",
    label: "Energy Boost"
  }
];

export const EncouragementActions: React.FC<EncouragementActionsProps> = ({ 
  onSendEncouragement 
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {encouragementOptions.map((option, index) => {
        const IconComponent = option.icon;
        return (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-auto p-3 flex flex-col items-center gap-1 text-xs"
            onClick={() => onSendEncouragement(option.message)}
          >
            <IconComponent className="h-4 w-4" />
            <span className="text-center leading-tight">{option.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
