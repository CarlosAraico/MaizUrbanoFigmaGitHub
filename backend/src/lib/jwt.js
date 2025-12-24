import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
