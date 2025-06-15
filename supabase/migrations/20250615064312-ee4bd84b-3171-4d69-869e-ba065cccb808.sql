
-- This script will reset your application's backend.
-- All user data, including profiles, connections, and messages, will be permanently deleted.
-- The database schema will be updated to support a new username-based buddy system.
--
-- Summary of changes:
-- 1. All existing application tables will be dropped and recreated in the correct dependency order.
-- 2. The 'profiles' table will now include a unique 'username' and a 'display_name'.
-- 3. The 'user_connections' and 'connection_requests' tables are redefined for the new hybrid system.
--
-- Please review this script carefully before approving. This action is irreversible.

-- Step 1: Clean up old database objects in the correct order to resolve dependencies
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TABLE IF EXISTS public.buddy_messages CASCADE;
DROP TABLE IF EXISTS public.connection_requests CASCADE;
DROP TABLE IF EXISTS public.user_connections CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.generate_invite_token();
DROP TYPE IF EXISTS public.user_connection_status;
DROP TYPE IF EXISTS public.request_status;


-- Step 2: Recreate schema with username support

-- Create ENUM types for statuses to ensure data integrity
CREATE TYPE public.user_connection_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');
CREATE TYPE public.request_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- Profiles table with username and display_name
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  full_name TEXT, -- From signup form, can be used as initial display name
  email TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT username_format CHECK (username IS NULL OR (username ~ '^[a-zA-Z0-9_]{3,20}$' AND lower(username) = username))
);
COMMENT ON TABLE public.profiles IS 'Stores public user data, including unique usernames.';
COMMENT ON COLUMN public.profiles.username IS 'Unique, lowercase, 3-20 chars, alphanumeric and underscores only.';
COMMENT ON COLUMN public.profiles.display_name IS 'User-settable display name.';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Function to create a basic profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- Trigger to create a profile row when a new user signs up in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- User connections for in-app requests and established friendships
CREATE TABLE public.user_connections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status user_connection_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_connection UNIQUE (requester_id, addressee_id)
);
COMMENT ON TABLE public.user_connections IS 'Manages relationships and requests between users within the app.';

ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own connections" ON public.user_connections FOR ALL TO authenticated USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Connection requests for external email invitations
CREATE OR REPLACE FUNCTION public.generate_invite_token()
RETURNS text LANGUAGE plpgsql AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$;

CREATE TABLE public.connection_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  invite_token TEXT NOT NULL DEFAULT public.generate_invite_token(),
  message TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + '7 days'::interval),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.connection_requests IS 'Handles buddy invitations sent via email to people who may not have an account yet.';

ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sent requests" ON public.connection_requests FOR ALL TO authenticated USING (auth.uid() = sender_id);
CREATE POLICY "Recipient can see and act on their requests" ON public.connection_requests FOR ALL TO authenticated USING (recipient_email = auth.email());

-- Buddy messages table (unchanged logic)
CREATE TABLE public.buddy_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.buddy_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own messages" ON public.buddy_messages FOR ALL TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Tasks table (recreated to maintain original app functionality)
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tasks" ON public.tasks FOR ALL TO authenticated USING (auth.uid() = user_id);

