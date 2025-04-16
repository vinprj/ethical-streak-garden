
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, BellRing, Trash2, Eye, EyeOff } from "lucide-react";
import { Buddy } from "@/types/buddy";

interface BuddyCardProps {
  buddy: Buddy;
  onRemove: () => void;
  onToggleAnonymous: () => void;
  onSendEncouragement: (message: string) => void;
}

export const BuddyCard: React.FC<BuddyCardProps> = ({ 
  buddy, 
  onRemove, 
  onToggleAnonymous,
  onSendEncouragement
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the connection date
  const connectionDate = new Date(buddy.connectionDate).toLocaleDateString();
  
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {buddy.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium flex items-center gap-1.5">
                {buddy.name}
                {buddy.isAnonymous && (
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Anonymous</Badge>
                )}
                {buddy.lastActive && new Date(buddy.lastActive).getTime() > Date.now() - 86400000 && (
                  <Badge variant="success" className="text-[10px] h-5 px-1.5 py-0">Active Today</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Connected since {connectionDate}
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Less" : "More"}
          </Button>
        </div>
        
        {/* Expanded section */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Send encouragement</h4>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => onSendEncouragement("Keep it up!")}>
                  Keep it up! 🎯
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => onSendEncouragement("Great progress!")}>
                  Great progress! ⭐
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => onSendEncouragement("You're on fire!")}>
                  You're on fire! 🔥
                </Button>
              </div>
            </div>
            
            <div className="pt-2 flex flex-wrap gap-2">
              <Button size="sm" variant="ghost" className="text-xs h-8"
                onClick={onToggleAnonymous}>
                {buddy.isAnonymous ? (
                  <>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Show Identity
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5 mr-1" />
                    Go Anonymous
                  </>
                )}
              </Button>
              
              <Button size="sm" variant="ghost" className="text-xs h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                onClick={onRemove}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove Buddy
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Streak info */}
      <div className="px-4 py-3 bg-muted/30 border-t flex justify-between items-center">
        <div className="text-xs">
          <span className="font-medium">{buddy.sharedHabits.length}</span> habits shared
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <BellRing className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
