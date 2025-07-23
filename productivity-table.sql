-- Create productivity table for tracking completed minutes
CREATE TABLE IF NOT EXISTS productivity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_productivity_user_date ON productivity(user_id, date);

-- Enable RLS (Row Level Security)
ALTER TABLE productivity ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own productivity data
CREATE POLICY "Users can view own productivity" ON productivity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own productivity" ON productivity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own productivity" ON productivity
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own productivity" ON productivity
    FOR DELETE USING (auth.uid() = user_id); 