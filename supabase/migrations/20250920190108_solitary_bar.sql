/*
  # Create reports table

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `category` (text, not null)
      - `priority` (text, not null, check constraint)
      - `status` (text, default 'Submitted', check constraint)
      - `latitude` (decimal, optional)
      - `longitude` (decimal, optional)
      - `manual_location` (jsonb, optional)
      - `photo_url` (text, optional)
      - `vouch_count` (integer, default 0)
      - `anonymous` (boolean, default false)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `reports` table
    - Add policy for authenticated users to create reports
    - Add policy for users to read all reports
    - Add policy for users to update their own reports
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  status text DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'In Progress', 'Resolved', 'Rejected')),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  manual_location jsonb,
  photo_url text,
  vouch_count integer DEFAULT 0,
  anonymous boolean DEFAULT false,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reports"
  ON reports
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_vouch_count ON reports(vouch_count DESC);

-- Create spatial index for location-based queries
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(latitude, longitude);