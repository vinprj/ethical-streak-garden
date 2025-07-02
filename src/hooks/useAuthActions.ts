
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const getRedirectUrl = () => {
  // Check if we're on Vercel production
  if (window.location.hostname === 'routinegarden-wine.vercel.app') {
    return 'https://routinegarden-wine.vercel.app/';
  }
  // Check if we're on any vercel deployment
  if (window.location.hostname.includes('vercel.app')) {
    return `${window.location.origin}/`;
  }
  // Default to current origin for local development
  return `${window.location.origin}/`;
};

export const useAuthActions = () => {
  const signUp = async (email: string, password: string, fullName: string, username: string) => {
    const redirectUrl = getRedirectUrl();
    console.log('Sign up redirect URL:', redirectUrl);
    
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // 'PGRST116' is 'not found'
      toast.error(checkError.message);
      return { error: checkError };
    }
    if (existingProfile) {
      const err = { name: 'UsernameTaken', message: 'This username is already taken.' };
      toast.error(err.message);
      return { error: err };
    }

    const { data, error } = await supabase.auth.signUp({
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
      return { error };
    }

    // If user is immediately confirmed (no email confirmation required), 
    // ensure profile is created properly
    if (data.user && !data.user.email_confirmed_at) {
      console.log('User created, waiting for email confirmation');
      toast.success('Check your email to confirm your account');
    } else if (data.user) {
      console.log('User created and confirmed, checking profile creation');
      // Small delay to allow trigger to execute
      setTimeout(async () => {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError || !profile) {
          console.log('Profile not found, creating manually');
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              username: username.toLowerCase(),
              display_name: fullName
            });
          
          if (insertError) {
            console.error('Failed to create profile manually:', insertError);
            toast.error('Account created but profile setup failed. Please contact support.');
          } else {
            console.log('Profile created manually');
            toast.success('Account created successfully!');
          }
        } else {
          console.log('Profile found:', profile);
          toast.success('Account created successfully!');
        }
      }, 1000);
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

  return { signUp, signIn, signOut };
};
