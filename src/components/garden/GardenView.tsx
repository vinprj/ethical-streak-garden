import React, { useState, useEffect } from "react";
import { Habit } from "@/types/habit";
import { PlantDisplay } from "./PlantDisplay";
import { useGardenContext } from "@/context/GardenContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smile, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HabitCategory } from "@/types/habit";
import { cn } from "@/lib/utils";
import { RecentActivity } from "./RecentActivity";
interface GardenViewProps {
  habits: Habit[];
}
export const GardenView: React.FC<GardenViewProps> = ({
  habits
}) => {
  const {
    plants,
    isGardenEnabled,
    gardenAnimationsLevel
  } = useGardenContext();
  const [viewType, setViewType] = useState<"garden" | "recent">("garden");
  const [filterCategory, setFilterCategory] = useState<HabitCategory | null>(null);

  // Filter habits based on category
  const filteredHabits = filterCategory ? habits.filter(h => h.category === filterCategory) : habits;

  // Categories present in active habits
  const categories = Array.from(new Set(habits.map(h => h.category))) as HabitCategory[];
  if (habits.length === 0) {
    return <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Your Garden Awaits</h2>
        <p className="text-muted-foreground mb-6">Create and complete your routine to start growing plants in your garden!</p>
      </Card>;
  }
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs value={viewType} onValueChange={v => setViewType(v as "garden" | "recent")} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="garden" className="flex items-center gap-2">
              <Smile className="h-4 w-4" />
              <span>My Garden</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Recent Activity</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {viewType === "garden" && <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
            <Button variant={filterCategory === null ? "default" : "outline"} size="sm" onClick={() => setFilterCategory(null)} className="whitespace-nowrap">
              All Plants
            </Button>
            {categories.map(category => <Button key={category} variant={filterCategory === category ? "default" : "outline"} size="sm" onClick={() => setFilterCategory(category)} className="whitespace-nowrap">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>)}
          </div>}
      </div>
      
      {viewType === "garden" ? <div className={cn("grid gap-6 p-4 bg-muted/30 rounded-lg min-h-[400px]", "transition-all duration-500", filteredHabits.length > 2 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2")}>
          {filteredHabits.length > 0 ? filteredHabits.map(habit => <PlantDisplay key={habit.id} habit={habit} viewType={viewType} />) : <div className="col-span-full flex items-center justify-center h-60">
              <p className="text-muted-foreground">
                No plants match your filter. Try another category.
              </p>
            </div>}
        </div> : <RecentActivity habits={habits} />}
      
      <div className="text-sm text-muted-foreground text-center italic">
        Complete your habits daily to help your plants grow and flourish!
      </div>
    </div>;
};