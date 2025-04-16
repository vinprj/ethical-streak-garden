
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, MessageCircle } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { ConnectTab } from "./connect/ConnectTab";
import { BuddiesTab } from "./buddies/BuddiesTab";
import { PrivacyTab } from "./privacy/PrivacyTab";

export const BuddySettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connect");
  const { buddies } = useBuddy();

  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Habit Buddy
        </CardTitle>
        <CardDescription>
          Connect with friends for mutual encouragement and accountability
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="buddies">
              Buddies
              {buddies.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  {buddies.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          {/* Connect Tab */}
          <TabsContent value="connect" className="space-y-4">
            <ConnectTab />
          </TabsContent>
          
          {/* Buddies Tab */}
          <TabsContent value="buddies" className="space-y-4">
            <BuddiesTab onNavigateToConnect={() => setActiveTab("connect")} />
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <PrivacyTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
