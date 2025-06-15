
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useBuddyData } from "@/hooks/useBuddyData";
import { BuddiesTab } from "./buddies/BuddiesTab";
import { PrivacyTab } from "./privacy/PrivacyTab";

export const BuddySettings: React.FC = () => {
  const navigate = useNavigate();
  const { connections } = useBuddyData();

  const handleNavigateToConnect = () => {
    navigate('/buddies', { state: { activeTab: 'connect' } });
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Habit Buddy
        </CardTitle>
        <CardDescription>
          Manage your connections and privacy settings
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="buddies" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="buddies">
              Buddies
              {connections.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  {connections.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          {/* Buddies Tab */}
          <TabsContent value="buddies" className="space-y-4">
            <BuddiesTab onNavigateToConnect={handleNavigateToConnect} />
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
