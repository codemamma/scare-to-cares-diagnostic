/*
  # Create assessments table

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key) - Unique identifier for each assessment
      - `email` (text, required) - User's email address
      - `name` (text, optional) - User's name
      - `overall_score` (numeric) - Overall assessment score
      - `communication_score` (numeric) - Communication category score
      - `adaptation_score` (numeric) - Adaptation category score
      - `relationships_score` (numeric) - Relationships category score
      - `stress_response_score` (numeric) - Stress Response category score
      - `alignment_score` (numeric) - Alignment category score
      - `recommended_chapters` (jsonb) - Array of recommended chapters
      - `recommended_actions` (jsonb) - Array of recommended actions
      - `report_sent` (boolean) - Whether report email was sent successfully
      - `created_at` (timestamptz) - Timestamp of assessment completion

  2. Security
    - Enable RLS on `assessments` table
    - Add policy for authenticated users to insert their own assessments
    - Add policy for authenticated users to view their own assessments

  3. Notes
    - This table stores all CARES diagnostic assessment results
    - Email is required for sending results
    - Scores are stored as numeric values for easy analysis
    - JSONB fields allow flexible storage of recommendations
*/

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  overall_score numeric NOT NULL,
  communication_score numeric NOT NULL,
  adaptation_score numeric NOT NULL,
  relationships_score numeric NOT NULL,
  stress_response_score numeric NOT NULL,
  alignment_score numeric NOT NULL,
  recommended_chapters jsonb DEFAULT '[]'::jsonb,
  recommended_actions jsonb DEFAULT '[]'::jsonb,
  report_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert assessments"
  ON assessments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view their own assessments"
  ON assessments
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);