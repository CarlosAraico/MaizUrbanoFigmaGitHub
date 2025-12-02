const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { openDatabase } = require("./db");

dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT || 4000);
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "data", "inventory.db");
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.warn(
    "[warn] WEBHOOK_SECRET is not set. Configure backend/.env before production."
  );
}

const db = openDatabase(DB_PATH);
const app = express();

app.use(cors());
app.use(express.json());

const getItem = db.prepare(
  "SELECT id, name, stock, updated_at as updatedAt FROM inventory WHERE id = ?"
);
const upsertItem = db.prepare(`
  INSERT INTO inventory (id, name, stock, updated_at)
  VALUES (@id, @name, @stock, CURRENT_TIMESTAMP)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    stock = excluded.stock,
    updated_at = CURRENT_TIMESTAMP
`);
const updateDelta = db.prepare(`
  UPDATE inventory
  SET name = COALESCE(@name, name),
      stock = MAX(0, stock + @delta),
      updated_at = CURRENT_TIMESTAMP
  WHERE id = @id
`);
const ensureExists = db.prepare(`
  INSERT INTO inventory (id, name, stock)
  VALUES (?, ?, 0)
  ON CONFLICT(id) DO NOTHING
`);
const getEvent = db.prepare(
  "SELECT event_id FROM webhook_events WHERE event_id = ?"
);
const insertEvent = db.prepare(
  "INSERT INTO webhook_events (event_id, payload) VALUES (?, ?)"
);

const applyInventoryChanges = db.transaction((eventId, payload) => {
  const { items = [], source } = payload;
  const results = [];

  items.forEach((item) => {
    const id = String(item.id || "").trim();
    if (!id) throw new Error("Each item requires a non-empty id");
    const name = (item.name || id).trim() || id;
    const hasQuantity =
      typeof item.quantity === "number" && Number.isFinite(item.quantity);
    const hasDelta =
      typeof item.delta === "number" && Number.isFinite(item.delta);

    if (!hasQuantity && !hasDelta) {
      throw new Error(`Item ${id} requires quantity or delta`);
    }

    ensureExists.run(id, name);

    let newStock = 0;
    if (hasQuantity) {
      newStock = Math.max(0, Math.round(item.quantity));
      upsertItem.run({ id, name, stock: newStock });
    } else {
      const delta = Math.round(item.delta);
      updateDelta.run({ id, name, delta });
      const updated = getItem.get(id);
      newStock = updated ? updated.stock : 0;
    }

    results.push({ id, name, stock: newStock, source: source || null });
  });

  insertEvent.run(eventId, JSON.stringify(payload));
  return results;
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "mu-backend", ts: Date.now() });
});

app.get("/api/inventory/:id", (req, res) => {
  const id = String(req.params.id || "").trim();
  if (!id) return res.status(400).json({ error: "Missing id" });
  const item = getItem.get(id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  return res.json({ item });
});

app.post("/api/webhooks/inventory", (req, res) => {
  const providedSecret = req.headers["x-webhook-secret"];
  if (!WEBHOOK_SECRET || providedSecret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { eventId, items } = req.body || {};

  if (typeof eventId !== "string" || !eventId.trim()) {
    return res.status(400).json({ error: "eventId is required" });
  }
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "items must be a non-empty array" });
  }

  const existing = getEvent.get(eventId);
  if (existing) {
    return res
      .status(200)
      .json({ status: "duplicate", processed: false, items: [] });
  }

  try {
    const results = applyInventoryChanges(eventId, req.body);
    return res.json({
      status: "processed",
      processed: true,
      items: results,
    });
  } catch (err) {
    console.error("[webhook] failed to apply changes", err);
    return res
      .status(400)
      .json({ error: err.message || "Failed to apply inventory changes" });
  }
});

app.use((err, _req, res, _next) => {
  console.error("[global-error]", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
