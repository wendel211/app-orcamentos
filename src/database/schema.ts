export const schema = `
-- =========================
-- BUDGETS
-- =========================

CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  address TEXT,
  discount REAL DEFAULT 0,
  extra_fee REAL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  status TEXT DEFAULT 'EM_ANALISE',
  synced INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_budgets_updated_at
ON budgets(updated_at);

CREATE INDEX IF NOT EXISTS idx_budgets_deleted_at
ON budgets(deleted_at);



-- =========================
-- ITEMS
-- =========================

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY NOT NULL,
  budget_id TEXT NOT NULL,
  user_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('MATERIAL','MAO_DE_OBRA','SERVICO')),
  name TEXT NOT NULL,
  qty REAL NOT NULL CHECK (qty >= 0),
  unit_price REAL NOT NULL CHECK (unit_price >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  synced INTEGER DEFAULT 0,
  FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_items_budget_id
ON items(budget_id);

CREATE INDEX IF NOT EXISTS idx_items_updated_at
ON items(updated_at);



-- =========================
-- SYNC META
-- =========================

CREATE TABLE IF NOT EXISTS sync_meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT
);
`;
