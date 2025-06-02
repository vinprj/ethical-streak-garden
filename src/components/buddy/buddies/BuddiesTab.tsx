
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { BuddyCard } from "./BuddyCard";

export const BuddiesTab: React.FC<{ onNavigateToConnect: () => void }> = ({ onNavigateToConnect }) => {
  const { buddies, removeBuddy, toggleAnonymous, sendEncouragement } = useBuddy();

  // Send encouragement message to buddy
  const handleSendEncouragement = (buddyId: string, message: string) => {
    sendEncouragement(buddyId, 'encouragement', message);
  };

  if (buddies.length === 0) {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Your Buddies ({buddies.length})</h3>
        <Button variant="outline" size="sm" onClick={onNavigateToConnect}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add More
        </Button>
      </div>
      
      <div className="grid gap-4">
        {buddies.map(buddy => (
          <BuddyCard 
            key={buddy.id}
            buddy={buddy}
            onRemove={() => removeBuddy(buddy.id)}
            onToggleAnonymous={() => toggleAnonymous(buddy.id)}
            onSendEncouragement={(msg) => handleSendEncouragement(buddy.id, msg)}
          />
        ))}
      </div>
    </div>
  );
};
