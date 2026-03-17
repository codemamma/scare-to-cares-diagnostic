/*
  # Lead Capture and Event Tracking Schema

  1. New Tables
    - `leads`
      - `id` (uuid, primary key) - Unique identifier for each lead
      - `email` (text, unique, required) - Lead's email address
      - `name` (text) - Lead's full name
      - `role` (text) - Professional role/title
      - `company` (text) - Company name
      - `created_at` (timestamptz) - When the lead was captured
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `diagnostic_events`
      - `id` (uuid, primary key) - Unique identifier for each event
      - `lead_id` (uuid, foreign key) - Reference to leads table
      - `action_type` (text, required) - Type of action (toolkit_download, workshop_waitlist, coaching_request)
      - `scare_score` (numeric) - Overall SCARE score from diagnostic
      - `scare_index` (numeric) - SCARE index value
      - `focus_area` (text) - Primary recommended focus area
      - `timestamp` (timestamptz) - When the event occurred
      - `metadata` (jsonb) - Additional event data

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated access and service role operations
    - Public can insert leads and events (for lead capture forms)
    - Only authenticated users can read their own data

  3. Indexes
    - Index on email for quick lookups
    - Index on action_type for analytics
    - Index on timestamp for time-based queries
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  role text,
  company text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create diagnostic_events table
CREATE TABLE IF NOT EXISTS diagnostic_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  scare_score numeric,
  scare_index numeric,
  focus_area text,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_events_action_type ON diagnostic_events(action_type);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON diagnostic_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_lead_id ON diagnostic_events(lead_id);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_events ENABLE ROW LEVEL SECURITY;

-- Policies for leads table
CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own lead data"
  ON leads FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Policies for diagnostic_events table
CREATE POLICY "Anyone can insert events"
  ON diagnostic_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own events"
  ON diagnostic_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = diagnostic_events.lead_id
      AND auth.uid()::text = leads.id::text
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for leads table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_leads_updated_at'
  ) THEN
    CREATE TRIGGER update_leads_updated_at
      BEFORE UPDATE ON leads
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;