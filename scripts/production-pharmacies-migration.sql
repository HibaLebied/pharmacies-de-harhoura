-- Migration non destructive pour la production.
-- Ne supprime aucune table et ne modifie aucune donnée existante.

CREATE TABLE IF NOT EXISTS pharmacies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  opening_hours JSONB NOT NULL DEFAULT '{}',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pharmacies_location ON pharmacies (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_pharmacies_active ON pharmacies (is_active);
CREATE INDEX IF NOT EXISTS idx_pharmacies_name ON pharmacies (name);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_pharmacies_updated_at ON pharmacies;

CREATE TRIGGER update_pharmacies_updated_at
    BEFORE UPDATE ON pharmacies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON pharmacies;
CREATE POLICY "Enable read access for all users" ON pharmacies
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON pharmacies;
CREATE POLICY "Enable all access for authenticated users" ON pharmacies
    FOR ALL USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION haversine_distance(
  lat1 float8, lon1 float8,
  lat2 float8, lon2 float8
) RETURNS float8 AS $$
DECLARE
  r float8 := 6371;
  dlat float8;
  dlon float8;
  a float8;
  c float8;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)^2;
  c := 2 * atan2(sqrt(a), sqrt(1 - a));
  RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

CREATE OR REPLACE FUNCTION find_nearest_open_pharmacy(user_lat double precision, user_lng double precision)
RETURNS TABLE (
  id uuid,
  name varchar(255),
  address text,
  phone varchar(20),
  latitude numeric(10,8),
  longitude numeric(10,8),
  image_url text,
  distance double precision
)
LANGUAGE plpgsql
AS $$
DECLARE
  now_day text := to_char(now() AT TIME ZONE 'Africa/Casablanca', 'dy');
  now_time time := (now() AT TIME ZONE 'Africa/Casablanca')::time;
BEGIN
  CASE now_day
    WHEN 'mon' THEN now_day := 'lun';
    WHEN 'tue' THEN now_day := 'mar';
    WHEN 'wed' THEN now_day := 'mer';
    WHEN 'thu' THEN now_day := 'jeu';
    WHEN 'fri' THEN now_day := 'ven';
    WHEN 'sat' THEN now_day := 'sam';
    WHEN 'sun' THEN now_day := 'dim';
  END CASE;

  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.address,
    p.phone,
    p.latitude,
    p.longitude,
    p.image_url,
    haversine_distance(user_lat, user_lng, p.latitude, p.longitude) AS distance
  FROM pharmacies p
  WHERE
    p.is_active = true
    AND EXISTS (
      SELECT 1
      FROM jsonb_array_elements(coalesce(p.opening_hours -> now_day, '[]'::jsonb)) AS schedule
      WHERE
        now_time >= (schedule->>'open')::time
        AND now_time <= (schedule->>'close')::time
    )
  ORDER BY distance
  LIMIT 1;
END;
$$;
