-- Supabase Setup Script for Task Management App
-- Run this script in your Supabase SQL Editor (https://app.supabase.com -> SQL Editor)

-- 1. Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    category TEXT NOT NULL DEFAULT 'Work',
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. Create open RLS policies for anonymous access
CREATE POLICY "Allow public read access to tasks"
    ON public.tasks FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert access to tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update access to tasks"
    ON public.tasks FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete access to tasks"
    ON public.tasks FOR DELETE
    USING (true);

-- 4. Enable Realtime subscriptions (Optional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- 5. Insert initial sample tasks
INSERT INTO public.tasks (title, description, completed, priority, category, due_date)
VALUES 
    ('Design Task Management UI', 'Create responsive glassmorphic task list interface using Tailwind CSS v4', true, 'high', 'Design', NOW() + INTERVAL '1 day'),
    ('Implement Express REST API', 'Set up GET, POST, PUT, DELETE endpoints for task management', true, 'high', 'Backend', NOW() + INTERVAL '2 days'),
    ('Connect Supabase Database', 'Configure Supabase client and sync database schema using supabase_setup.sql', false, 'medium', 'Database', NOW() + INTERVAL '3 days'),
    ('Write Comprehensive Documentation', 'Create README.md with setup instructions for database and REST API', false, 'low', 'Docs', NOW() + INTERVAL '5 days');
