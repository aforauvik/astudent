-- Add start_time column to tasks table
-- Run this in your Supabase SQL Editor

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS start_time TIME DEFAULT NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'start_time'; 