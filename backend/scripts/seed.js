import fs from "fs";
import path from "path";

const dbPath = process.env.DB_PATH;

if (!dbPath) {
  console.warn("[seed] DB_PATH no definido; seed no-op (ok).");
  process.exit(0);
}

const abs = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);
fs.mkdirSync(path.dirname(abs), { recursive: true });

if (!fs.existsSync(abs)) {
  fs.writeFileSync(abs, "MU_SEED_OK\n", "utf8");
  console.log(`[seed] DB creado: ${abs}`);
} else {
  console.log(`[seed] DB ya existe: ${abs}`);
}

process.exit(0);
