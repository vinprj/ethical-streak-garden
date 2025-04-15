import React, { useState, useEffect } from "react";
import { Habit } from "@/types/habit";
import { useGardenContext, PlantGrowthStage, PlantType } from "@/context/GardenContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, Flower, Trees, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryColor } from "@/lib/utils/habitUtils";

interface PlantDisplayProps {
  habit: Habit;
  viewType: "garden" | "recent";
}

export const PlantDisplay: React.FC<PlantDisplayProps> = ({ habit, viewType }) => {
  const { getPlantByHabitId, gardenAnimationsLevel, ecoMode, highContrastGarden } = useGardenContext();
  const [isGrowing, setIsGrowing] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  
  const plant = getPlantByHabitId(habit.id);
  const growthStage = plant?.growthStage || "seed";
  const plantType = plant?.type || "flower";
  const plantColor = plant?.color || "emerald";
  const specialEffects = plant?.specialEffects || [];
  const showAnimations = gardenAnimationsLevel !== "none" && !ecoMode;
  
  const getGrowthPercentage = (): number => {
    const streakToMaxGrowth = 30;
    return Math.min(100, Math.round((habit.currentStreak / streakToMaxGrowth) * 100));
  };
  
  useEffect(() => {
    if (showAnimations && plant?.lastWatered) {
      const lastWateredDate = new Date(plant.lastWatered);
      const now = new Date();
      const timeDiff = now.getTime() - lastWateredDate.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 1) {
        setIsGrowing(true);
        setTimeout(() => setIsGrowing(false), 3000);
        
        if (specialEffects.length > 0) {
          setTimeout(() => {
            setShowEffect(true);
            setTimeout(() => setShowEffect(false), 5000);
          }, 1000);
        }
      }
    }
  }, [plant?.lastWatered, showAnimations, specialEffects]);

  const getPlantEmoji = (): string => {
    if (growthStage === "seed") return "🌱";
    
    switch (plantType) {
      case "flower":
        return growthStage === "flowering" || growthStage === "fruiting" ? "🌸" : "🌿";
      case "tree":
        return growthStage === "fruiting" ? "🌳" : "🌲";
      case "herb":
        return growthStage === "flowering" ? "🌿" : "🍃";
      case "vegetable":
        return growthStage === "fruiting" ? "🥦" : "🌱";
      case "fruit":
        return growthStage === "fruiting" ? "🍎" : "🌱";
      case "succulent":
        return "🌵";
      case "fern":
        return "🌿";
      default:
        return "🌱";
    }
  };
  
  const getPlantIcon = () => {
    if (growthStage === "seed") {
      return <Sprout className="h-12 w-12 text-muted-foreground" />;
    }
    
    switch (plantType) {
      case "flower":
        return <Flower className={`h-16 w-16 text-${plantColor}-500`} />;
      case "tree":
        return <Trees className={`h-16 w-16 text-${plantColor}-500`} />;
      default:
        return <Leaf className={`h-16 w-16 text-${plantColor}-500`} />;
    }
  };
  
  const renderSpecialEffect = () => {
    if (showEffect && specialEffects.includes("butterfly")) {
      return (
        <div className="absolute top-0 right-0 animate-float text-2xl">
          🦋
        </div>
      );
    }
    if (showEffect && specialEffects.includes("bird")) {
      return (
        <div className="absolute top-0 left-0 animate-float text-2xl">
          🐦
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-500 relative",
      "flex flex-col items-center justify-center p-6",
      isGrowing ? "scale-105" : "",
      highContrastGarden ? "border-2" : "",
      habit.currentStreak > 0 ? "bg-gradient-to-b from-transparent to-muted/20" : ""
    )}>
      <div className={cn(
        "mb-4 relative flex justify-center items-center w-full",
        isGrowing ? "animate-subtle-bounce" : ""
      )}>
        <div className="text-4xl mb-2">
          {getPlantIcon()}
        </div>
        {renderSpecialEffect()}
      </div>
      
      <div className="text-center mb-2 w-full">
        <h3 className="font-semibold mb-1">{habit.name}</h3>
        <div className="flex justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor(habit.category)}`}></div>
          <span className="text-xs text-muted-foreground capitalize">{habit.category}</span>
        </div>
      </div>
      
      <div className="w-full mt-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{growthStage}</span>
          <span>{habit.currentStreak} days</span>
        </div>
        <Progress 
          value={getGrowthPercentage()} 
          className={cn("h-1.5", isGrowing ? "animate-pulse-light" : "")}
        />
      </div>
    </Card>
  );
};
