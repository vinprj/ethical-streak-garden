
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Define proper types matching our database
interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Connection {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
  requester: Profile;
  addressee: Profile;
}

interface ConnectionRequest {
  id: string;
  sender_id: string;
  recipient_email: string;
  invite_token: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string;
  created_at: string;
  updated_at: string;
  sender: Profile;
}

export const useBuddyData = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          requester:profiles!user_connections_requester_id_fkey(id, email, full_name, avatar_url, created_at, updated_at),
          addressee:profiles!user_connections_addressee_id_fkey(id, email, full_name, avatar_url, created_at, updated_at)
        `)
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      if (error) throw error;

      // Type assertion to ensure status matches our interface
      const typedConnections = (data || []).map(conn => ({
        ...conn,
        status: conn.status as 'pending' | 'accepted' | 'declined' | 'blocked'
      })) as Connection[];

      setConnections(typedConnections);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Failed to load connections');
    }
  };

  const fetchPendingRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select(`
          *,
          sender:profiles!connection_requests_sender_id_fkey(id, email, full_name, avatar_url, created_at, updated_at)
        `)
        .eq('recipient_email', user.email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;

      // Type assertion to ensure status matches our interface
      const typedRequests = (data || []).map(req => ({
        ...req,
        status: req.status as 'pending' | 'accepted' | 'declined' | 'expired'
      })) as ConnectionRequest[];

      setPendingRequests(typedRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast.error('Failed to load connection requests');
    }
  };

  const sendConnectionRequest = async (email: string, message?: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Check if the recipient has a profile
      const { data: recipientProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .single();

      if (profileError || !recipientProfile) {
        return { error: 'No user found with this email address. Please check the email or ask them to sign up first.' };
      }

      // Check if already connected
      const { data: existingConnection } = await supabase
        .from('user_connections')
        .select('id')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${recipientProfile.id}),and(requester_id.eq.${recipientProfile.id},addressee_id.eq.${user.id})`)
        .single();

      if (existingConnection) {
        return { error: 'You are already connected to this user' };
      }

      // Check if request already exists
      const { data: existingRequest } = await supabase
        .from('connection_requests')
        .select('id')
        .eq('sender_id', user.id)
        .eq('recipient_email', email.toLowerCase())
        .eq('status', 'pending')
        .single();

      if (existingRequest) {
        return { error: 'A connection request is already pending for this email' };
      }

      // Generate invite token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_invite_token');

      if (tokenError) throw tokenError;

      const { error } = await supabase
        .from('connection_requests')
        .insert({
          sender_id: user.id,
          recipient_email: email.toLowerCase(),
          invite_token: tokenData,
          message: message || null
        });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error sending connection request:', error);
      return { error: error instanceof Error ? error.message : 'Failed to send request' };
    }
  };

  const acceptConnectionRequest = async (requestId: string) => {
    if (!user) return;

    try {
      // First get the request details
      const { data: request, error: fetchError } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;

      // Create the connection
      const { error: connectionError } = await supabase
        .from('user_connections')
        .insert({
          requester_id: request.sender_id,
          addressee_id: user.id,
          status: 'accepted'
        });

      if (connectionError) throw connectionError;

      // Update the request status
      const { error: updateError } = await supabase
        .from('connection_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Refresh data
      await Promise.all([fetchConnections(), fetchPendingRequests()]);
      toast.success('Connection accepted!');
    } catch (error) {
      console.error('Error accepting connection request:', error);
      toast.error('Failed to accept connection request');
    }
  };

  const removeConnection = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;
      await fetchConnections();
      toast.success('Connection removed');
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove connection');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchConnections(), fetchPendingRequests()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    connections,
    pendingRequests,
    loading,
    sendConnectionRequest,
    acceptConnectionRequest,
    removeConnection,
    refetch: () => Promise.all([fetchConnections(), fetchPendingRequests()])
  };
};
