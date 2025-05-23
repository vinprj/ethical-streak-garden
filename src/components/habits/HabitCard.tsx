
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { calculateCompletionPercentage, getCategoryColor, isHabitCompletedOnDate } from "@/lib/utils/habitUtils";
import { Habit } from "@/types/habit";
import { MoreVertical, Check, BarChart, Leaf } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { useGardenContext } from "@/context/GardenContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface HabitCardProps {
  habit: Habit;
  showActions?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, showActions = true }) => {
  const { completeHabit, uncompleteHabit, archiveHabit, deleteHabit } = useHabits();
  const { handleHabitCompletion, isGardenEnabled, getPlantByHabitId } = useGardenContext();
  const navigate = useNavigate();
  
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = isHabitCompletedOnDate(habit, new Date());
  const completionPercentage = calculateCompletionPercentage(habit);
  const plantData = getPlantByHabitId(habit.id);
  
  const handleToggleCompletion = () => {
    if (isCompleted) {
      uncompleteHabit(habit.id, today);
      toast("Habit marked incomplete", {
        description: "Keep going, you got this!",
      });
    } else {
      completeHabit(habit.id, today);
      
      // Update garden when habit is completed
      if (isGardenEnabled) {
        handleHabitCompletion(habit);
        
        // Add a garden-specific toast message occasionally
        if (Math.random() > 0.7) {
          toast("Your garden is growing!", {
            description: "Check your Habit Garden to see your progress",
          });
        } else {
          toast("Habit completed!", {
            description: `Great job maintaining your "${habit.name}" habit!`,
          });
        }
      } else {
        toast("Habit completed!", {
          description: `Great job maintaining your "${habit.name}" habit!`,
        });
      }
    }
  };
  
  // Navigate to garden view for this specific plant
  const viewInGarden = () => {
    navigate('/garden');
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300", 
      isCompleted ? "border-primary bg-primary/5" : "hover:border-primary/30",
      "transform hover:scale-[1.01] hover:shadow-sm animate-fade-in"
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor(habit.category)}`}></div>
          <h3 className="font-medium">{habit.name}</h3>
        </div>
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit habit</DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart className="mr-2 h-4 w-4" /> View insights
              </DropdownMenuItem>
              
              {isGardenEnabled && plantData && (
                <DropdownMenuItem onClick={viewInGarden}>
                  <Leaf className="mr-2 h-4 w-4" /> View in garden
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => archiveHabit(habit.id)}>
                Archive habit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => deleteHabit(habit.id)}
              >
                Delete habit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {habit.description && (
          <p className="text-sm text-muted-foreground mb-3">{habit.description}</p>
        )}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Weekly progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-1.5" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">
            {habit.frequency}
          </div>
          {habit.currentStreak > 0 && (
            <div className="text-xs font-medium flex items-center gap-1 text-amber-500">
              <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0C7.5 0 7.5 0.846 7.5 1.5C7.5 2.154 7.846 2.5 8.5 2.5C9.154 2.5 9.5 2.154 9.5 1.5C9.5 0.846 9.5 0 9.5 0C9.5 0 10.991 0.096 12 1C13.009 1.904 13 3.5 13 3.5C13 3.5 13.846 3.5 14.5 3.5C15.154 3.5 15.5 3.846 15.5 4.5C15.5 5.154 15.154 5.5 14.5 5.5C13.846 5.5 13 5.5 13 5.5C13 5.5 13.009 7.096 12 8C10.991 8.904 9.5 9 9.5 9C9.5 9 9.5 10.09 9.5 11.5C9.5 12.91 8.5 13 7.5 13C6.5 13 5.5 12.91 5.5 11.5C5.5 10.09 5.5 9 5.5 9C5.5 9 4.009 8.904 3 8C1.991 7.096 2 5.5 2 5.5C2 5.5 1.154 5.5 0.5 5.5C-0.154 5.5 -0.5 5.154 -0.5 4.5C-0.5 3.846 -0.154 3.5 0.5 3.5C1.154 3.5 2 3.5 2 3.5C2 3.5 1.991 1.904 3 1C4.009 0.096 5.5 0 5.5 0" fill="currentColor" />
              </svg>
              <span className="animate-pulse-light">{habit.currentStreak} days</span>
            </div>
          )}
          
          {/* Small plant indicator if it exists in the garden */}
          {isGardenEnabled && plantData && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-5 w-5 p-0" 
              onClick={viewInGarden}
            >
              <Leaf className="h-3 w-3 text-primary" />
            </Button>
          )}
        </div>
        <Button 
          size="sm"
          variant={isCompleted ? "outline" : "default"}
          className={cn(
            "h-9 gap-1 transition-all duration-300",
            isCompleted ? "border-primary text-primary hover:text-primary" : "",
            "hover:scale-105"
          )}
          onClick={handleToggleCompletion}
        >
          <Check className={cn("h-4 w-4", isCompleted ? "animate-scale-in" : "")} />
          {isCompleted ? "Done" : "Complete"}
        </Button>
      </CardFooter>
    </Card>
  );
};
