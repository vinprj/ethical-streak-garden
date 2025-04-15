
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { calculateCompletionPercentage, getCategoryColor, isHabitCompletedOnDate } from "@/lib/utils/habitUtils";
import { Habit } from "@/types/habit";
import { MoreVertical, Check, BarChart } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  showActions?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, showActions = true }) => {
  const { completeHabit, uncompleteHabit, archiveHabit, deleteHabit } = useHabits();
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = isHabitCompletedOnDate(habit, new Date());
  const completionPercentage = calculateCompletionPercentage(habit);
  
  const handleToggleCompletion = () => {
    if (isCompleted) {
      uncompleteHabit(habit.id, today);
    } else {
      completeHabit(habit.id, today);
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200", 
      isCompleted && "border-primary bg-primary/5"
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
              {habit.currentStreak} days
            </div>
          )}
        </div>
        <Button 
          size="sm"
          variant={isCompleted ? "outline" : "default"}
          className={cn(
            "h-9 gap-1",
            isCompleted && "border-primary text-primary hover:text-primary"
          )}
          onClick={handleToggleCompletion}
        >
          <Check className="h-4 w-4" />
          {isCompleted ? "Done" : "Complete"}
        </Button>
      </CardFooter>
    </Card>
  );
};
