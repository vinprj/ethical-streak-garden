
import { Buddy, Message } from "@/types/buddy";

// Generate buddy data for testing
export const generateBuddyData = (): { buddies: Buddy[], pendingRequests: Buddy[], messages: Message[] } => {
  // Demo buddies with proper avatar URLs - simplified for demo purposes
  const buddies: Buddy[] = [
    {
      id: "buddy-1",
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=64&h=64&fit=crop&crop=face",
      connectionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      sharedHabits: ["habit-1", "habit-2"]
    },
    {
      id: "buddy-2",
      name: "Jordan Smith",
      avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&fit=crop&crop=face",
      connectionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      sharedHabits: ["habit-3"],
      isAnonymous: true
    },
    {
      id: "buddy-3",
      name: "Taylor Kim",
      avatar: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=64&h=64&fit=crop&crop=face",
      connectionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      lastActive: new Date().toISOString(), // Active now
      sharedHabits: ["habit-1", "habit-4", "habit-5"]
    }
  ];

  // Simplified pending requests without complex interactions
  const pendingRequests: Buddy[] = [
    {
      id: "buddy-request-1",
      name: "Sam Rodriguez",
      avatar: "https://images.unsplash.com/photo-1501286353178-1ec881214838?w=64&h=64&fit=crop&crop=face",
      connectionDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      sharedHabits: []
    }
  ];

  // Generate sample messages - simplified for demo
  const messages: Message[] = [
    {
      id: "msg-1",
      fromId: "buddy-1",
      toId: "me",
      content: "Great job on your meditation streak!",
      type: "encouragement",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg-2",
      fromId: "buddy-3",
      toId: "me",
      content: "You're doing amazing with your workout habit!",
      type: "encouragement",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: "msg-3",
      fromId: "me",
      toId: "buddy-1",
      content: "Thanks for the motivation!",
      type: "text",
      timestamp: new Date().toISOString(),
      read: true
    }
  ];

  return { buddies, pendingRequests, messages };
};
