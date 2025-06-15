
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  message_type: string;
}

export const useMessages = (connectionId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [buddyProfileId, setBuddyProfileId] = useState<string | null>(null);

  const getBuddyProfileId = useCallback(async () => {
    if (!user || !connectionId) {
      setBuddyProfileId(null);
      return null;
    }
    const { data: connectionData, error } = await supabase
      .from('user_connections')
      .select('requester_id, addressee_id')
      .eq('id', connectionId)
      .single();
    
    if (error || !connectionData) {
      setBuddyProfileId(null);
      console.error("Could not find connection details for messages", error);
      return null;
    }

    const profileId = connectionData.requester_id === user.id 
      ? connectionData.addressee_id 
      : connectionData.requester_id;
    setBuddyProfileId(profileId);
    return profileId;
  }, [user, connectionId]);

  const fetchMessages = useCallback(async (profileId: string | null) => {
    if (!user || !profileId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('buddy_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${profileId}),and(sender_id.eq.${profileId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(data as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getBuddyProfileId().then(profileId => {
      fetchMessages(profileId);
    });
  }, [connectionId, getBuddyProfileId, fetchMessages]);

  const sendMessage = async (content: string, type: 'text' | 'encouragement' = 'text') => {
    if (!user || !buddyProfileId || !content.trim()) {
        toast.error("Cannot send message. User or buddy not identified.");
        return;
    }
    
    try {
        const { error } = await supabase
            .from('buddy_messages')
            .insert({
                sender_id: user.id,
                recipient_id: buddyProfileId,
                content,
                message_type: type
            });
        
        if (error) throw error;
        
        await fetchMessages(buddyProfileId);
    } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message.');
    }
  };
  
  // Realtime listener
  useEffect(() => {
    if (!buddyProfileId) return;

    const channel = supabase
      .channel(`buddy_messages_${buddyProfileId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'buddy_messages',
        },
        (payload) => {
            const newMessage = payload.new as Message;
            // only add if it's part of this conversation
            if ((newMessage.sender_id === user?.id && newMessage.recipient_id === buddyProfileId) || (newMessage.sender_id === buddyProfileId && newMessage.recipient_id === user?.id)) {
                 setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [buddyProfileId, user?.id]);


  return { messages, loading, sendMessage };
};
