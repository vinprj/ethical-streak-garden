
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

interface Connection {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  requester: Profile;
  addressee: Profile;
}

interface ConnectionRequest {
  id: string;
  sender_id: string;
  recipient_email: string;
  invite_token: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string;
  created_at: string;
  sender: Profile;
}

export const useBuddyData = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch connections
  const fetchConnections = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          requester:profiles!user_connections_requester_id_fkey(*),
          addressee:profiles!user_connections_addressee_id_fkey(*)
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Failed to load connections');
    }
  };

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select(`
          *,
          sender:profiles!connection_requests_sender_id_fkey(*)
        `)
        .eq('recipient_email', user.email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      setPendingRequests(data || []);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast.error('Failed to load pending requests');
    }
  };

  // Send buddy invitation
  const sendBuddyInvitation = async (recipientEmail: string, message?: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Generate invite token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_invite_token');

      if (tokenError) throw tokenError;

      const { error } = await supabase
        .from('connection_requests')
        .insert({
          sender_id: user.id,
          recipient_email: recipientEmail,
          invite_token: tokenData,
          message
        });

      if (error) throw error;

      toast.success('Invitation sent successfully!');
      return { error: null };
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
      return { error };
    }
  };

  // Accept buddy request
  const acceptBuddyRequest = async (requestId: string) => {
    if (!user) return;

    try {
      // Get the request details
      const { data: request, error: requestError } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Create connection
      const { error: connectionError } = await supabase
        .from('user_connections')
        .insert({
          requester_id: request.sender_id,
          addressee_id: user.id,
          status: 'accepted'
        });

      if (connectionError) throw connectionError;

      // Update request status
      const { error: updateError } = await supabase
        .from('connection_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast.success('Buddy request accepted!');
      fetchConnections();
      fetchPendingRequests();
    } catch (error: any) {
      console.error('Error accepting request:', error);
      toast.error(error.message || 'Failed to accept request');
    }
  };

  // Decline buddy request
  const declineBuddyRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('connection_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Request declined');
      fetchPendingRequests();
    } catch (error: any) {
      console.error('Error declining request:', error);
      toast.error(error.message || 'Failed to decline request');
    }
  };

  // Remove connection
  const removeConnection = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      toast.success('Connection removed');
      fetchConnections();
    } catch (error: any) {
      console.error('Error removing connection:', error);
      toast.error(error.message || 'Failed to remove connection');
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchConnections(), fetchPendingRequests()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    connections,
    pendingRequests,
    loading,
    sendBuddyInvitation,
    acceptBuddyRequest,
    declineBuddyRequest,
    removeConnection,
    refetch: () => {
      fetchConnections();
      fetchPendingRequests();
    }
  };
};
