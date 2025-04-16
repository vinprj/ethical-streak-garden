
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useHabits } from "./HabitContext";
import { Buddy, BuddyContextType, Message, PrivacyLevel } from "@/types/buddy";
import { 
  BUDDY_STORAGE_KEY, 
  createMessage, 
  getRandomEncouragement,
  countUnreadMessages
} from "@/utils/buddyUtils";

const BuddyContext = createContext<BuddyContextType | undefined>(undefined);

export const BuddyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Buddy[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('moderate');
  
  const { habits } = useHabits();

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(BUDDY_STORAGE_KEY);
    if (savedData) {
      try {
        const { buddies: savedBuddies, pendingRequests: savedRequests, messages: savedMessages, privacyLevel: savedPrivacy } = JSON.parse(savedData);
        
        if (Array.isArray(savedBuddies)) {
          setBuddies(savedBuddies);
        }
        
        if (Array.isArray(savedRequests)) {
          setPendingRequests(savedRequests);
        }
        
        if (Array.isArray(savedMessages)) {
          setMessages(savedMessages);
        }
        
        if (savedPrivacy) {
          setPrivacyLevel(savedPrivacy);
        }
      } catch (error) {
        console.error("Error loading saved buddy data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(BUDDY_STORAGE_KEY, JSON.stringify({ 
      buddies, 
      pendingRequests, 
      messages,
      privacyLevel
    }));
  }, [buddies, pendingRequests, messages, privacyLevel]);

  // Generate a new invite code
  const generateInviteCode = () => {
    const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setInviteCode(newCode);
    toast.success("New invite code generated", {
      description: `Your code: ${newCode}`,
    });
  };

  // Accept a buddy request
  const acceptBuddyRequest = (id: string) => {
    const request = pendingRequests.find(req => req.id === id);
    
    if (request) {
      // Move from pending to buddies
      setBuddies(prev => [...prev, {
        ...request,
        connectionDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }]);
      
      setPendingRequests(prev => prev.filter(req => req.id !== id));
      
      toast.success("Buddy request accepted", {
        description: `You're now connected with ${request.name}`,
      });
    }
  };

  // Decline a buddy request
  const declineBuddyRequest = (id: string) => {
    setPendingRequests(prev => prev.filter(req => req.id !== id));
    toast.info("Request declined");
  };

  // Remove a buddy connection
  const removeBuddy = (id: string) => {
    const buddy = buddies.find(b => b.id === id);
    
    if (buddy) {
      setBuddies(prev => prev.filter(b => b.id !== id));
      toast.success("Connection removed", {
        description: `You've disconnected from ${buddy.name}`,
      });
    }
  };

  // Send encouragement to a buddy
  const sendEncouragement = (buddyId: string, type: 'text' | 'encouragement' | 'reward', content: string) => {
    const buddy = buddies.find(b => b.id === buddyId);
    
    if (buddy) {
      const newMessage = createMessage(
        "me", 
        buddyId, 
        content || getRandomEncouragement(),
        type
      );
      
      setMessages(prev => [...prev, newMessage]);
      toast.success("Encouragement sent", {
        description: `Your message was sent to ${buddy.name}`,
      });
    }
  };

  // Update which habits are shared with a buddy
  const updateSharedHabits = (buddyId: string, habitIds: string[]) => {
    setBuddies(prev => prev.map(buddy => 
      buddy.id === buddyId ? { ...buddy, sharedHabits: habitIds } : buddy
    ));
    
    toast.success("Sharing preferences updated");
  };

  // Mark messages as read
  const markMessagesAsRead = (messageIds: string[]) => {
    setMessages(prev => prev.map(message => 
      messageIds.includes(message.id) ? { ...message, read: true } : message
    ));
  };

  // Toggle anonymous mode for a buddy
  const toggleAnonymous = (buddyId: string) => {
    setBuddies(prev => prev.map(buddy => 
      buddy.id === buddyId ? { ...buddy, isAnonymous: !buddy.isAnonymous } : buddy
    ));
    
    toast.success("Privacy setting updated");
  };

  // Get unread message count
  const getUnreadMessageCount = () => {
    return countUnreadMessages(messages);
  };

  return (
    <BuddyContext.Provider
      value={{
        buddies,
        pendingRequests,
        messages,
        inviteCode,
        generateInviteCode,
        acceptBuddyRequest,
        declineBuddyRequest,
        removeBuddy,
        sendEncouragement,
        updateSharedHabits,
        markMessagesAsRead,
        toggleAnonymous,
        getUnreadMessageCount,
        privacyLevel,
        setPrivacyLevel
      }}
    >
      {children}
    </BuddyContext.Provider>
  );
};

export const useBuddy = (): BuddyContextType => {
  const context = useContext(BuddyContext);
  if (context === undefined) {
    throw new Error("useBuddy must be used within a BuddyProvider");
  }
  return context;
};

export { type Buddy } from "@/types/buddy";
