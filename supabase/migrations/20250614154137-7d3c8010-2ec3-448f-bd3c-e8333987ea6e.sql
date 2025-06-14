
-- First, disable RLS temporarily to clean up all policies
ALTER TABLE public.connection_requests DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh (including any we may have missed)
DROP POLICY IF EXISTS "Users can view their connection requests" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can view requests sent to them or by them" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can update requests sent to them" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can update requests sent to them or by them" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can update their connection requests" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can insert their own requests" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can create requests" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can create connection requests" ON public.connection_requests;

-- Re-enable RLS
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;

-- Create clean, simple policies that work correctly
CREATE POLICY "Users can view their connection requests"
ON public.connection_requests
FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR recipient_email = auth.email());

CREATE POLICY "Users can create connection requests" 
ON public.connection_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their connection requests"
ON public.connection_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = sender_id OR recipient_email = auth.email());
