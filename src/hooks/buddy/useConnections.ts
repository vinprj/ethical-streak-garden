
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Connection } from './types';

export const useConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching connections for user:', user.id);
      
      const { data, error: dbError } = await supabase
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

      if (dbError) {
        console.error('Error fetching connections:', dbError);
        toast.error('Failed to load connections');
        setError(dbError.message);
        setConnections([]);
        return;
      }

      const validConnections = (data || []).filter(conn => {
        const hasValidRequester = conn.requester && typeof conn.requester === 'object';
        const hasValidAddressee = conn.addressee && typeof conn.addressee === 'object';
        
        if (!hasValidRequester || !hasValidAddressee) {
          console.warn('Connection missing profile data:', conn);
          return false;
        }
        
        return true;
      }) as Connection[];

      setConnections(validConnections);
    } catch (err) {
      console.error('Error in fetchConnections:', err);
      toast.error('Failed to load connections');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setConnections([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const removeConnection = async (connectionId: string) => {
    try {
      console.log('Removing connection:', connectionId);
      
      const { error: deleteError } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);

      if (deleteError) {
        throw deleteError;
      }
      
      toast.success('Connection removed');
      await fetchConnections();
    } catch (err) {
      console.error('Error removing connection:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(`Failed to remove connection: ${errorMessage}`);
    }
  };

  return {
    connections,
    removeConnection,
    loading,
    error,
    refetchConnections: fetchConnections,
  };
};
