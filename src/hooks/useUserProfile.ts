
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);

  const fetchProfile = useCallback(async (userToFetch: User | null) => {
    if (!userToFetch) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userToFetch.id)
        .single();
      
      if (error) {
        console.warn("Could not fetch profile, will try to ensure it exists.", error.message);
        setProfile(null);
        return;
      }
      
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Could not load your profile.");
      setProfile(null);
    }
  }, []);

  const ensureUserProfile = useCallback(async (userToEnsure: User) => {
    try {
      const { data: dbProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, display_name, full_name')
        .eq('id', userToEnsure.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const metadata = userToEnsure.user_metadata;
      const initialUsername = metadata.username || (userToEnsure.email?.split('@')[0]);

      if (dbProfile && (!dbProfile.username || !dbProfile.display_name)) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: dbProfile.username || initialUsername,
            display_name: dbProfile.display_name || dbProfile.full_name || metadata.full_name,
          })
          .eq('id', userToEnsure.id);

        if (updateError) throw updateError;
      } else if (!dbProfile) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userToEnsure.id,
          email: userToEnsure.email,
          full_name: metadata.full_name || 'New User',
          avatar_url: metadata.avatar_url,
          username: initialUsername,
          display_name: metadata.full_name,
        });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      toast.error("There was an issue setting up your profile.");
    }
  }, []);

  return { profile, setProfile, fetchProfile, ensureUserProfile };
};
