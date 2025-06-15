
import { useCallback } from 'react';
import { useConnections } from './buddy/useConnections';
import { useConnectionRequests } from './buddy/useConnectionRequests';
import { useSendConnectionRequest } from './buddy/useSendConnectionRequest';
import { toast } from 'sonner';

export const useBuddyData = () => {
  const {
    connections,
    removeConnection,
    loading: connectionsLoading,
    error: connectionsError,
    refetchConnections
  } = useConnections();

  const {
    pendingRequests,
    acceptConnectionRequest,
    declineConnectionRequest,
    loading: requestsLoading,
    error: requestsError,
    refetchPendingRequests
  } = useConnectionRequests();

  const { sendConnectionRequest } = useSendConnectionRequest();

  const refetch = useCallback(async () => {
    toast.info("Refreshing buddy data...");
    try {
      await Promise.all([refetchConnections(), refetchPendingRequests()]);
    } catch (error) {
      console.error('Error refetching buddy data:', error);
      toast.error("Failed to refresh all data.");
    }
  }, [refetchConnections, refetchPendingRequests]);

  return {
    connections,
    pendingRequests,
    loading: connectionsLoading || requestsLoading,
    error: connectionsError || requestsError,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection,
    refetch
  };
};
