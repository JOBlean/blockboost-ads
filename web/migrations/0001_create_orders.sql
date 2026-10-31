-- Creates the orders table. Wrangler runs each migration file once, in number order.
CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  roblox_user TEXT NOT NULL,
  contact     TEXT NOT NULL,
  game_link   TEXT NOT NULL DEFAULT '',
  package     TEXT NOT NULL,
  headline    TEXT NOT NULL,
  details     TEXT NOT NULL DEFAULT '',
  deadline    TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'New',
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
