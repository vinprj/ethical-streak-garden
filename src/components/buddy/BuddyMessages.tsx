
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRound, Send, Clock, Award } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { formatDistanceToNow } from "date-fns";

export const BuddyMessages: React.FC = () => {
  const { buddies, messages, sendEncouragement, markMessagesAsRead } = useBuddy();
  const [selectedBuddy, setSelectedBuddy] = useState(buddies[0]?.id || "");
  const [newMessage, setNewMessage] = useState("");
  
  const buddyMessages = messages.filter(
    msg => (msg.fromId === "me" && msg.toId === selectedBuddy) || 
           (msg.toId === "me" && msg.fromId === selectedBuddy)
  );
  
  const selectedBuddyInfo = buddies.find(b => b.id === selectedBuddy);
  
  // Function to mark messages as read when viewing them
  React.useEffect(() => {
    if (selectedBuddy) {
      const unreadMessages = buddyMessages
        .filter(msg => !msg.read && msg.toId === "me")
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        markMessagesAsRead(unreadMessages);
      }
    }
  }, [selectedBuddy, buddyMessages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedBuddy) {
      sendEncouragement(selectedBuddy, "text", newMessage);
      setNewMessage("");
    }
  };
  
  if (buddies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <UserRound className="h-12 w-12 text-muted-foreground/30 mb-2" />
        <h3 className="text-lg font-medium mb-2">No Messages</h3>
        <p className="text-muted-foreground max-w-md">
          Connect with buddies to start sending encouraging messages
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Buddy List */}
      <Card className="md:col-span-1">
        <CardContent className="p-0">
          <div className="py-2">
            <h3 className="px-3 py-2 text-sm font-medium">Your Buddies</h3>
            <ScrollArea className="h-[350px]">
              <div className="space-y-1 p-2">
                {buddies.map(buddy => {
                  // Count unread messages from this buddy
                  const unreadCount = messages.filter(
                    msg => msg.fromId === buddy.id && msg.toId === "me" && !msg.read
                  ).length;
                  
                  return (
                    <button
                      key={buddy.id}
                      className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors ${
                        selectedBuddy === buddy.id 
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedBuddy(buddy.id)}
                    >
                      <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                        {buddy.avatar ? 
                          <img src={buddy.avatar} alt={buddy.name} className="rounded-full" /> :
                          <UserRound className="h-4 w-4 text-muted-foreground" />
                        }
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{buddy.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {formatDistanceToNow(new Date(buddy.lastActive), { addSuffix: true })}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
      
      {/* Messages */}
      <Card className="md:col-span-2">
        <CardContent className="p-0 h-full">
          {selectedBuddy ? (
            <div className="flex flex-col h-[400px]">
              {/* Buddy Header */}
              <div className="border-b p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                    {selectedBuddyInfo?.avatar ? 
                      <img src={selectedBuddyInfo.avatar} alt={selectedBuddyInfo.name} className="rounded-full" /> :
                      <UserRound className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
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
                
                <div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    <span>Send Encouragement</span>
                  </Button>
                </div>
              </div>
              
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {buddyMessages.length > 0 ? (
                    buddyMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.fromId === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-2.5 rounded-lg text-sm ${
                            msg.fromId === "me"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.type === "encouragement" && <Award className="h-4 w-4 inline-block mr-1 opacity-80" />}
                          {msg.content}
                          <div className={`text-xs mt-1 ${
                            msg.fromId === "me"
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          }`}>
                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                      <p className="text-muted-foreground">No messages yet</p>
                      <p className="text-sm text-muted-foreground">
                        Send an encouraging message to {selectedBuddyInfo?.name}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="border-t p-3">
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
