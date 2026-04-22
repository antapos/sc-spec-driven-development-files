PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS agents (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  name   TEXT NOT NULL,
  model  TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ailments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS therapies (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  description      TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id     INTEGER NOT NULL REFERENCES agents(id),
  ailment_id   INTEGER NOT NULL REFERENCES ailments(id),
  therapy_id   INTEGER NOT NULL REFERENCES therapies(id),
  scheduled_at TEXT NOT NULL,
  status       TEXT NOT NULL
);
