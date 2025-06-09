
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Buddy } from "@/types/buddy";

interface BuddyCardProps {
  buddy: Buddy;
  onRemove: () => void;
  onToggleAnonymous: () => void;
}

export const BuddyCard: React.FC<BuddyCardProps> = ({ 
  buddy, 
  onRemove, 
  onToggleAnonymous
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the connection date
  const connectionDate = new Date(buddy.connectionDate).toLocaleDateString();
  
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={buddy.avatar} alt={buddy.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {buddy.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm truncate">{buddy.name}</h3>
                {buddy.isAnonymous && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">Anonymous</Badge>
                )}
                {buddy.lastActive && new Date(buddy.lastActive).getTime() > Date.now() - 86400000 && (
                  <Badge variant="default" className="text-xs px-2 py-0.5 bg-green-500">Active</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Connected since {connectionDate}
              </p>
            </div>
          </div>
          
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Expanded section - simplified for demo data */}
        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Connection Details</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Shared habits: {buddy.sharedHabits.length}</p>
                <p>Last active: {new Date(buddy.lastActive).toLocaleDateString()}</p>
                <p>Connection status: {buddy.isAnonymous ? 'Anonymous' : 'Public'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats bar */}
      <div className="px-4 py-3 bg-muted/30 border-t rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{buddy.sharedHabits.length}</span> habits shared
          </div>
          <div className="text-xs text-muted-foreground">
            Last active: {new Date(buddy.lastActive).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
