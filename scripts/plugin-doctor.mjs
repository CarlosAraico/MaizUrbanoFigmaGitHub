#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const FIX = process.argv.includes("--fix");
const root = resolve(new URL(".", import.meta.url).pathname, "..");
const manifestPath = resolve(root, "figma-plugin/manifest.json");
const envPath = resolve(root, "figma-plugin/.env.local");

const env = await loadEnv();
const base = process.env.PLUGIN_BASE || env.PLUGIN_BASE;
const secret = process.env.WEBHOOK_SECRET || env.PLUGIN_SECRET || env.WEBHOOK_SECRET;

if (!base) {
  console.warn("⚠️  No se encontró PLUGIN_BASE (usa env o figma-plugin/.env.local)");
}
if (!secret) {
  console.warn("⚠️  No se encontró PLUGIN_SECRET/WEBHOOK_SECRET (usa env o figma-plugin/.env.local)");
}

const mf = JSON.parse(await readFile(manifestPath, "utf8").catch(() => "{}"));
mf.networkAccess ??= {};
mf.networkAccess.allowedDomains ??= [];

const origin = base ? toOrigin(base) : null;
const wildcard = "https://*.ngrok-free.dev";

const missing = [];
if (origin && !mf.networkAccess.allowedDomains.includes(origin)) missing.push(origin);
if (origin && origin.includes(".ngrok-free.dev") && !mf.networkAccess.allowedDomains.includes(wildcard)) missing.push(wildcard);

if (missing.length === 0) {
  console.log("✅ allowedDomains ok", mf.networkAccess.allowedDomains);
  process.exit(0);
}

if (!FIX) {
  console.error("❌ allowedDomains incompleto. Falta:", missing.join(", "));
  process.exit(1);
}

mf.networkAccess.allowedDomains.push(...missing);
await writeFile(manifestPath, JSON.stringify(mf, null, 2) + "\n", "utf8");
console.log("✅ manifest.json actualizado con:", missing.join(", "));
process.exit(0);

async function loadEnv() {
  try {
    const txt = await readFile(envPath, "utf8");
    return parse(txt);
  } catch {
    return {};
  }
}

function parse(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

function toOrigin(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}
