-- Grant permissions for anonymous users to insert/update in counters table
-- Run these commands in your Supabase SQL editor

-- Grant INSERT permission for anonymous users
GRANT INSERT ON public.counters TO anon;

-- Grant UPDATE permission for anonymous users  
GRANT UPDATE ON public.counters TO anon;

-- Grant SELECT permission for anonymous users (if not already granted)
GRANT SELECT ON public.counters TO anon;

-- Alternative: Create a more secure function-based approach
-- This creates a function that can set counter values
CREATE OR REPLACE FUNCTION public.set_counter(ns text, k text, v int)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.counters(namespace, key, value)
  VALUES (ns, k, v)
  ON CONFLICT (namespace, key) DO UPDATE
    SET value = v
  RETURNING value;
END $$;

-- Grant execute permission on the new function
GRANT EXECUTE ON FUNCTION public.set_counter(text, text, int) TO anon;
