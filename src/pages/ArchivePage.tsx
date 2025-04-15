
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Archive, RefreshCw } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ArchivePage: React.FC = () => {
  const { habits, updateHabit } = useHabits();
  
  // Get archived habits
  const archivedHabits = habits.filter(h => h.isArchived);

  const handleUnarchive = (id: string) => {
    updateHabit(id, { isArchived: false });
    toast("Habit Restored", {
      description: "The habit has been moved back to your active habits",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Archive className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Archive</h1>
              <p className="text-muted-foreground">Archived habits that are no longer active</p>
            </div>
          </div>
        </section>
        
        {archivedHabits.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {archivedHabits.map((habit) => (
              <Card key={habit.id} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <h3 className="font-medium">{habit.name}</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  {habit.description && (
                    <p className="text-sm text-muted-foreground mb-4">{habit.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs bg-secondary px-2 py-0.5 rounded">
                      {habit.frequency}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleUnarchive(habit.id)}
                      className="gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Restore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-2">No archived habits</h3>
            <p className="text-sm text-muted-foreground mb-4">
              When you archive a habit, it will appear here
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ArchivePage;
