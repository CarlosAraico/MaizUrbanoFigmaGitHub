const path = require("path");
const dotenv = require("dotenv");
const { openDatabase } = require("../db");

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "..", "data", "inventory.db");

const items = [
  { id: "corn-blue", name: "Maiz azul", stock: 120 },
  { id: "corn-yellow", name: "Maiz amarillo", stock: 140 },
  { id: "masa-premium", name: "Masa premium", stock: 80 },
  { id: "pack-bio", name: "Empaque biodegradable", stock: 200 },
];

function seed(db) {
  const upsert = db.prepare(`
    INSERT INTO inventory (id, name, stock, updated_at)
    VALUES (@id, @name, @stock, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      stock = excluded.stock,
      updated_at = CURRENT_TIMESTAMP
  `);

  const run = db.transaction((list) => list.forEach((item) => upsert.run(item)));
  run(items);
}

function main() {
  const db = openDatabase(DB_PATH);
  seed(db);
  console.log(
    `Seed ready (${items.length} items) -> ${path.resolve(DB_PATH)}`
  );
  db.close();
}

if (require.main === module) {
  main();
}

module.exports = { seed, items };
