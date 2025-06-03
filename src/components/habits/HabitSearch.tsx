
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
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
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
    navigate(`/today?highlight=${habitId}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-9 md:w-64 h-9 justify-start px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          aria-label="Search habits"
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          <span className="hidden md:inline ml-2 text-left flex-1 truncate text-muted-foreground">Search habits...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0">
        <Command className="rounded-lg border-0">
          <CommandInput placeholder="Search habits..." className="border-0" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No habits found.</CommandEmpty>
            <CommandGroup heading="Active Habits">
              {activeHabits.map(habit => (
                <CommandItem 
                  key={habit.id} 
                  onSelect={() => handleSelect(habit.id)}
                  className="flex items-center cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full mr-2 flex-shrink-0" style={{
                    backgroundColor: habit.color || '#6366f1'
                  }} />
                  <span className="truncate">{habit.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
