
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useSendConnectionRequest = () => {
  const { user } = useAuth();

  const sendConnectionRequest = async (email: string, message?: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      console.log('Sending connection request to:', email);
      
      // Check if the recipient has a profile
      const { data: recipientProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (profileError) {
        console.error('Error checking recipient profile:', profileError);
        return { error: 'Unable to verify email address. Please try again.' };
      }

      if (!recipientProfile) {
        return { error: 'No user found with this email address. Please check the email or ask them to sign up first.' };
      }

      // Check if already connected
      const { data: existingConnection, error: connectionCheckError } = await supabase
        .from('user_connections')
        .select('id')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${recipientProfile.id}),and(requester_id.eq.${recipientProfile.id},addressee_id.eq.${user.id})`)
        .maybeSingle();

      if (connectionCheckError) {
        console.error('Error checking existing connection:', connectionCheckError);
        return { error: 'Unable to check existing connections. Please try again.' };
      }

      if (existingConnection) {
        return { error: 'You are already connected to this user' };
      }

      // Check if request already exists
      const { data: existingRequest, error: requestCheckError } = await supabase
        .from('connection_requests')
        .select('id')
        .eq('sender_id', user.id)
        .eq('recipient_email', email.toLowerCase())
        .eq('status', 'pending')
        .maybeSingle();

      if (requestCheckError) {
        console.error('Error checking existing request:', requestCheckError);
        return { error: 'Unable to check existing requests. Please try again.' };
      }

      if (existingRequest) {
        return { error: 'A connection request is already pending for this email' };
      }

      // Generate invite token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_invite_token');

      if (tokenError) {
        console.error('Error generating invite token:', tokenError);
        return { error: 'Unable to generate invitation. Please try again.' };
      }

      // Insert the connection request
      const { error: insertError } = await supabase
        .from('connection_requests')
        .insert({
          sender_id: user.id,
          recipient_email: email.toLowerCase(),
          invite_token: tokenData,
          message: message || null
        });

      if (insertError) {
        console.error('Error inserting connection request:', insertError);
        return { error: 'Failed to send connection request. Please try again.' };
      }
      
      console.log('Connection request sent successfully');
      return { error: null };
    } catch (error) {
      console.error('Error sending connection request:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  return { sendConnectionRequest };
};
