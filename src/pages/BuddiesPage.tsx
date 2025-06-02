
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, UserRoundPlus, MessageCircle, Activity } from "lucide-react";
import { BuddiesOverview } from "@/components/buddy/BuddiesOverview";
import { BuddyConnect } from "@/components/buddy/BuddyConnect";
import { BuddyMessages } from "@/components/buddy/BuddyMessages";
import { BuddyActivities } from "@/components/buddy/BuddyActivities";
import { useBuddy } from "@/context/BuddyContext";
import { useLocation } from "react-router-dom";

const BuddiesPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { buddies, pendingRequests } = useBuddy();
  const location = useLocation();

  // Handle navigation state from BuddyCard
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Habit Buddies</h1>
              <p className="text-muted-foreground">Connect and grow with friends</p>
            </div>
          </div>
        </section>

        <Card className="border">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Buddies</span>
                  {buddies.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 rounded-full">
                      {buddies.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="connect" className="flex items-center gap-2">
                  <UserRoundPlus className="h-4 w-4" />
                  <span>Connect</span>
                  {pendingRequests.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-500/20 text-orange-600 rounded-full">
                      {pendingRequests.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Activities</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <BuddiesOverview />
              </TabsContent>
              
              <TabsContent value="connect" className="mt-6">
                <BuddyConnect />
              </TabsContent>
              
              <TabsContent value="messages" className="mt-6">
                <BuddyMessages selectedBuddyId={location.state?.selectedBuddy} />
              </TabsContent>
              
              <TabsContent value="activities" className="mt-6">
                <BuddyActivities />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default BuddiesPage;
