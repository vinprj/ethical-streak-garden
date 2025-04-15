
import React, { useState } from "react";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { getCategoryColor } from "@/lib/utils/habitUtils";
import { useNavigate } from "react-router-dom";

export const HabitSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { habits } = useHabits();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (habit: string) => {
    setOpen(false);
    navigate(`/today?habit=${habit}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-9 px-0 md:w-auto md:px-4"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline">Search habits</span>
        <kbd className="ml-2 hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-secondary px-1.5 font-mono text-xs text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search habits..." />
        <CommandList>
          <CommandEmpty>No habits found.</CommandEmpty>
          <CommandGroup heading="Your Habits">
            {habits.filter(habit => !habit.isArchived).map((habit) => (
              <CommandItem
                key={habit.id}
                onSelect={() => handleSelect(habit.id)}
                className="flex items-center"
              >
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(habit.category)} mr-2`}></div>
                <span>{habit.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {habit.frequency}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => { setOpen(false); navigate("/today"); }}>
              View today's habits
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); navigate("/insights"); }}>
              View insights
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
