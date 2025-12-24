import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const menuRouter = Router();

function validateMenuPayload(body) {
  const errors = [];
  const name = (body.name || "").trim();
  const description = body.description ?? null;
  const category = body.category ?? null;
  const imageUrl = body.imageUrl ?? null;
  const price = Number(body.price);
  const cost = body.cost === undefined || body.cost === null ? null : Number(body.cost);

  if (!name) errors.push("Nombre requerido");
  if (!Number.isFinite(price) || price < 0) errors.push("Precio inválido");
  if (cost !== null && (!Number.isFinite(cost) || cost < 0)) errors.push("Costo inválido");

  return {
    ok: errors.length === 0,
    errors,
    data: { name, description, category, imageUrl, price, cost }
  };
}

// Obtener platillos (filtrado opcional por categoria / activos)
menuRouter.get("/", async (req, res) => {
  const category = req.query.category;
  const includeInactive = req.query.includeInactive === "true" || req.query.all === "true";

  const items = await prisma.menuItem.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(category ? { category } : {})
    },
    orderBy: { name: "asc" }
  });

  return res.json(items);
});

// Obtener platillo por id
menuRouter.get("/:id", requireAuth(["ADMIN", "DIRECTOR"]), async (req, res) => {
  const id = Number(req.params.id);
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ error: "Platillo no encontrado" });
  return res.json(item);
});

// Crear nuevo platillo (solo ADMIN)
menuRouter.post("/", requireAuth("ADMIN"), async (req, res) => {
  const validated = validateMenuPayload(req.body || {});
  if (!validated.ok) return res.status(400).json({ error: validated.errors.join(", ") });

  const item = await prisma.menuItem.create({ data: validated.data });

  return res.json(item);
});

// Editar platillo
menuRouter.put("/:id", requireAuth("ADMIN"), async (req, res) => {
  const id = Number(req.params.id);

  const validated = validateMenuPayload(req.body || {});
  if (!validated.ok) return res.status(400).json({ error: validated.errors.join(", ") });

  const item = await prisma.menuItem.update({ where: { id }, data: validated.data });

  return res.json(item);
});

// Borrado lógico
menuRouter.delete("/:id", requireAuth("ADMIN"), async (req, res) => {
  const id = Number(req.params.id);

  const item = await prisma.menuItem.update({
    where: { id },
    data: { isActive: false }
  });

  return res.json(item);
});
