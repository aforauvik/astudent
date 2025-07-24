-- Create daily_status table to store success/failure for each day
CREATE TABLE IF NOT EXISTS daily_status (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'no_plan')),
    planned_minutes INTEGER DEFAULT 0,
    completed_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Add RLS policies
ALTER TABLE daily_status ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see only their own daily status
CREATE POLICY "Users can view own daily status" ON daily_status
    FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own daily status
CREATE POLICY "Users can insert own daily status" ON daily_status
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own daily status
CREATE POLICY "Users can update own daily status" ON daily_status
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own daily status
CREATE POLICY "Users can delete own daily status" ON daily_status
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_daily_status_user_date ON daily_status(user_id, date); 