const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const migrations = [
  {
    name: "2025-12-02-init",
    script: `
      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventory_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL UNIQUE,
        payload TEXT NOT NULL,
        received_from TEXT,
        received_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_materials_sku ON materials (sku);
      CREATE INDEX IF NOT EXISTS idx_events_event_id ON inventory_events (event_id);
    `,
  },
];

function openDatabase(dbPath) {
  const resolved = path.resolve(dbPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  return new Database(resolved);
}

function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      run_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  migrations.forEach((migration) => {
    const alreadyRun = db
      .prepare("SELECT 1 FROM migrations WHERE name = ?")
      .get(migration.name);
    if (alreadyRun) return;

    const apply = db.transaction(() => {
      db.exec(migration.script);
      db.prepare("INSERT INTO migrations (name) VALUES (?)").run(migration.name);
    });

    apply();
  });
}

module.exports = {
  openDatabase,
  runMigrations,
};
