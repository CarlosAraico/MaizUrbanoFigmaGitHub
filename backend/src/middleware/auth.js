import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export function requireAuth(role) {
  return (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No autorizado" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      const roles = Array.isArray(role) ? role : role ? [role] : null;
      if (roles && !roles.includes(decoded.role))
        return res.status(403).json({ error: "Prohibido" });

      next();
    } catch {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
}
