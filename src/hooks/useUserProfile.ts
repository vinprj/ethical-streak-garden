
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
      console.log('Fetching profile for user:', userToFetch.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userToFetch.id)
        .single();
      
      if (error) {
        console.warn("Could not fetch profile:", error.message);
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, will ensure it exists');
          await ensureUserProfile(userToFetch);
          // Try fetching again after ensuring profile exists
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userToFetch.id)
            .single();
          
          if (retryError) {
            console.error('Still could not fetch profile after creation attempt:', retryError);
            setProfile(null);
          } else {
            console.log('Profile fetched successfully after creation:', retryData);
            setProfile(retryData);
          }
        } else {
          setProfile(null);
        }
        return;
      }
      
      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Could not load your profile.");
      setProfile(null);
    }
  }, []);

  const ensureUserProfile = useCallback(async (userToEnsure: User) => {
    try {
      console.log('Ensuring profile exists for user:', userToEnsure.id);
      const { data: dbProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, display_name, full_name')
        .eq('id', userToEnsure.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      const metadata = userToEnsure.user_metadata;
      const initialUsername = metadata.username || (userToEnsure.email?.split('@')[0]);

      if (dbProfile && (!dbProfile.username || !dbProfile.display_name)) {
        console.log('Profile exists but missing some fields, updating...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: dbProfile.username || initialUsername,
            display_name: dbProfile.display_name || dbProfile.full_name || metadata.full_name,
          })
          .eq('id', userToEnsure.id);

        if (updateError) throw updateError;
        console.log('Profile updated successfully');
      } else if (!dbProfile) {
        console.log('Profile does not exist, creating new profile...');
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userToEnsure.id,
          email: userToEnsure.email,
          full_name: metadata.full_name || 'New User',
          avatar_url: metadata.avatar_url,
          username: initialUsername,
          display_name: metadata.full_name || 'New User',
        });

        if (insertError) {
          console.error('Failed to create profile:', insertError);
          throw insertError;
        }
        console.log('Profile created successfully');
      } else {
        console.log('Profile already exists and is complete');
      }
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      toast.error("There was an issue setting up your profile.");
    }
  }, []);

  return { profile, setProfile, fetchProfile, ensureUserProfile };
};
