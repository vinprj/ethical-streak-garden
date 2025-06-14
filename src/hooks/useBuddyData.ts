
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useConnections } from './buddy/useConnections';
import { useConnectionRequests } from './buddy/useConnectionRequests';
import { useSendConnectionRequest } from './buddy/useSendConnectionRequest';

export const useBuddyData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const {
    connections,
    fetchConnections,
    removeConnection
  } = useConnections();

  const {
    pendingRequests,
    fetchPendingRequests,
    acceptConnectionRequest,
    declineConnectionRequest
  } = useConnectionRequests();

  const { sendConnectionRequest } = useSendConnectionRequest();

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
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
    declineConnectionRequest,
    removeConnection,
    refetch: () => Promise.all([fetchConnections(), fetchPendingRequests()])
  };
};
