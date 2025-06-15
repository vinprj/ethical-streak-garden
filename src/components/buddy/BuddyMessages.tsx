
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRound, Send, Clock, Loader2 } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/hooks/buddy/useMessages";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EncouragementActions } from "./messages/EncouragementActions";

interface BuddyMessagesProps {
  selectedBuddyId?: string;
}

export const BuddyMessages: React.FC<BuddyMessagesProps> = ({ selectedBuddyId }) => {
  const { user } = useAuth();
  const { buddies } = useBuddy();
  const [selectedBuddy, setSelectedBuddy] = useState(selectedBuddyId || buddies[0]?.id || "");
  const [newMessage, setNewMessage] = useState("");
  const [showEncouragementActions, setShowEncouragementActions] = useState(false);
  
  const { messages, loading, sendMessage } = useMessages(selectedBuddy);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedBuddyId) {
      setSelectedBuddy(selectedBuddyId);
    } else if (buddies.length > 0 && !selectedBuddy) {
      setSelectedBuddy(buddies[0].id);
    }
  }, [selectedBuddyId, buddies, selectedBuddy]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  const selectedBuddyInfo = buddies.find(b => b.id === selectedBuddy);
  
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedBuddy) {
      await sendMessage(newMessage, "text");
      setNewMessage("");
    }
  };

  const handleSendEncouragement = async (message: string) => {
    if (selectedBuddy) {
      await sendMessage(message, "encouragement");
      setShowEncouragementActions(false);
    }
  };
  
  if (buddies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 rounded-full bg-muted/50 mb-4">
          <UserRound className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Messages</h3>
        <p className="text-muted-foreground max-w-md">
          Connect with buddies to start sending encouraging messages
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Buddy List */}
      <Card className="md:col-span-1">
        <CardContent className="p-0">
          <div className="py-3">
            <h3 className="px-4 py-2 text-sm font-medium border-b">Your Buddies</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-1 p-2">
                {buddies.map(buddy => (
                    <button
                      key={buddy.id}
                      className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                        selectedBuddy === buddy.id 
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedBuddy(buddy.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={buddy.avatar} alt={buddy.name} />
                        <AvatarFallback className="text-xs">
                          {buddy.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{buddy.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {formatDistanceToNow(new Date(buddy.lastActive), { addSuffix: true })}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
      
      {/* Messages */}
      <Card className="md:col-span-2">
        <CardContent className="p-0 h-full">
          {selectedBuddy ? (
            <div className="flex flex-col h-[500px]">
              {/* Buddy Header */}
              <div className="border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedBuddyInfo?.avatar} alt={selectedBuddyInfo?.name} />
                    <AvatarFallback className="text-xs">
                      {selectedBuddyInfo?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selectedBuddyInfo?.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {selectedBuddyInfo ? 
                          formatDistanceToNow(new Date(selectedBuddyInfo.lastActive), { addSuffix: true }) :
                          "Unknown"
                        }
                      </span>
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant={showEncouragementActions ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setShowEncouragementActions(!showEncouragementActions)}
                >
                  {showEncouragementActions ? "Hide Options" : "Send Encouragement"}
                </Button>
              </div>

              {/* Encouragement Actions */}
              {showEncouragementActions && (
                <div className="p-4 border-b bg-muted/30">
                  <EncouragementActions onSendEncouragement={handleSendEncouragement} />
                </div>
              )}
              
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as React.RefObject<HTMLDivElement>}>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : (
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            msg.sender_id === user?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                          <div className={`text-xs mt-1 opacity-70`}>
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                      <p className="text-muted-foreground mb-2">No messages yet</p>
                      <p className="text-sm text-muted-foreground">
                        Send an encouraging message to {selectedBuddyInfo?.name}
                      </p>
                    </div>
                  )}
                </div>
                )}
              </ScrollArea>
              
              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="flex-1"
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a buddy to start messaging</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
