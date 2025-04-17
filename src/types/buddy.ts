
export type PrivacyLevel = 'strict' | 'moderate' | 'open';

export interface Buddy {
  id: string;
  name: string;
  avatar?: string;
  connectionDate: string;
  lastActive: string;
  sharedHabits: string[];
  isAnonymous?: boolean;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  type: 'text' | 'encouragement' | 'reward';
  timestamp: string;
  read: boolean;
}

export interface BuddyContextType {
  buddies: Buddy[];
  setBuddies: React.Dispatch<React.SetStateAction<Buddy[]>>;
  pendingRequests: Buddy[];
  messages: Message[];
  inviteCode: string | null;
  generateInviteCode: () => void;
  acceptBuddyRequest: (id: string) => void;
  declineBuddyRequest: (id: string) => void;
  removeBuddy: (id: string) => void;
  sendEncouragement: (buddyId: string, type: 'text' | 'encouragement' | 'reward', content: string) => void;
  updateSharedHabits: (buddyId: string, habitIds: string[]) => void;
  markMessagesAsRead: (messageIds: string[]) => void;
  toggleAnonymous: (buddyId: string) => void;
  getUnreadMessageCount: () => number;
  privacyLevel: PrivacyLevel;
  setPrivacyLevel: React.Dispatch<React.SetStateAction<PrivacyLevel>>;
}
