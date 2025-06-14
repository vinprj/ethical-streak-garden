
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useConnections } from './buddy/useConnections';
import { useConnectionRequests } from './buddy/useConnectionRequests';
import { useSendConnectionRequest } from './buddy/useSendConnectionRequest';

export const useBuddyData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    connections,
    fetchConnections,
    removeConnection,
    loading: connectionsLoading
  } = useConnections();

  const {
    pendingRequests,
    fetchPendingRequests,
    acceptConnectionRequest,
    declineConnectionRequest,
    loading: requestsLoading
  } = useConnectionRequests();

  const { sendConnectionRequest } = useSendConnectionRequest();

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      console.log('Loading buddy data for user:', user.id);
      
      try {
        await Promise.all([fetchConnections(), fetchPendingRequests()]);
      } catch (error) {
        console.error('Error loading buddy data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load buddy data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, fetchConnections, fetchPendingRequests]);

  const refetch = async () => {
    if (!user) return;
    
    setError(null);
    try {
      await Promise.all([fetchConnections(), fetchPendingRequests()]);
    } catch (error) {
      console.error('Error refetching buddy data:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh data');
    }
  };

  return {
    connections,
    pendingRequests,
    loading: loading || connectionsLoading || requestsLoading,
    error,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection,
    refetch
  };
};
