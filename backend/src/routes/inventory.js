import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { getStock } from "../inventory/utils/getStock.js";
import { getAverageCost } from "../inventory/utils/getAverageCost.js";
import { WEBHOOK_SECRET, PLUGIN_SECRET } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";

export const inventoryRouter = Router();

inventoryRouter.options("/webhooks/inventory", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Webhook-Secret");
  res.sendStatus(200);
});

inventoryRouter.get("/inventory/stock", async (_req, res) => {
  const items = await prisma.item.findMany({ orderBy: { name: "asc" } });
  const withStock = await Promise.all(
    items.map(async (item) => {
      const stock = await getStock(prisma, item.id);
      return { id: item.id, sku: item.sku, name: item.name, stock };
    })
  );
  return res.json(withStock);
});

inventoryRouter.get("/inventory/dashboard", requireAuth(["ADMIN", "DIRECTOR"]), async (_req, res) => {
  const items = await prisma.item.findMany({
    select: { id: true, name: true, sku: true }
  });

  const mapped = await Promise.all(
    items.map(async (item) => {
      const stock = await getStock(prisma, item.id);
      const avg = await getAverageCost(prisma, item.id);
      return { ...item, stock, averageCost: avg };
    })
  );

  return res.json({ ok: true, data: mapped });
});

function ensureItem(itemId) {
  const id = Number(itemId);
  if (!Number.isFinite(id) || id <= 0) return null;
  return id;
}

// Entrada de inventario
inventoryRouter.post("/inventory/in", requireAuth(["ADMIN", "DIRECTOR"]), async (req, res) => {
  const itemId = ensureItem(req.body?.itemId);
  const quantity = Number(req.body?.quantity);
  const unitCost = req.body?.unitCost == null ? null : Number(req.body.unitCost);

  if (!itemId || !Number.isFinite(quantity) || quantity <= 0)
    return res.status(400).json({ error: "itemId/quantity inválidos" });

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return res.status(404).json({ error: "Item no encontrado" });

  await prisma.inventoryMovement.create({
    data: {
      itemId,
      movementType: "IN",
      quantity,
      unitCost: unitCost != null ? unitCost : null,
      source: req.body?.source || "manual",
      referenceId: req.body?.referenceId || null
    }
  });

  const stock = await getStock(prisma, itemId);
  const avg = await getAverageCost(prisma, itemId);
  return res.json({ ok: true, stock, averageCost: avg });
});

// Salida de inventario
inventoryRouter.post("/inventory/out", requireAuth(["ADMIN", "DIRECTOR"]), async (req, res) => {
  const itemId = ensureItem(req.body?.itemId);
  const quantity = Number(req.body?.quantity);

  if (!itemId || !Number.isFinite(quantity) || quantity <= 0)
    return res.status(400).json({ error: "itemId/quantity inválidos" });

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return res.status(404).json({ error: "Item no encontrado" });

  await prisma.inventoryMovement.create({
    data: {
      itemId,
      movementType: "OUT",
      quantity: -Math.abs(quantity),
      source: req.body?.source || "manual",
      referenceId: req.body?.referenceId || null
    }
  });

  const stock = await getStock(prisma, itemId);
  const avg = await getAverageCost(prisma, itemId);
  return res.json({ ok: true, stock, averageCost: avg });
});

// Ajuste directo
inventoryRouter.post("/inventory/adjust", requireAuth(["ADMIN", "DIRECTOR"]), async (req, res) => {
  const itemId = ensureItem(req.body?.itemId);
  const quantity = Number(req.body?.quantity);

  if (!itemId || !Number.isFinite(quantity))
    return res.status(400).json({ error: "itemId/quantity inválidos" });

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return res.status(404).json({ error: "Item no encontrado" });

  await prisma.inventoryMovement.create({
    data: {
      itemId,
      movementType: "ADJUSTMENT",
      quantity,
      source: req.body?.source || "manual",
      referenceId: req.body?.referenceId || null
    }
  });

  const stock = await getStock(prisma, itemId);
  const avg = await getAverageCost(prisma, itemId);
  return res.json({ ok: true, stock, averageCost: avg });
});

inventoryRouter.get("/inventory/:sku", async (req, res) => {
  const sku = req.params.sku;
  const item = await prisma.item.findUnique({ where: { sku } });
  if (!item) return res.status(404).json({ error: "Item no encontrado" });

  const stock = await getStock(prisma, item.id);
  const avgCost = await getAverageCost(prisma, item.id);

  return res.json({
    material_id: item.sku,
    name: item.name,
    stock,
    averageCost: avgCost
  });
});

inventoryRouter.post("/webhooks/inventory", async (req, res) => {
  const expectedSecret = WEBHOOK_SECRET || PLUGIN_SECRET || "";
  const headerSecret = req.headers["x-webhook-secret"];

  if (!expectedSecret) {
    return res.status(500).json({ error: "WEBHOOK_SECRET no configurado" });
  }
  if (headerSecret !== expectedSecret) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const { event_id, material_id, new_stock, source } = req.body || {};
  if (!event_id || !material_id || new_stock === undefined) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const newStock = Number(new_stock);
  if (!Number.isFinite(newStock) || newStock < 0) {
    return res.status(400).json({ error: "new_stock invalido" });
  }

  const existingEvent = await prisma.inventoryMovement.findFirst({
    where: { referenceId: String(event_id) }
  });
  if (existingEvent) {
    const currentStock = await getStock(prisma, existingEvent.itemId);
    return res.json({ idempotent: true, stock: currentStock });
  }

  let item = await prisma.item.findUnique({ where: { sku: material_id } });
  if (!item) {
    item = await prisma.item.create({
      data: {
        sku: material_id,
        name: material_id,
        unit: "unit"
      }
    });
  }

  const currentStock = await getStock(prisma, item.id);
  const delta = newStock - currentStock;

  await prisma.inventoryMovement.create({
    data: {
      itemId: item.id,
      movementType: "ADJUSTMENT",
      quantity: delta,
      unitCost: null,
      source: source || "webhook",
      referenceId: String(event_id)
    }
  });

  return res.json({
    ok: true,
    idempotent: false,
    stock: newStock,
    delta
  });
});
