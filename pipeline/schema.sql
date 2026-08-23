PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  agency TEXT NOT NULL,
  url TEXT NOT NULL,
  license_note TEXT,
  robots_status TEXT,
  robots_checked_at TEXT
);

CREATE TABLE IF NOT EXISTS entities (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES sources(id),
  jurisdiction TEXT NOT NULL,
  service_category TEXT NOT NULL CHECK (service_category IN ('visa','permit','sponsorship','refugee','settlement','passport')),
  service_key TEXT NOT NULL,
  service_name TEXT NOT NULL,
  applicant_country TEXT,
  applicant_country_name TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  UNIQUE(jurisdiction, service_key, applicant_country)
);

CREATE TABLE IF NOT EXISTS observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id TEXT NOT NULL REFERENCES entities(id),
  value_raw TEXT NOT NULL,
  value_days REAL,
  unit_original TEXT,
  status TEXT NOT NULL CHECK (status IN ('ok','unavailable','insufficient_data')),
  effective_date TEXT NOT NULL,
  retrieved_at TEXT NOT NULL,
  source_url TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'official',
  UNIQUE(entity_id, effective_date)
);

CREATE INDEX IF NOT EXISTS idx_obs_entity ON observations(entity_id, effective_date DESC);
