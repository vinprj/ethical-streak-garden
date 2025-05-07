
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/context/HabitContext";
import { useNavigate } from "react-router-dom";

export const HabitSearch: React.FC = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const activeHabits = habits.filter(h => !h.isArchived);

  const handleSelect = (habitId: string) => {
    setOpen(false);
    // Navigate to a detailed view or highlight the habit
    navigate(`/today?highlight=${habitId}`);
  };
  
  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="relative h-9 w-9 md:w-64 md:justify-start md:px-3 md:py-2"
          >
            <Search className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline-flex">Search habits...</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 w-[300px] md:w-[400px]" 
          align="start" 
          side="bottom" 
          sideOffset={5}
          alignOffset={0}
          avoidCollisions={true}
        >
          <Command>
            <CommandInput placeholder="Search habits..." />
            <CommandList>
              <CommandEmpty>No habits found.</CommandEmpty>
              <CommandGroup heading="Active Habits">
                {activeHabits.map(habit => (
                  <CommandItem 
                    key={habit.id} 
                    onSelect={() => handleSelect(habit.id)}
                    className="flex items-center cursor-pointer"
                  >
                    <div className="w-2 h-2 rounded-full mr-2" style={{
                      backgroundColor: habit.color || '#6366f1'
                    }} />
                    <span>{habit.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
