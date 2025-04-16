
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { BuddyCard } from "./BuddyCard";

export const BuddiesTab: React.FC<{ onNavigateToConnect: () => void }> = ({ onNavigateToConnect }) => {
  const { buddies, removeBuddy, toggleAnonymous, sendEncouragement } = useBuddy();

  // Mock function to simulate sending encouragement
  const handleSendEncouragement = (buddyId: string, message: string) => {
    sendEncouragement(buddyId, 'encouragement', message);
  };

  if (buddies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-2">
        <Users className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-base font-medium">No buddies yet</h3>
        <p className="text-sm text-muted-foreground">
          Connect with friends to share your habit journey and encourage each other
        </p>
        <Button variant="outline" onClick={onNavigateToConnect} className="mt-2">
          <UserPlus className="h-4 w-4 mr-2" />
          Connect with buddies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
  );
};
