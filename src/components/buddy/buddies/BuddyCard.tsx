
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, BellRing, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { Buddy } from "@/types/buddy";
import { useNavigate } from "react-router-dom";

interface BuddyCardProps {
  buddy: Buddy;
  onRemove: () => void;
  onToggleAnonymous: () => void;
  onSendEncouragement: (message: string) => void;
}

const encouragementMessages = [
  "You're doing amazing! Keep up the great work! 🌟",
  "Your consistency is inspiring! You've got this! 💪",
  "Way to go! Your dedication is paying off! 🎯",
  "Keep pushing forward! You're making excellent progress! 🚀",
  "Your commitment to your habits is admirable! 👏",
  "Stay strong! Every small step counts! 🌱",
  "You're on fire! Keep that momentum going! 🔥",
  "Your perseverance is truly motivating! ⭐",
  "Fantastic job! You're setting a great example! 🏆",
  "Keep shining! Your efforts are making a difference! ✨"
];

export const BuddyCard: React.FC<BuddyCardProps> = ({ 
  buddy, 
  onRemove, 
  onToggleAnonymous,
  onSendEncouragement
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  
  // Format the connection date
  const connectionDate = new Date(buddy.connectionDate).toLocaleDateString();
  
  // Get a random encouragement message
  const getRandomEncouragement = () => {
    const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
    return encouragementMessages[randomIndex];
  };

  // Navigate to messages with this buddy selected
  const handleMessageClick = () => {
    // You could pass buddy ID as state or use URL params
    navigate('/buddies', { state: { selectedBuddy: buddy.id, activeTab: 'messages' } });
  };
  
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={buddy.avatar} alt={buddy.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {buddy.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm">{buddy.name}</h3>
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
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Expanded section */}
        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8 justify-start"
                  onClick={() => onSendEncouragement(getRandomEncouragement())}
                >
                  Send Motivation ⭐
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8 justify-start"
                  onClick={() => onSendEncouragement("Your habit consistency is inspiring! Keep it up! 🌟")}
                >
                  Celebrate Progress 🎉
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
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
                      <Eye className="h-3 w-3 mr-1" />
                      Show Identity
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
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
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove Buddy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Action bar */}
      <div className="px-4 py-3 bg-muted/30 border-t rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{buddy.sharedHabits.length}</span> habits shared
          </div>
          
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={handleMessageClick}
              title="Send Message"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => onSendEncouragement(getRandomEncouragement())}
              title="Send Encouragement"
            >
              <BellRing className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
