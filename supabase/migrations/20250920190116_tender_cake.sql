/*
  # Create report vouches table

  1. New Tables
    - `report_vouches`
      - `id` (uuid, primary key)
      - `report_id` (uuid, foreign key to reports)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `report_vouches` table
    - Add policy for authenticated users to create vouches
    - Add policy for users to read all vouches
    - Add unique constraint to prevent duplicate vouches

  3. Constraints
    - Unique constraint on (report_id, user_id) to prevent duplicate vouches
*/

CREATE TABLE IF NOT EXISTS report_vouches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint to prevent duplicate vouches
ALTER TABLE report_vouches 
ADD CONSTRAINT unique_user_report_vouch 
UNIQUE (report_id, user_id);

ALTER TABLE report_vouches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read vouches"
  ON report_vouches
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create vouches"
  ON report_vouches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_report_vouches_report_id ON report_vouches(report_id);
CREATE INDEX IF NOT EXISTS idx_report_vouches_user_id ON report_vouches(user_id);
CREATE INDEX IF NOT EXISTS idx_report_vouches_created_at ON report_vouches(created_at DESC);