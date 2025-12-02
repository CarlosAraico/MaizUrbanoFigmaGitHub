import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { inventory, processed } from "./store.js";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 4000);
const SECRET = process.env.WEBHOOK_SECRET;
if (!SECRET) { console.error("Falta WEBHOOK_SECRET en backend/.env"); process.exit(1); }

app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "mu-v4-backend", ts: Date.now() });
});

app.get("/api/inventory/:id", (req, res) => {
  const id = String(req.params.id);
  if (!inventory.has(id)) {
    return res.status(404).json({ error: "not_found", material_id: id });
  }
  res.json({ material_id: id, stock: inventory.get(id) ?? 0 });
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
