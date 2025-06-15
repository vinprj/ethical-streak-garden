import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureUserProfile = useCallback(async (userToEnsure: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userToEnsure.id)
        .maybeSingle();

      if (!profile) {
        console.log('Profile not found for user, creating one:', userToEnsure.id);
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userToEnsure.id,
          email: userToEnsure.email,
          full_name: userToEnsure.user_metadata.full_name || 'New User',
          avatar_url: userToEnsure.user_metadata.avatar_url,
        });

        if (insertError) {
          throw insertError;
        }
        console.log('Profile created successfully for user:', userToEnsure.id);
      }
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      toast.error("There was an issue setting up your profile.");
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
           setTimeout(() => {
            ensureUserProfile(session.user);
          }, 0);
        }

        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          ensureUserProfile(session.user);
        }, 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [ensureUserProfile]);

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

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = getRedirectUrl();
    console.log('Sign up redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
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

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
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
