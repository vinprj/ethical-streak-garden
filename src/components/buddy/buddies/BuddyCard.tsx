
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
  
  // Format the connection date
  const connectionDate = new Date(buddy.connectionDate).toLocaleDateString();
  
  // Get a random encouragement message
  const getRandomEncouragement = () => {
    const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
    return encouragementMessages[randomIndex];
  };
  
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
              {buddy.avatar ? (
                <img 
                  src={buddy.avatar} 
                  alt={buddy.name} 
                  className="h-full w-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextSibling) {
                      (target.nextSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <span className={buddy.avatar ? "hidden" : "text-sm font-medium"}>
                {buddy.name.charAt(0).toUpperCase()}
              </span>
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
                  onClick={() => onSendEncouragement(getRandomEncouragement())}>
                  Send Motivation ⭐
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => onSendEncouragement("Your habit consistency is inspiring! Keep it up! 🌟")}>
                  Celebrate Progress 🎉
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => onSendEncouragement("You're building such great habits! Your future self will thank you! 💪")}>
                  Future Self 🚀
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
