import { Router } from "express";
import { WEBHOOK_SECRET } from "../config/env.js";

export const webhookRouter = Router();

webhookRouter.post("/", async (req, res) => {
  try {
    const receivedSecret = req.headers["x-webhook-secret"];
    const expectedSecret = WEBHOOK_SECRET;

    if (!receivedSecret || receivedSecret !== expectedSecret) {
      return res.status(401).json({ error: "Invalid webhook secret" });
    }

    console.log("Webhook recibido:", req.body);
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Webhook error" });
  }
});
