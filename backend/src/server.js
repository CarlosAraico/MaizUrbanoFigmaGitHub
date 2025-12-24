import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { inventory, processed } from "./store.js";

const backendRoot = fs.existsSync(path.resolve(process.cwd(), "data", "menu.json"))
  ? process.cwd()
  : path.resolve(process.cwd(), "backend");

dotenv.config({ path: path.resolve(backendRoot, ".env") });
const app = express();
const PORT = Number(process.env.PORT || 4000);
const SECRET = process.env.WEBHOOK_SECRET;
if (!SECRET) {
  console.error("Falta WEBHOOK_SECRET en backend/.env");
  process.exit(1);
}

app.use(express.json());
app.use(cors());

const orders = [];

function readMenu() {
  const p = path.resolve(backendRoot, "data", "menu.json");
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "mu-v4-backend", ts: Date.now() });
});

app.get("/api/menu", (_req, res) => {
  try {
    const menu = readMenu();
    res.json(menu);
  } catch (e) {
    res.status(500).json({ error: "menu_read_failed" });
  }
});

app.get("/api/inventory/:id", (req, res) => {
  const id = String(req.params.id);
  res.json({ material_id: id, stock: inventory.get(id) ?? 0 });
});

app.post("/api/orders", (req, res) => {
  const body = req.body ?? {};
  const items = Array.isArray(body.items) ? body.items : [];
  const customer = body.customer ?? {};
  const delivery = body.delivery ?? {};
  const totals = body.totals ?? {};

  if (!items.length) return res.status(400).json({ error: "no_items" });
  if (!customer?.name || !customer?.phone) return res.status(400).json({ error: "missing_customer" });
  if (!totals || typeof totals.total !== "number") return res.status(400).json({ error: "missing_totals" });

  const orderId = `MU-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const row = { orderId, createdAt, customer, delivery, items, totals };
  orders.unshift(row);

  return res.json({ ok: true, orderId, createdAt });
});

app.get("/api/orders", (_req, res) => {
  res.json({ ok: true, count: orders.length, orders });
});

app.post("/api/webhooks/inventory", (req, res) => {
  const headerSecret = req.get("x-webhook-secret");
  if (headerSecret !== SECRET) return res.status(401).json({ error: "invalid_secret" });

  const { event_id, material_id, new_stock } = req.body ?? {};
  if (!event_id || !material_id || typeof new_stock !== "number" || !Number.isFinite(new_stock)) {
    return res.status(400).json({ error: "bad_request" });
  }

  if (processed.has(event_id)) {
    return res.json({ ok: true, idempotent: true, material_id, stock: inventory.get(material_id) ?? 0 });
  }

  processed.add(event_id);
  inventory.set(material_id, new_stock);
  return res.json({ ok: true, idempotent: false, material_id, stock: new_stock, at: Date.now() });
});

app.listen(PORT, () => console.log(`Backend -> http://127.0.0.1:${PORT}`));
