import dotenv from "dotenv";
dotenv.config();

export const API_PORT = Number(process.env.API_PORT || process.env.PORT || 3000);
export const PORT = API_PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || process.env.PLUGIN_SECRET;
export const PLUGIN_SECRET = process.env.PLUGIN_SECRET || process.env.WEBHOOK_SECRET;
