/*
  # Create assessment_actions table for tracking user actions

  1. New Tables
    - `assessment_actions`
      - `id` (uuid, primary key) - Unique identifier for each action
      - `assessment_id` (uuid, foreign key) - References the assessment that triggered this action
      - `action_type` (text) - Type of action taken (toolkit, workshop, strategy_session)
      - `created_at` (timestamptz) - Timestamp when the action was taken
  
  2. Security
    - Enable RLS on `assessment_actions` table
    - Add policy to allow anonymous inserts (since users aren't authenticated)
    - Add policy to allow authenticated users to view all actions for analytics
  
  3. Constraints
    - Foreign key constraint to ensure assessment_id exists
    - Check constraint to validate action_type values
*/

-- Create the assessment_actions table
CREATE TABLE IF NOT EXISTS assessment_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('toolkit', 'workshop', 'strategy_session')),
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups by assessment_id
CREATE INDEX IF NOT EXISTS idx_assessment_actions_assessment_id ON assessment_actions(assessment_id);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_assessment_actions_action_type ON assessment_actions(action_type);

-- Enable RLS
ALTER TABLE assessment_actions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert actions (anonymous tracking)
CREATE POLICY "Allow anonymous action tracking"
  ON assessment_actions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all actions (for analytics)
CREATE POLICY "Authenticated users can view all actions"
  ON assessment_actions
  FOR SELECT
  TO authenticated
  USING (true);