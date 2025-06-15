
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { User } from '@supabase/supabase-js';

export const createDemoUsers = async (): Promise<Tables<'profiles'>[]> => {
  // Generate unique email addresses to avoid conflicts
  const timestamp = Date.now();
  const demoUsers: Omit<Tables<'profiles'>, 'created_at' | 'updated_at' | 'email_confirmed_at' | 'last_sign_in_at'>[] = [
    {
      id: crypto.randomUUID(),
      email: `demo.alex.${timestamp}@habitflow.demo`,
      full_name: 'Alex Chen',
      username: `alex_chen_${timestamp}`,
      display_name: 'Alex Chen',
      avatar_url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=64&h=64&fit=crop&crop=face',
    },
    {
      id: crypto.randomUUID(),
      email: `demo.jordan.${timestamp + 1}@habitflow.demo`,
      full_name: 'Jordan Smith',
      username: `jordan_smith_${timestamp + 1}`,
      display_name: 'Jordan S.',
      avatar_url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&fit=crop&crop=face',
    },
    {
      id: crypto.randomUUID(),
      email: `demo.taylor.${timestamp + 2}@habitflow.demo`,
      full_name: 'Taylor Kim',
      username: `taylor_kim_${timestamp + 2}`,
      display_name: 'Taylor Kim',
      avatar_url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=64&h=64&fit=crop&crop=face',
    }
  ];

  try {
    // Clean up any existing demo profiles to avoid conflicts
    await supabase
      .from('profiles')
      .delete()
      .like('email', '%@habitflow.demo');

    // Insert new demo profiles
    const { data, error } = await supabase
      .from('profiles')
      .insert(demoUsers.map(u => ({ ...u, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })))
      .select();

    if (error) {
      console.error('Error creating demo users:', error);
      return [];
    }

    console.log('Created demo users:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to create demo users:', error);
    return [];
  }
};

export const createDemoConnections = async (user: User, demoUsers: Tables<'profiles'>[]) => {
  if (demoUsers.length === 0) return;

  try {
    // Clean up existing demo connections
    const demoUserIds = demoUsers.map(u => u.id);
    await supabase
      .from('user_connections')
      .delete()
      .or(`requester_id.in.(${demoUserIds.join(',')}),addressee_id.in.(${demoUserIds.join(',')})`);

    // Create connections with 2 demo users
    const connections = [
      {
        requester_id: demoUsers[0].id,
        addressee_id: user.id,
        status: 'accepted' as const
      },
      {
        requester_id: user.id,
        addressee_id: demoUsers[1].id,
        status: 'accepted' as const
      }
    ];

    const { error } = await supabase
      .from('user_connections')
      .insert(connections);

    if (error) {
      console.error('Error creating demo connections:', error);
      throw error;
    }

    console.log('Created demo connections');
  } catch (error) {
    console.error('Failed to create demo connections:', error);
  }
};

export const createDemoRequests = async (user: User, demoUsers: Tables<'profiles'>[]) => {
  if (demoUsers.length < 3 || !user.email) return;

  try {
    // Clean up existing demo requests
    const demoUserIds = demoUsers.map(u => u.id);
    await supabase
      .from('connection_requests')
      .delete()
      .in('sender_id', demoUserIds);

    // Generate invite token
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_invite_token');

    if (tokenError) {
      console.error('Error generating invite token:', tokenError);
      return;
    }

    // Create a pending request from the third demo user
    const request = {
      sender_id: demoUsers[2].id,
      recipient_email: user.email,
      invite_token: tokenData,
      message: 'Hey! Want to be habit buddies? Let\'s support each other on our journey!',
      status: 'pending' as const
    };

    const { error } = await supabase
      .from('connection_requests')
      .insert([request]);

    if (error) {
      console.error('Error creating demo request:', error);
      throw error;
    }

    console.log('Created demo request');
  } catch (error) {
    console.error('Failed to create demo request:', error);
  }
};

export const clearDemoUserData = async (user: User) => {
    if (user && user.email) {
      // Remove demo connections
      await supabase
        .from('user_connections')
        .delete()
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      // Remove demo requests
      await supabase
        .from('connection_requests')
        .delete()
        .eq('recipient_email', user.email);

      // Remove demo profiles (cleanup any test profiles)
      await supabase
        .from('profiles')
        .delete()
        .like('email', '%@habitflow.demo');
    }
};
