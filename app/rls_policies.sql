-- Create Row Level Security policies for the counters table
-- Run these commands in your Supabase SQL editor

-- Enable RLS (if not already enabled)
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to INSERT
CREATE POLICY "Allow anonymous insert on counters" ON public.counters
FOR INSERT TO anon
WITH CHECK (true);

-- Create policy to allow anonymous users to UPDATE
CREATE POLICY "Allow anonymous update on counters" ON public.counters
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- Create policy to allow anonymous users to SELECT
CREATE POLICY "Allow anonymous select on counters" ON public.counters
FOR SELECT TO anon
USING (true);
