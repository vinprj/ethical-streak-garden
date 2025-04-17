
import { Message } from "@/types/buddy";

// Storage key for buddy data
export const BUDDY_STORAGE_KEY = "habit-buddy-data";

// Sample encouragement messages
export const encouragementMessages = [
  "Keep it up!",
  "You're doing great!",
  "Amazing progress!",
  "Stay consistent!",
  "Proud of your effort!",
  "Keep growing!",
  "One day at a time!",
  "You've got this!",
];

// Create a new message object
export const createMessage = (
  fromId: string,
  toId: string,
  content: string,
  type: 'text' | 'encouragement' | 'reward'
): Message => {
  return {
    id: Date.now().toString(),
    fromId,
    toId,
    content,
    type,
    timestamp: new Date().toISOString(),
    read: false
  };
};

// Get random encouragement message
export const getRandomEncouragement = (): string => {
  return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
};

// Count unread messages
export const countUnreadMessages = (messages: Message[]): number => {
  return messages.filter(msg => msg.toId === "me" && !msg.read).length;
};
