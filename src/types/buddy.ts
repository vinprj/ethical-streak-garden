
export interface Buddy {
  id: string;
  name: string;
  connectionDate: string;
  sharedHabits: string[];
  lastActive?: string;
  isAnonymous: boolean;
  inviteCode?: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  type: 'text' | 'encouragement' | 'reward';
  sentAt: string;
  read: boolean;
}

export type PrivacyLevel = 'minimal' | 'moderate' | 'open';

export interface BuddyContextType {
  buddies: Buddy[];
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
  setPrivacyLevel: (level: PrivacyLevel) => void;
}
