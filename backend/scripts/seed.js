const path = require("path");
const { openDatabase, runMigrations } = require("../db");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "..", "data", "inventory.db");

const defaultMaterials = [
  { sku: "MU-MAIZ-AZUL-01", name: "Maiz azul", stock: 120 },
  { sku: "MU-MAIZ-AMARILLO-01", name: "Maiz amarillo", stock: 140 },
  { sku: "MU-EMPAQUE-01", name: "Bolsas biodegradables", stock: 200 },
  { sku: "MU-CONTENEDOR-01", name: "Contenedores compostables", stock: 160 },
];

function seed(db, materials) {
  const upsert = db.prepare(`
    INSERT INTO materials (sku, name, stock, updated_at)
    VALUES (@sku, @name, @stock, CURRENT_TIMESTAMP)
    ON CONFLICT(sku) DO UPDATE SET
      name = excluded.name,
      stock = excluded.stock,
      updated_at = CURRENT_TIMESTAMP
  `);

  const run = db.transaction((items) => {
    items.forEach((item) => upsert.run(item));
  });

  run(materials);
}

function main() {
  const db = openDatabase(DB_PATH);
  runMigrations(db);
  seed(db, defaultMaterials);
  console.log(
    `Seed complete. Materials: ${defaultMaterials.length}. DB: ${path.resolve(
      DB_PATH
    )}`
  );
  db.close();
}

if (require.main === module) {
  main();
}

module.exports = { seed, defaultMaterials };
