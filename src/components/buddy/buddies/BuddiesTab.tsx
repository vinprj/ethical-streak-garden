
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useBuddyData } from "@/hooks/useBuddyData";
import { useAuth } from "@/context/AuthContext";
import { BuddyCard } from "./BuddyCard";

export const BuddiesTab: React.FC<{ onNavigateToConnect: () => void }> = ({ onNavigateToConnect }) => {
  const { user } = useAuth();
  const { connections, removeConnection, loading } = useBuddyData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
        <div className="p-4 rounded-full bg-muted/50">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No buddies yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Connect with friends to share your habit journey and encourage each other
          </p>
        </div>
        <Button variant="default" onClick={onNavigateToConnect} className="mt-4">
          <UserPlus className="h-4 w-4 mr-2" />
          Connect with buddies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Your Buddies</h3>
          <p className="text-sm text-muted-foreground">
            You have {connections.length} active connection{connections.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onNavigateToConnect}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add More
        </Button>
      </div>
      
      <div className="grid gap-4">
        {connections.map(connection => {
          const buddy = connection.requester_id === user?.id ? connection.addressee : connection.requester;
          
          // Convert the connection data to match Buddy interface for the card
          const buddyData = {
            id: connection.id,
            name: buddy.full_name || 'Unknown',
            avatar: buddy.avatar_url || undefined,
            connectionDate: connection.created_at,
            lastActive: connection.updated_at,
            sharedHabits: [], // This would be populated from shared habits data
            isAnonymous: false
          };
          
          return (
            <BuddyCard
              key={connection.id}
              buddy={buddyData}
              onRemove={() => removeConnection(connection.id)}
              onToggleAnonymous={() => {
                // This would toggle anonymous mode if implemented
                console.log('Toggle anonymous mode for', buddy.full_name);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
