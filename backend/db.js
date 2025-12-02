const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const migrations = [
  {
    name: "2025-12-02-init",
    script: `
      CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS webhook_events (
        event_id TEXT PRIMARY KEY,
        payload TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
    `,
  },
];

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function openDatabase(dbPath) {
  const resolved = path.resolve(dbPath);
  ensureDir(resolved);
  const db = new Database(resolved);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  return db;
}

function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      run_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  migrations.forEach((migration) => {
    const exists = db
      .prepare("SELECT 1 FROM migrations WHERE name = ?")
      .get(migration.name);
    if (exists) return;
    const apply = db.transaction(() => {
      db.exec(migration.script);
      db.prepare("INSERT INTO migrations (name) VALUES (?)").run(migration.name);
    });
    apply();
  });
}

module.exports = {
  openDatabase,
};
