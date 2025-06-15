
-- This migration adds the necessary Row Level Security (RLS) policy
-- to allow users to create their own profiles upon signing up.
-- This resolves the "issue setting up your profile" error by allowing
-- the `handle_new_user` trigger to insert a new row into the profiles table.

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
