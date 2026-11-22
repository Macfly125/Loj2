/*
# Create Warden Coach core data

1. New Tables
- `coach_account` stores the single local game profile shown in the app, including commander level, power, power change, and resource capacities.
- `coach_heroes` stores the user's hero roster with level, star rank, role, and combat power.
- `coach_priorities` stores the ranked recommendations shown on the daily dashboard, including progress and category.
- `coach_events` stores active game events and the recommended hero lineup for each event.
- `coach_screenshot_imports` stores each imported capture and the result of the latest account analysis.

2. Seed Data
- Adds a safe first-run Warden Kael profile, three heroes, three daily recommendations, and one active event when those records do not already exist.
- Seed records are inserted by stable labels rather than copied generated IDs so a fresh database can rebuild them safely.

3. Security
- Enables Row Level Security on every new table.
- Grants the minimum CRUD access needed by the no-sign-in mobile app to `anon` and `authenticated`.
- Uses four separate CRUD policies per table. This is intentionally a single-tenant first version, so the app's shared workspace can read and update its own stored game data without an account flow.

4. Important Notes
- No existing tables, columns, or user data are removed or changed.
- The screenshot table stores analysis metadata only; image files remain on the device in this first version.
*/

CREATE TABLE IF NOT EXISTS coach_account (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  commander_name text NOT NULL DEFAULT 'Warden Kael',
  commander_level integer NOT NULL DEFAULT 65 CHECK (commander_level >= 0),
  power integer NOT NULL DEFAULT 1240000 CHECK (power >= 0),
  power_delta numeric(5,2) NOT NULL DEFAULT 3.00,
  top_current integer NOT NULL DEFAULT 145 CHECK (top_current >= 0),
  top_capacity integer NOT NULL DEFAULT 150 CHECK (top_capacity >= 0),
  mid_current integer NOT NULL DEFAULT 50 CHECK (mid_current >= 0),
  mid_capacity integer NOT NULL DEFAULT 62 CHECK (mid_capacity >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coach_heroes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  stars integer NOT NULL DEFAULT 1 CHECK (stars BETWEEN 1 AND 7),
  level integer NOT NULL DEFAULT 1 CHECK (level >= 1),
  power integer NOT NULL DEFAULT 0 CHECK (power >= 0),
  portrait_key text NOT NULL DEFAULT 'hero',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coach_priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rank integer NOT NULL CHECK (rank > 0),
  title text NOT NULL,
  subtitle text NOT NULL,
  category text NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  icon text NOT NULL DEFAULT 'target',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coach_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tag text NOT NULL,
  recommended_heroes text[] NOT NULL DEFAULT '{}',
  time_remaining text NOT NULL,
  description text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coach_screenshot_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  status text NOT NULL DEFAULT 'analysed',
  detected_at timestamptz NOT NULL DEFAULT now(),
  summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS coach_heroes_power_idx ON coach_heroes (power DESC);
CREATE INDEX IF NOT EXISTS coach_priorities_rank_idx ON coach_priorities (rank ASC);
CREATE INDEX IF NOT EXISTS coach_events_active_idx ON coach_events (active, created_at DESC);
CREATE INDEX IF NOT EXISTS coach_screenshot_imports_created_idx ON coach_screenshot_imports (created_at DESC);

ALTER TABLE coach_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_screenshot_imports ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON coach_account TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON coach_heroes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON coach_priorities TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON coach_events TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON coach_screenshot_imports TO anon, authenticated;

DROP POLICY IF EXISTS "Shared app can read account" ON coach_account;
CREATE POLICY "Shared app can read account" ON coach_account FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Shared app can create account" ON coach_account;
CREATE POLICY "Shared app can create account" ON coach_account FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can update account" ON coach_account;
CREATE POLICY "Shared app can update account" ON coach_account FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can delete account" ON coach_account;
CREATE POLICY "Shared app can delete account" ON coach_account FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Shared app can read heroes" ON coach_heroes;
CREATE POLICY "Shared app can read heroes" ON coach_heroes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Shared app can create heroes" ON coach_heroes;
CREATE POLICY "Shared app can create heroes" ON coach_heroes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can update heroes" ON coach_heroes;
CREATE POLICY "Shared app can update heroes" ON coach_heroes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can delete heroes" ON coach_heroes;
CREATE POLICY "Shared app can delete heroes" ON coach_heroes FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Shared app can read priorities" ON coach_priorities;
CREATE POLICY "Shared app can read priorities" ON coach_priorities FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Shared app can create priorities" ON coach_priorities;
CREATE POLICY "Shared app can create priorities" ON coach_priorities FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can update priorities" ON coach_priorities;
CREATE POLICY "Shared app can update priorities" ON coach_priorities FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can delete priorities" ON coach_priorities;
CREATE POLICY "Shared app can delete priorities" ON coach_priorities FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Shared app can read events" ON coach_events;
CREATE POLICY "Shared app can read events" ON coach_events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Shared app can create events" ON coach_events;
CREATE POLICY "Shared app can create events" ON coach_events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can update events" ON coach_events;
CREATE POLICY "Shared app can update events" ON coach_events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can delete events" ON coach_events;
CREATE POLICY "Shared app can delete events" ON coach_events FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Shared app can read imports" ON coach_screenshot_imports;
CREATE POLICY "Shared app can read imports" ON coach_screenshot_imports FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Shared app can create imports" ON coach_screenshot_imports;
CREATE POLICY "Shared app can create imports" ON coach_screenshot_imports FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can update imports" ON coach_screenshot_imports;
CREATE POLICY "Shared app can update imports" ON coach_screenshot_imports FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Shared app can delete imports" ON coach_screenshot_imports;
CREATE POLICY "Shared app can delete imports" ON coach_screenshot_imports FOR DELETE TO anon, authenticated USING (true);

INSERT INTO coach_account (id, commander_name, commander_level, power, power_delta, top_current, top_capacity, mid_current, mid_capacity)
SELECT 1, 'Warden Kael', 65, 1240000, 3.00, 145, 150, 50, 62
WHERE NOT EXISTS (SELECT 1 FROM coach_account WHERE id = 1);

INSERT INTO coach_heroes (name, role, stars, level, power, portrait_key)
SELECT 'Viktor', 'Assaut', 5, 58, 218400, 'viktor'
WHERE NOT EXISTS (SELECT 1 FROM coach_heroes WHERE name = 'Viktor');
INSERT INTO coach_heroes (name, role, stars, level, power, portrait_key)
SELECT 'Rosa', 'Soutien', 4, 55, 184200, 'rosa'
WHERE NOT EXISTS (SELECT 1 FROM coach_heroes WHERE name = 'Rosa');
INSERT INTO coach_heroes (name, role, stars, level, power, portrait_key)
SELECT 'Kane', 'Défense', 4, 53, 176800, 'kane'
WHERE NOT EXISTS (SELECT 1 FROM coach_heroes WHERE name = 'Kane');

INSERT INTO coach_priorities (rank, title, subtitle, category, progress, icon)
SELECT 1, 'Améliorer Cellule Bloc C niv. 18', 'Temps estimé : 8h 14m', 'Bâtiment', 0, 'building'
WHERE NOT EXISTS (SELECT 1 FROM coach_priorities WHERE title = 'Améliorer Cellule Bloc C niv. 18');
INSERT INTO coach_priorities (rank, title, subtitle, category, progress, icon)
SELECT 2, 'Recherche Sécurité III', 'Temps estimé : 1j 6h', 'Recherche', 0, 'shield'
WHERE NOT EXISTS (SELECT 1 FROM coach_priorities WHERE title = 'Recherche Sécurité III');
INSERT INTO coach_priorities (rank, title, subtitle, category, progress, icon)
SELECT 3, 'Monter héros Viktor ★5', 'Progression : 88%', 'Héros', 88, 'hero'
WHERE NOT EXISTS (SELECT 1 FROM coach_priorities WHERE title = 'Monter héros Viktor ★5');

INSERT INTO coach_events (name, tag, recommended_heroes, time_remaining, description, active)
SELECT 'Émeute', 'ÉVÉNEMENT ACTIF', ARRAY['Viktor', 'Rosa', 'Kane'], '3j 14h', 'Formez une équipe équilibrée pour maximiser les récompenses de contrôle.', true
WHERE NOT EXISTS (SELECT 1 FROM coach_events WHERE name = 'Émeute' AND active = true);
