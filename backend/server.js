const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { openDatabase, runMigrations } = require("./db");

const PORT = Number(process.env.PORT) || 4000;
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "data", "inventory.db");
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const db = openDatabase(DB_PATH);
runMigrations(db);

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const selectEvent = db.prepare(
  "SELECT id FROM inventory_events WHERE event_id = ?"
);

const insertEvent = db.prepare(`
  INSERT INTO inventory_events (event_id, payload, received_from)
  VALUES (?, ?, ?)
`);

const ensureMaterial = db.prepare(`
  INSERT INTO materials (sku, name, stock, updated_at)
  VALUES (?, ?, 0, CURRENT_TIMESTAMP)
  ON CONFLICT(sku) DO NOTHING
`);

const upsertMaterial = db.prepare(`
  INSERT INTO materials (sku, name, stock, updated_at)
  VALUES (@sku, @name, @stock, CURRENT_TIMESTAMP)
  ON CONFLICT(sku) DO UPDATE SET
    name = excluded.name,
    stock = excluded.stock,
    updated_at = CURRENT_TIMESTAMP
`);

const adjustMaterial = db.prepare(`
  UPDATE materials
  SET stock = stock + @delta,
      name = COALESCE(@name, name),
      updated_at = CURRENT_TIMESTAMP
  WHERE sku = @sku
`);

const applyInventory = db.transaction((eventId, payload) => {
  const { changes = [], source } = payload;

  changes.forEach((change) => {
    const sku = (change.sku || "").trim();
    if (!sku) throw new Error("Each change must include a non-empty sku");

    const name = change.name || sku;
    const hasQuantity = typeof change.quantity === "number";
    const hasDelta = typeof change.delta === "number";

    if (!hasQuantity && !hasDelta) {
      throw new Error(`Change for sku ${sku} requires quantity or delta`);
    }

    ensureMaterial.run(sku, name);

    if (hasQuantity) {
      upsertMaterial.run({ sku, name, stock: change.quantity });
    } else {
      adjustMaterial.run({ sku, name, delta: change.delta });
    }
  });

  insertEvent.run(eventId, JSON.stringify(payload), source || null);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", db: "connected" });
});

app.get("/materials", (_req, res) => {
  const materials = db
    .prepare(
      "SELECT sku, name, stock, updated_at as updatedAt FROM materials ORDER BY sku"
    )
    .all();
  res.json({ items: materials, count: materials.length });
});

app.post("/webhook/inventory", (req, res) => {
  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: "WEBHOOK_SECRET is not configured" });
  }

  const providedSecret = req.headers["x-webhook-secret"];
  if (providedSecret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized: invalid secret" });
  }

  const { eventId, changes } = req.body || {};
  if (!eventId || !Array.isArray(changes)) {
    return res.status(400).json({
      error: "Payload must include eventId and array of changes",
    });
  }

  const alreadyProcessed = selectEvent.get(eventId);
  if (alreadyProcessed) {
    return res.status(200).json({
      status: "duplicate",
      processed: false,
      message: "Event already processed",
    });
  }

  try {
    applyInventory(eventId, req.body);
    res.json({
      status: "processed",
      processed: true,
      items: changes.length,
    });
  } catch (err) {
    console.error("Failed to process inventory webhook", err);
    res.status(400).json({
      error: err.message || "Failed to apply inventory changes",
    });
  }
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error", err);
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(PORT, () => {
  console.log(`Backend ready on http://0.0.0.0:${PORT}`);
});

["SIGTERM", "SIGINT"].forEach((signal) => {
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
});
