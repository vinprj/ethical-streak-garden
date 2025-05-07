
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, UserRoundPlus, MessageCircle, Activity } from "lucide-react";
import { BuddiesOverview } from "@/components/buddy/BuddiesOverview";
import { BuddyConnect } from "@/components/buddy/BuddyConnect";
import { BuddyMessages } from "@/components/buddy/BuddyMessages";
import { BuddyActivities } from "@/components/buddy/BuddyActivities";
import { useBuddy } from "@/context/BuddyContext";

const BuddiesPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { buddies, pendingRequests } = useBuddy();

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Habit Buddies</h1>
              <p className="text-muted-foreground">Connect and grow with friends</p>
            </div>
          </div>
        </section>

        <Card className="border border-border">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview" className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>Buddies {buddies.length > 0 && `(${buddies.length})`}</span>
                </TabsTrigger>
                <TabsTrigger value="connect" className="flex items-center gap-1.5">
                  <UserRoundPlus className="h-4 w-4" />
                  <span>Connect {pendingRequests.length > 0 && `(${pendingRequests.length})`}</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center gap-1.5">
                  <Activity className="h-4 w-4" />
                  <span>Activities</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <BuddiesOverview />
              </TabsContent>
              
              <TabsContent value="connect">
                <BuddyConnect />
              </TabsContent>
              
              <TabsContent value="messages">
                <BuddyMessages />
              </TabsContent>
              
              <TabsContent value="activities">
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
