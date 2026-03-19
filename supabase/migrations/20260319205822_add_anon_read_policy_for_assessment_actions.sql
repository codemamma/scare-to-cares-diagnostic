/*
  # Add Anonymous Read Access for Assessment Actions

  1. Changes
    - Add SELECT policy for anonymous users on assessment_actions table
    - This allows the admin dashboard to read action data without authentication

  2. Security
    - Read-only access for anonymous users
    - Existing insert and authenticated policies remain unchanged
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'assessment_actions' 
    AND policyname = 'Anonymous users can view all actions'
  ) THEN
    CREATE POLICY "Anonymous users can view all actions"
      ON assessment_actions
      FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;
