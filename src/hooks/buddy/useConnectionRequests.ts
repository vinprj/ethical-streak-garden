
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ConnectionRequest } from './types';

export const useConnectionRequests = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingRequests = async () => {
    if (!user || !user.email) {
      console.log('No user email found, skipping pending requests fetch');
      setPendingRequests([]);
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
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
        toast.error('Unable to process request. Please try again.');
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
        toast.error('Failed to create connection. Please try again.');
        return;
      }

      // Update the request status
      const { error: updateError } = await supabase
        .from('connection_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error updating request status:', updateError);
        toast.error('Connection created but failed to update request status.');
        return;
      }

      await fetchPendingRequests();
      toast.success('Connection accepted!');
    } catch (error) {
      console.error('Error accepting connection request:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const declineConnectionRequest = async (requestId: string) => {
    if (!user) return;

    try {
      console.log('Declining connection request:', requestId);
      
      const { error } = await supabase
        .from('connection_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      if (error) {
        console.error('Error declining request:', error);
        toast.error('Failed to decline request. Please try again.');
        return;
      }

      await fetchPendingRequests();
      toast.success('Connection request declined');
    } catch (error) {
      console.error('Error declining connection request:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return {
    pendingRequests,
    fetchPendingRequests,
    acceptConnectionRequest,
    declineConnectionRequest,
    loading
  };
};
