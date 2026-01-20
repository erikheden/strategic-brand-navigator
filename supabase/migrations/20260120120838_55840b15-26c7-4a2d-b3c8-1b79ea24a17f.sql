-- Drop the restrictive policy that limits to last 3 years
DROP POLICY IF EXISTS "temp_public_read_last_3_years_scores" ON "SBI Ranking Scores 2011-2025";

-- Create new policy allowing public read access to all years
CREATE POLICY "public_read_all_scores" ON "SBI Ranking Scores 2011-2025"
FOR SELECT
TO anon, authenticated
USING (true);