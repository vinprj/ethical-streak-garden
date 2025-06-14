
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Connection } from './types';

export const useConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConnections = async () => {
    if (!user) {
      console.log('No user found, skipping connection fetch');
      setConnections([]);
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
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

  return {
    connections,
    fetchConnections,
    removeConnection,
    loading
  };
};
