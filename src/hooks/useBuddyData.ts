
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
    if (!user) {
      console.log('No user found, skipping connection fetch');
      setConnections([]);
      return;
    }

    try {
      console.log('Fetching connections for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          id,
          requester_id,
          addressee_id,
          status,
          created_at,
          updated_at,
          requester:profiles!user_connections_requester_id_fkey(id, email, full_name, avatar_url, created_at, updated_at),
          addressee:profiles!user_connections_addressee_id_fkey(id, email, full_name, avatar_url, created_at, updated_at)
        `)
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching connections:', error);
        toast.error('Failed to load connections');
        setConnections([]);
        return;
      }

      console.log('Raw connections data:', data);

      // Validate and process connections
      const validConnections = (data || []).filter(conn => {
        const hasValidRequester = conn.requester && typeof conn.requester === 'object';
        const hasValidAddressee = conn.addressee && typeof conn.addressee === 'object';
        
        if (!hasValidRequester || !hasValidAddressee) {
          console.warn('Connection missing profile data:', conn);
          return false;
        }
        
        return true;
      }) as Connection[];

      console.log('Processed connections:', validConnections);
      setConnections(validConnections);
    } catch (error) {
      console.error('Error in fetchConnections:', error);
      toast.error('Failed to load connections');
      setConnections([]);
    }
  };

  const fetchPendingRequests = async () => {
    if (!user || !user.email) {
      console.log('No user email found, skipping pending requests fetch');
      setPendingRequests([]);
      return;
    }

    try {
      console.log('Fetching pending requests for email:', user.email);
      
      const { data, error } = await supabase
        .from('connection_requests')
        .select(`
          id,
          sender_id,
          recipient_email,
          invite_token,
          message,
          status,
          expires_at,
          created_at,
          updated_at,
          sender:profiles!connection_requests_sender_id_fkey(id, email, full_name, avatar_url, created_at, updated_at)
        `)
        .eq('recipient_email', user.email.toLowerCase())
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Error fetching pending requests:', error);
        toast.error('Failed to load connection requests');
        setPendingRequests([]);
        return;
      }

      console.log('Raw pending requests data:', data);

      // Validate and process requests
      const validRequests = (data || []).filter(req => {
        const hasValidSender = req.sender && typeof req.sender === 'object';
        
        if (!hasValidSender) {
          console.warn('Request missing sender profile data:', req);
          return false;
        }
        
        return true;
      }) as ConnectionRequest[];

      console.log('Processed pending requests:', validRequests);
      setPendingRequests(validRequests);
    } catch (error) {
      console.error('Error in fetchPendingRequests:', error);
      toast.error('Failed to load connection requests');
      setPendingRequests([]);
    }
  };

  const sendConnectionRequest = async (email: string, message?: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      console.log('Sending connection request to:', email);
      
      // Check if the recipient has a profile
      const { data: recipientProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (profileError) {
        console.error('Error checking recipient profile:', profileError);
        return { error: `Database error: ${profileError.message}` };
      }

      if (!recipientProfile) {
        return { error: 'No user found with this email address. Please check the email or ask them to sign up first.' };
      }

      // Check if already connected
      const { data: existingConnection, error: connectionCheckError } = await supabase
        .from('user_connections')
        .select('id')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${recipientProfile.id}),and(requester_id.eq.${recipientProfile.id},addressee_id.eq.${user.id})`)
        .maybeSingle();

      if (connectionCheckError) {
        console.error('Error checking existing connection:', connectionCheckError);
        return { error: `Error checking existing connections: ${connectionCheckError.message}` };
      }

      if (existingConnection) {
        return { error: 'You are already connected to this user' };
      }

      // Check if request already exists
      const { data: existingRequest, error: requestCheckError } = await supabase
        .from('connection_requests')
        .select('id')
        .eq('sender_id', user.id)
        .eq('recipient_email', email.toLowerCase())
        .eq('status', 'pending')
        .maybeSingle();

      if (requestCheckError) {
        console.error('Error checking existing request:', requestCheckError);
        return { error: `Error checking existing requests: ${requestCheckError.message}` };
      }

      if (existingRequest) {
        return { error: 'A connection request is already pending for this email' };
      }

      // Generate invite token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_invite_token');

      if (tokenError) {
        console.error('Error generating invite token:', tokenError);
        return { error: `Error generating invite token: ${tokenError.message}` };
      }

      // Insert the connection request
      const { error: insertError } = await supabase
        .from('connection_requests')
        .insert({
          sender_id: user.id,
          recipient_email: email.toLowerCase(),
          invite_token: tokenData,
          message: message || null
        });

      if (insertError) {
        console.error('Error inserting connection request:', insertError);
        return { error: `Failed to send request: ${insertError.message}` };
      }
      
      console.log('Connection request sent successfully');
      return { error: null };
    } catch (error) {
      console.error('Error sending connection request:', error);
      return { error: error instanceof Error ? error.message : 'Failed to send request' };
    }
  };

  const acceptConnectionRequest = async (requestId: string) => {
    if (!user) return;

    try {
      console.log('Accepting connection request:', requestId);
      
      // First get the request details
      const { data: request, error: fetchError } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) {
        console.error('Error fetching request details:', fetchError);
        toast.error(`Failed to fetch request: ${fetchError.message}`);
        return;
      }

      // Create the connection
      const { error: connectionError } = await supabase
        .from('user_connections')
        .insert({
          requester_id: request.sender_id,
          addressee_id: user.id,
          status: 'accepted'
        });

      if (connectionError) {
        console.error('Error creating connection:', connectionError);
        toast.error(`Failed to create connection: ${connectionError.message}`);
        return;
      }

      // Update the request status
      const { error: updateError } = await supabase
        .from('connection_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error updating request status:', updateError);
        toast.error(`Failed to update request: ${updateError.message}`);
        return;
      }

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
      console.log('Removing connection:', connectionId);
      
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);

      if (error) {
        console.error('Error removing connection:', error);
        toast.error(`Failed to remove connection: ${error.message}`);
        return;
      }
      
      await fetchConnections();
      toast.success('Connection removed');
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove connection');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setConnections([]);
        setPendingRequests([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      console.log('Loading buddy data for user:', user.id);
      
      try {
        await Promise.all([fetchConnections(), fetchPendingRequests()]);
      } catch (error) {
        console.error('Error loading buddy data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
