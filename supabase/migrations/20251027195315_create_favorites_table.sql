/*
  # Create favorites table for Taylor's Kitchen Assistant

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key) - Unique identifier for each favorite
      - `meal_id` (text, not null) - The ID of the meal from TheMealDB API
      - `meal_name` (text, not null) - Name of the meal for quick access
      - `meal_thumb` (text, not null) - Thumbnail URL of the meal
      - `created_at` (timestamptz, default now()) - When the favorite was added

  2. Security
    - Enable RLS on `favorites` table
    - No authentication required (login-free as specified)
    - Allow all users to read, insert, and delete favorites
*/

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id text NOT NULL,
  meal_name text NOT NULL,
  meal_thumb text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON favorites
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON favorites
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON favorites
  FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_favorites_meal_id ON favorites(meal_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);
