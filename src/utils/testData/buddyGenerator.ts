
import { Buddy, Message } from "@/types/buddy";

// Generate buddy data for testing
export const generateBuddyData = (): { buddies: Buddy[], pendingRequests: Buddy[], messages: Message[] } => {
  // Demo buddies with proper avatar URLs
  const buddies: Buddy[] = [
    {
      id: "buddy-1",
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=64&h=64&fit=crop&crop=face",
      connectionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      sharedHabits: ["habit-long-streak-1", "habit-long-streak-2"]
    },
    {
      id: "buddy-2",
      name: "Jordan Smith",
      avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&fit=crop&crop=face",
      connectionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      sharedHabits: ["habit-medium-streak"],
      isAnonymous: true
    },
    {
      id: "buddy-3",
      name: "Taylor Kim",
      avatar: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=64&h=64&fit=crop&crop=face",
      connectionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      lastActive: new Date().toISOString(), // Active now
      sharedHabits: ["habit-0", "habit-1", "habit-2"]
    }
  ];

  // Pending buddy requests with proper avatar URLs
  const pendingRequests: Buddy[] = [
    {
      id: "buddy-request-1",
      name: "Sam Rodriguez",
      avatar: "https://images.unsplash.com/photo-1501286353178-1ec881214838?w=64&h=64&fit=crop&crop=face",
      connectionDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      sharedHabits: []
    },
    {
      id: "buddy-request-2",
      name: "Jamie Wong",
      avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=64&h=64&fit=crop&crop=face",
      connectionDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      sharedHabits: []
    }
  ];

  // Generate sample messages
  const messages: Message[] = [
    {
      id: "msg-1",
      fromId: "buddy-1",
      toId: "me",
      content: "Your meditation streak is impressive! How do you stay so consistent?",
      type: "text",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg-2",
      fromId: "me",
      toId: "buddy-1",
      content: "Thanks! I find mornings work best for me. Setting a specific time helps a lot.",
      type: "text",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
      read: true
    },
    {
      id: "msg-3",
      fromId: "buddy-2",
      toId: "me",
      content: "Keep it up!",
      type: "encouragement",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg-4",
      fromId: "buddy-3",
      toId: "me",
      content: "You're on a roll with your workout habit!",
      type: "encouragement",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: "msg-5",
      fromId: "buddy-3",
      toId: "me",
      content: "I just unlocked the '7-Day Streak' badge. Working toward the monthly one next!",
      type: "text",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: "msg-6",
      fromId: "me",
      toId: "buddy-3",
      content: "That's awesome! Keep going!",
      type: "encouragement",
      timestamp: new Date().toISOString(),
      read: true
    },
    {
      id: "msg-7",
      fromId: "me",
      toId: "buddy-2",
      content: "How's your meditation habit going?",
      type: "text",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ];

  return { buddies, pendingRequests, messages };
};
