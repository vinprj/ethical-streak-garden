
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { Buddy } from "@/types/buddy";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  // Format the connection date
  const connectionDate = new Date(buddy.connectionDate).toLocaleDateString();

  // Navigate to messages with this buddy selected
  const handleMessageClick = () => {
    navigate('/buddies', { 
      state: { 
        selectedBuddy: buddy.id, 
        activeTab: 'messages' 
      } 
    });
  };
  
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
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs"
              onClick={handleMessageClick}
              title="Send Message"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
            
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
        
        {/* Expanded section */}
        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Settings</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs h-8 justify-start"
                  onClick={onToggleAnonymous}
                >
                  {buddy.isAnonymous ? (
                    <>
                      <Eye className="h-3 w-3 mr-2" />
                      Show Identity
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-2" />
                      Go Anonymous
                    </>
                  )}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10 justify-start"
                  onClick={onRemove}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Remove Buddy
                </Button>
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
