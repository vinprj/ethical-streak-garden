
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ConnectionRequest } from './types';

export const useConnectionRequests = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingRequests = useCallback(async () => {
    if (!user || !user.email) {
      setPendingRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching pending requests for email:', user.email);
      
      const { data, error: dbError } = await supabase
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

      if (dbError) {
        throw dbError;
      }

      const validRequests = (data || []).filter(req => {
        const hasValidSender = req.sender && typeof req.sender === 'object';
        if (!hasValidSender) {
          console.warn('Request missing sender profile data:', req);
          return false;
        }
        return true;
      }) as ConnectionRequest[];

      setPendingRequests(validRequests);
    } catch (err) {
      console.error('Error in fetchPendingRequests:', err);
      toast.error('Failed to load connection requests');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const acceptConnectionRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const { data: request, error: fetchError } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;

      const { error: connectionError } = await supabase
        .from('user_connections')
        .insert({
          requester_id: request.sender_id,
          addressee_id: user.id,
          status: 'accepted'
        });

      if (connectionError) throw connectionError;

      const { error: updateError } = await supabase
        .from('connection_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;
      
      toast.success('Connection accepted!');
      await fetchPendingRequests();
    } catch (err) {
      console.error('Error accepting connection request:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(`Failed to accept request: ${errorMessage}`);
    }
  };

  const declineConnectionRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const { error: declineError } = await supabase
        .from('connection_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      if (declineError) throw declineError;

      toast.info('Connection request declined.');
      await fetchPendingRequests();
    } catch (err) {
      console.error('Error declining connection request:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(`Failed to decline request: ${errorMessage}`);
    }
  };

  return {
    pendingRequests,
    acceptConnectionRequest,
    declineConnectionRequest,
    loading,
    error,
    refetchPendingRequests: fetchPendingRequests,
  };
};
