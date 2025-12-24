import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const configRouter = Router();

// Obtener bloque de configuración por key
configRouter.get("/:key", async (req, res) => {
  const { key } = req.params;

  const row = await prisma.config.findUnique({ where: { key } });

  if (!row) return res.json(null);
  return res.json(row.value);
});

// Actualizar bloque de configuración (solo ADMIN)
configRouter.put("/:key", requireAuth("ADMIN"), async (req, res) => {
  const { key } = req.params;

  const row = await prisma.config.upsert({
    where: { key },
    create: { key, value: req.body },
    update: { value: req.body }
  });

  return res.json(row.value);
});
