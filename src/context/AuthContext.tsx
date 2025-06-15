import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  profile: Tables<'profiles'>['Row'] | null;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'>['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

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
        .select('id, username')
        .eq('id', userToEnsure.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const metadata = userToEnsure.user_metadata;
      
      // Profile is created by trigger, but username/display_name might be missing.
      if (dbProfile && !dbProfile.username && metadata.username) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: metadata.username,
            display_name: metadata.full_name,
          })
          .eq('id', userToEnsure.id);

        if (updateError) throw updateError;
      } else if (!dbProfile) {
        // Fallback in case trigger failed.
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userToEnsure.id,
          email: userToEnsure.email,
          full_name: metadata.full_name || 'New User',
          avatar_url: metadata.avatar_url,
          username: metadata.username,
          display_name: metadata.full_name,
        });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      toast.error("There was an issue setting up your profile.");
    }
  }, []);

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
  }, [ensureUserProfile, fetchProfile]);

  const getRedirectUrl = () => {
    // Check if we're on Vercel production
    if (window.location.hostname === 'habitflow-wine.vercel.app') {
      return 'https://habitflow-wine.vercel.app/';
    }
    // Check if we're on any vercel deployment
    if (window.location.hostname.includes('vercel.app')) {
      return `${window.location.origin}/`;
    }
    // Default to current origin for local development
    return `${window.location.origin}/`;
  };

  const signUp = async (email: string, password: string, fullName: string, username: string) => {
    const redirectUrl = getRedirectUrl();
    console.log('Sign up redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          username: username.toLowerCase()
        }
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email to confirm your account');
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
    }
  };

  const refetchProfile = useCallback(async () => {
    if(user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
