
import React, { createContext, useContext, useMemo } from "react";
import { toast } from "sonner";
import { useBuddyData } from "@/hooks/useBuddyData";
import { useAuth } from "@/context/AuthContext";
import { Buddy, BuddyContextType, PrivacyLevel, Message } from "@/types/buddy";

const BuddyContext = createContext<BuddyContextType | undefined>(undefined);

export const BuddyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { connections, pendingRequests: rawPendingRequests, removeConnection, acceptConnectionRequest, declineConnectionRequest } = useBuddyData();

  const buddies: Buddy[] = useMemo(() => {
    if (!user) return [];
    return connections.map(connection => {
      const buddyProfile = connection.requester_id === user.id ? connection.addressee : connection.requester;
      return {
        id: connection.id,
        name: buddyProfile.full_name || 'Unknown Buddy',
        avatar: buddyProfile.avatar_url || undefined,
        connectionDate: connection.created_at,
        lastActive: connection.updated_at,
        isAnonymous: false,
        sharedHabits: [],
      };
    });
  }, [connections, user]);

  const pendingRequests: Buddy[] = useMemo(() => {
    return rawPendingRequests.map(request => {
      return {
        id: request.id,
        name: request.sender.full_name || 'Unknown',
        avatar: request.sender.avatar_url || undefined,
        connectionDate: request.created_at,
        lastActive: request.created_at,
        isAnonymous: false,
        sharedHabits: [],
      };
    });
  }, [rawPendingRequests]);

  // Deprecating most functions as they are now handled by hooks directly.
  const value: BuddyContextType = {
    buddies,
    setBuddies: () => {},
    pendingRequests,
    setPendingRequests: () => {},
    messages: [], // Messages are now handled by useMessages hook
    setMessages: () => {},
    inviteCode: null,
    generateInviteCode: () => toast.info("Please use the 'Connect' tab to invite buddies."),
    acceptBuddyRequest: (id: string) => acceptConnectionRequest(id),
    declineBuddyRequest: (id: string) => declineConnectionRequest(id),
    removeBuddy: (id: string) => removeConnection(id),
    sendEncouragement: () => toast.info("Please use the message input to send encouragements."),
    updateSharedHabits: () => {},
    markMessagesAsRead: () => {},
    toggleAnonymous: () => {},
    getUnreadMessageCount: () => 0,
    privacyLevel: 'moderate',
    setPrivacyLevel: () => {},
  };

  return (
    <BuddyContext.Provider value={value}>
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
