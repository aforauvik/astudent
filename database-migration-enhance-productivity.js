-- Add planned_minutes and status columns to existing productivity table
ALTER TABLE productivity 
ADD COLUMN IF NOT EXISTS planned_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'no_plan' CHECK (status IN ('success', 'failed', 'no_plan'));

-- Update existing records to have a default status
UPDATE productivity 
SET status = CASE 
    WHEN completed_minutes > 0 THEN 'success'
    ELSE 'no_plan'
END 
WHERE status IS NULL OR status = 'no_plan';

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_productivity_user_date_status ON productivity(user_id, date, status); 