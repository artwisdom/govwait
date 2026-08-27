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
  metric_type TEXT NOT NULL DEFAULT 'published' CHECK (metric_type IN ('published','backward','forward','service_standard','percentile')),
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

-- Forward-looking sources can publish a current estimate for a new applicant
-- plus a separate estimate for each application-month cohort. These are not
-- interchangeable with observation history: snapshot_date is when IRCC
-- published the projection, while cohort_month is when the applicant applied.
-- The empty cohort_month marks the headline estimate for an application made
-- today. Rows are append-only across source snapshots.
CREATE TABLE IF NOT EXISTS forward_estimates (
  entity_id TEXT NOT NULL REFERENCES entities(id),
  snapshot_date TEXT NOT NULL,
  cohort_month TEXT NOT NULL DEFAULT '',
  wait_raw TEXT NOT NULL,
  wait_days REAL,
  unit_original TEXT,
  status TEXT NOT NULL CHECK (status IN ('ok','unavailable','insufficient_data')),
  queue_raw TEXT NOT NULL,
  queue_people INTEGER,
  retrieved_at TEXT NOT NULL,
  source_url TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'official',
  PRIMARY KEY (entity_id, snapshot_date, cohort_month)
);

CREATE INDEX IF NOT EXISTS idx_forward_entity ON forward_estimates(entity_id, snapshot_date DESC, cohort_month DESC);
