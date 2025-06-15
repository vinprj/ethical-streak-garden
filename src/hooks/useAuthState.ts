
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from './useUserProfile';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile, setProfile, fetchProfile, ensureUserProfile } = useUserProfile();

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setSession(session);
        
        if (currentUser) {
          setTimeout(async () => {
            await ensureUserProfile(currentUser);
            await fetchProfile(currentUser);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setSession(session);
      setUser(currentUser);
      if (currentUser) {
         setTimeout(async () => {
            await ensureUserProfile(currentUser);
            await fetchProfile(currentUser);
            setLoading(false);
          }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [ensureUserProfile, fetchProfile, setProfile]);

  return { user, session, loading, profile, fetchProfile };
};
