import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../lib/hash.js";
import { signToken } from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

// Crear usuario admin inicial
authRouter.post("/seed-admin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email y contraseña requeridos" });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: "Usuario ya existe" });

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "ADMIN"
    }
  });

  return res.json({ ok: true, user });
});

// Login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});

// GET /auth/me - devuelve usuario basado en el token
authRouter.get("/me", requireAuth(["ADMIN", "DIRECTOR", "USER"]), async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "No autenticado" });

  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});
