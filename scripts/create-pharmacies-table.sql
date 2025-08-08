-- Supprimer la table si elle existe (pour les tests)
DROP TABLE IF EXISTS pharmacies CASCADE;

-- Création de la table pharmacies
CREATE TABLE pharmacies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  opening_hours JSONB NOT NULL DEFAULT '{}', -- Supporte plusieurs plages horaires
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_pharmacies_location ON pharmacies (latitude, longitude);
CREATE INDEX idx_pharmacies_active ON pharmacies (is_active);
CREATE INDEX idx_pharmacies_name ON pharmacies (name);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_pharmacies_updated_at
    BEFORE UPDATE ON pharmacies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Activer RLS (Row Level Security)
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des pharmacies actives
CREATE POLICY "Enable read access for all users" ON pharmacies
    FOR SELECT USING (is_active = true);

-- Politique pour permettre toutes les opérations aux utilisateurs authentifiés
CREATE POLICY "Enable all access for authenticated users" ON pharmacies
    FOR ALL USING (auth.role() = 'authenticated');

-- Fonction haversine pour calculer la distance en km entre deux points GPS
CREATE OR REPLACE FUNCTION haversine_distance(
  lat1 float8, lon1 float8,
  lat2 float8, lon2 float8
) RETURNS float8 AS $$
DECLARE
  r float8 := 6371; -- Rayon Terre en km
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

DROP FUNCTION IF EXISTS find_nearest_open_pharmacy(double precision, double precision);

-- Fonction principale avec calcul de distance via haversine
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
  now_day text := to_char(now() AT TIME ZONE 'Africa/Casablanca', 'dy'); -- jour actuel (mon, tue...)
  now_time time := (now() AT TIME ZONE 'Africa/Casablanca')::time; -- heure actuelle
BEGIN
  -- Mapper jours anglais vers français
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
  FROM
    pharmacies p
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
