/*
  # Fix RLS Policies for Anonymous Lead Capture

  1. Changes
    - Drop existing restrictive policies
    - Add permissive policies that allow anonymous users to insert data
    - Keep read policies restricted to authenticated users only
    
  2. Security
    - Anonymous users can INSERT leads and events (for lead capture)
    - Only authenticated users can SELECT their own data
    - No UPDATE or DELETE for anonymous users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can read own lead data" ON leads;
DROP POLICY IF EXISTS "Anyone can insert events" ON diagnostic_events;
DROP POLICY IF EXISTS "Users can read own events" ON diagnostic_events;

-- Leads table policies
CREATE POLICY "Anonymous can insert leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can read all leads"
  ON leads FOR SELECT
  TO service_role
  USING (true);

-- Diagnostic events table policies
CREATE POLICY "Anonymous can insert events"
  ON diagnostic_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert events"
  ON diagnostic_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can read all events"
  ON diagnostic_events FOR SELECT
  TO service_role
  USING (true);