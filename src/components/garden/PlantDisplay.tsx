
import React from "react";
import { Habit } from "@/types/habit";
import { useGardenContext, PlantGrowthStage } from "@/context/GardenContext";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Clock, X, Sparkles, Leaf } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlantDisplayProps {
  habit: Habit;
  viewType: "garden" | "recent";
}

export const PlantDisplay: React.FC<PlantDisplayProps> = ({ habit, viewType }) => {
  const { getPlantByHabitId, gardenAnimationsLevel, highContrastGarden } = useGardenContext();
  const plant = getPlantByHabitId(habit.id);
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.completedDates.includes(today);
  
  const getGrowthLabel = (stage: PlantGrowthStage): string => {
    switch (stage) {
      case 'seed': return 'Just planted';
      case 'sprout': return 'Sprouting';
      case 'growing': return 'Growing';
      case 'mature': return 'Maturing';
      case 'flowering': return 'Flowering';
      case 'fruiting': return 'Fruiting';
      default: return 'Just planted';
    }
  };

  const getPlantEmoji = (type: string, stage: PlantGrowthStage): string => {
    if (stage === 'seed') return '🌱';
    if (stage === 'sprout') return '🌿';
    
    switch (type) {
      case 'flower': return stage === 'fruiting' ? '🌸' : stage === 'flowering' ? '🌷' : '🌿';
      case 'tree': return stage === 'fruiting' ? '🌳' : stage === 'flowering' ? '🌲' : '🌱';
      case 'herb': return stage === 'fruiting' ? '🌿' : stage === 'flowering' ? '🪴' : '🌱';
      case 'vegetable': return stage === 'fruiting' ? '🥕' : stage === 'flowering' ? '🥬' : '🌱';
      case 'fruit': return stage === 'fruiting' ? '🍎' : stage === 'flowering' ? '🌸' : '🌱';
      case 'succulent': return stage === 'fruiting' ? '🌵' : stage === 'flowering' ? '🪴' : '🌱';
      case 'fern': return stage === 'fruiting' ? '🌿' : stage === 'flowering' ? '🌿' : '🌱';
      default: return '🌱';
    }
  };
  
  // Generate special effects like butterflies or birds
  const renderSpecialEffects = () => {
    if (!plant?.specialEffects?.length || gardenAnimationsLevel === 'none') return null;
    
    return plant.specialEffects.map((effect, index) => {
      switch (effect) {
        case 'butterfly':
          return (
            <div 
              key={`${habit.id}-effect-${index}`}
              className={cn(
                "absolute top-1 right-2 text-lg z-10 garden-particle", 
                gardenAnimationsLevel === 'standard' ? "animate-butterfly-flutter" : ""
              )}
            >
              🦋
            </div>
          );
        case 'bird':
          return (
            <div 
              key={`${habit.id}-effect-${index}`}
              className={cn(
                "absolute top-0 right-8 text-lg z-10 garden-particle", 
                gardenAnimationsLevel === 'standard' ? "animate-bird-fly" : ""
              )}
            >
              🐦
            </div>
          );
        default:
          return null;
      }
    });
  };

  const renderStatusIndicator = () => {
    if (isCompletedToday) {
      return (
        <div className="absolute top-2 right-2 bg-green-500/90 rounded-full p-1 shadow-md">
          <Check className="w-4 h-4 text-white" />
        </div>
      );
    }
    
    if (habit.frequency === 'daily') {
      return (
        <div className="absolute top-2 right-2 bg-amber-500/90 rounded-full p-1 shadow-md">
          <Clock className="w-4 h-4 text-white" />
        </div>
      );
    }
    
    return null;
  };

  // No plant yet
  if (!plant) {
    return (
      <Card className={cn(
        "flex flex-col items-center justify-center p-4 min-h-[220px] border-dashed border-2 text-center",
        highContrastGarden ? "border-primary" : "border-border/70"
      )}>
        <Leaf className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium">Plant will grow here</p>
        <p className="text-xs text-muted-foreground mt-1">Complete habit to start growing</p>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Card 
            className={cn(
              "relative overflow-hidden transition-all duration-500 garden-plant", 
              highContrastGarden ? "high-contrast garden-plant" : "",
              "hover:shadow-md border-2",
              isCompletedToday ? "border-green-500/50" : "border-transparent"
            )}
          >
            {renderStatusIndicator()}
            {renderSpecialEffects()}
            
            <div className="flex flex-col items-center justify-between h-[220px] p-4">
              <div className="text-center">
                <h3 className="font-semibold truncate max-w-full">{habit.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{habit.category}</p>
              </div>
              
              <div 
                className={cn(
                  "text-6xl sm:text-7xl my-4 transition-all duration-700", 
                  gardenAnimationsLevel === 'standard' && plant.growthStage !== 'seed' ? "animate-pulse-light" : ""
                )}
              >
                {getPlantEmoji(plant.type, plant.growthStage)}
              </div>
              
              <div className="text-center w-full">
                <div className="bg-muted h-1.5 w-full rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ 
                      width: `${Math.min((plant.completionStreak / 21) * 100, 100)}%`,
                      transition: gardenAnimationsLevel !== 'none' ? 'width 1s ease-out' : 'none'
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className={cn(
                    "text-muted-foreground px-1.5 py-0.5 rounded",
                    plant.growthStage === 'fruiting' ? "bg-primary/10 text-primary" : ""
                  )}>
                    {getGrowthLabel(plant.growthStage)}
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <span className="text-muted-foreground">{plant.completionStreak} days</span>
                    {plant.lastWatered && new Date(plant.lastWatered).toDateString() === new Date().toDateString() && (
                      <Sparkles className="h-3 w-3 text-amber-500" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="p-4 max-w-xs">
          <div className="space-y-2">
            <h4 className="font-semibold">{habit.name}</h4>
            <p className="text-sm">{plant.type.charAt(0).toUpperCase() + plant.type.slice(1)} • {getGrowthLabel(plant.growthStage)}</p>
            <p className="text-sm text-muted-foreground">
              {plant.completionStreak} day streak • {habit.completedDates.length} total completions
            </p>
            {isCompletedToday && <div className="text-green-500 text-sm font-medium">Completed today</div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
