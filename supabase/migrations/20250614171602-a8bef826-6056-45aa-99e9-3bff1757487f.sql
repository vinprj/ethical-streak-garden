
-- Drop the old policies for connection_requests that might be causing issues
DROP POLICY IF EXISTS "Users can view requests sent to them or by them" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can update requests sent to them" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can update requests sent to them or by them" ON public.connection_requests;

-- Create new, simplified policies for connection_requests using the built-in auth.email() function
CREATE POLICY "Users can view requests sent to them or by them"
ON public.connection_requests
FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR recipient_email = auth.email());

CREATE POLICY "Users can update requests sent to them or by them"
ON public.connection_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = sender_id OR recipient_email = auth.email());
