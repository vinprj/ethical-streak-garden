import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GardenView } from "@/components/garden/GardenView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Settings, Award, Info } from "lucide-react";
import { SectionHeader } from "@/components/settings/SectionHeader";
import { GardenSettings } from "@/components/garden/GardenSettings";
import { GardenInfo } from "@/components/garden/GardenInfo";
import { GardenAchievements } from "@/components/garden/GardenAchievements";
import { useHabits } from "@/context/HabitContext";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGardenContext } from "@/context/GardenContext";
const GardenPage: React.FC = () => {
  const {
    habits
  } = useHabits();
  const {
    isGardenEnabled
  } = useGardenContext();
  const [selectedTab, setSelectedTab] = useState<string>("garden");

  // Filter out only active habits
  const activeHabits = habits.filter(h => !h.isArchived);
  return <AppLayout>
      <div className="flex flex-col gap-6 pb-6">
        <section>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Routine Garden</h1>
                <p className="text-muted-foreground">Watch your routine grow into plants</p>
              </div>
            </div>
          </div>
        </section>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="garden" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span className="hidden sm:inline">Garden</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">How it works</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="garden" className="space-y-6">
            {isGardenEnabled ? <GardenView habits={activeHabits} /> : <Card className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Habit Garden is disabled</h2>
                <p className="text-muted-foreground mb-6">
                  Enable the Habit Garden in the settings tab to see your habits grow as plants!
                </p>
                <Button onClick={() => setSelectedTab("settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Garden Settings
                </Button>
              </Card>}
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-4">
            <SectionHeader icon={Award} title="Garden Achievements" description="Special rewards for your garden progress" />
            <GardenAchievements habits={activeHabits} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <SectionHeader icon={Settings} title="Garden Settings" description="Customize your garden experience" />
            <GardenSettings />
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4">
            <SectionHeader icon={Info} title="About the Habit Garden" description="Learn how the garden grows with your habits" />
            <GardenInfo />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>;
};
export default GardenPage;