
import React from "react";
import { useHabits } from "@/context/HabitContext";
import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const BadgeGrid: React.FC = () => {
  const { badges } = useHabits();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {badges.map((badge) => (
        <Card
          key={badge.id}
          className={cn(
            "p-4 flex flex-col items-center text-center transition-all",
            badge.isUnlocked
              ? "bg-card hover:shadow-md"
              : "bg-muted/30 grayscale opacity-60"
          )}
        >
          <div className={cn(
            "h-14 w-14 rounded-full flex items-center justify-center text-2xl mb-2",
            badge.isUnlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {badge.isUnlocked ? badge.icon : <Award className="h-6 w-6" />}
          </div>
          <h3 className="font-medium text-sm">{badge.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
          {badge.isUnlocked && badge.unlockedAt && (
            <p className="text-xs text-primary mt-2">Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}</p>
          )}
        </Card>
      ))}
    </div>
  );
};
