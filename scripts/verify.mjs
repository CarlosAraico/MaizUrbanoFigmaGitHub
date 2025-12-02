#!/usr/bin/env node
/**
 * E2E hardened (Node 20+, sin deps).
 * Valida: health local/remoto, CORS preflight, webhook idempotente,
 * header lowercase, stock=0, id inexistente (404 en --strict), content-type JSON.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const argv = new Set(process.argv.slice(2));
const STRICT = argv.has("--strict");
const REPORT_PATH = process.env.REPORT_PATH
  ? resolve(process.cwd(), process.env.REPORT_PATH)
  : resolve(process.cwd(), "artifacts/e2e-report.json");

const steps = [];

const env = await loadEnv();
const BASE = (process.env.PLUGIN_BASE ?? env.PLUGIN_BASE ?? "").trim();
const SECRET = (process.env.WEBHOOK_SECRET ?? env.WEBHOOK_SECRET ?? env.PLUGIN_SECRET ?? "").trim();
const MAT_ID = (process.env.MATERIAL_ID ?? "corn-blue").trim();
const NEW_STOCK = Number(process.env.NEW_STOCK ?? 123);

assert(BASE && /^https?:\/\//.test(BASE), "PLUGIN_BASE requerido (https://<ngrok>.ngrok-free.dev o http://127.0.0.1:4000)");
assert(SECRET, "WEBHOOK_SECRET requerido (o PLUGIN_SECRET en .env.local)");
assert(Number.isFinite(NEW_STOCK), "NEW_STOCK debe ser numero");

const EVENT_ID = `evt-${Date.now()}-${rand(4)}`;
const EVENT_ID2 = `evt-${Date.now()}-${rand(4)}-zero`;

log(`BASE=${BASE}`);
log(`MATERIAL_ID=${MAT_ID} NEW_STOCK=${NEW_STOCK} EVENT_ID=${EVENT_ID}`);

await step("Health LOCAL", async () => {
  const r = await get("http://127.0.0.1:4000/api/health");
  expectOk(r);
});

await step("Health REMOTO", async () => {
  const r = await get(`${BASE}/api/health`);
  expectOk(r);
});

await step("CORS preflight OPTIONS /api/webhooks/inventory", async () => {
  const r = await options(`${BASE}/api/webhooks/inventory`, {
    Origin: "https://localhost",
    "Access-Control-Request-Method": "POST",
  });
  if (!r.ok && STRICT) failHttp(r);
  const allowOrigin = r.headers.get("access-control-allow-origin") || "";
  const allowMethods = r.headers.get("access-control-allow-methods") || "";
  if (STRICT) {
    assert(allowOrigin === "*" || allowOrigin.length > 0, "CORS: falta Access-Control-Allow-Origin");
    assert(allowMethods.toUpperCase().includes("POST"), "CORS: Allow-Methods no incluye POST");
  }
});

await step("Webhook inicial (X-Webhook-Secret)", async () => {
  const r = await post(
    `${BASE}/api/webhooks/inventory`,
    { event_id: EVENT_ID, material_id: MAT_ID, new_stock: NEW_STOCK },
    { "X-Webhook-Secret": SECRET }
  );
  expectOk(r);
  expectJson(r);
});

await step("Webhook idempotente (mismo event_id)", async () => {
  const r = await post(
    `${BASE}/api/webhooks/inventory`,
    { event_id: EVENT_ID, material_id: MAT_ID, new_stock: NEW_STOCK },
    { "X-Webhook-Secret": SECRET }
  );
  expectOk(r);
  expectJson(r);
});

await step("Webhook con header lowercase (x-webhook-secret)", async () => {
  const r = await post(
    `${BASE}/api/webhooks/inventory`,
    { event_id: `${EVENT_ID}-lc`, material_id: MAT_ID, new_stock: NEW_STOCK },
    { "x-webhook-secret": SECRET }
  );
  expectOk(r);
  expectJson(r);
});

await step("Inventario y validacion de stock", async () => {
  const data = await getJson(`${BASE}/api/inventory/${encodeURIComponent(MAT_ID)}`);
  const stock = Number(data.stock);
  assert(Number.isFinite(stock), "Inventario sin `stock` numerico");
  assert(stock === NEW_STOCK, `Stock esperado ${NEW_STOCK}, recibido ${stock}`);
});

await step("Webhook con stock=0", async () => {
  const r = await post(
    `${BASE}/api/webhooks/inventory`,
    { event_id: EVENT_ID2, material_id: MAT_ID, new_stock: 0 },
    { "X-Webhook-Secret": SECRET }
  );
  expectOk(r);
  expectJson(r);
});

await step("Validacion stock=0", async () => {
  const data = await getJson(`${BASE}/api/inventory/${encodeURIComponent(MAT_ID)}`);
  const stock = Number(data.stock);
  assert(stock === 0, `Stock esperado 0 tras webhook, recibido ${stock}`);
});

await step("Inventario id inexistente", async () => {
  const url = `${BASE}/api/inventory/__no_such_id__`;
  const res = await fetch(url, { method: "GET", headers: ua() });
  if (STRICT) {
    assert(res.status === 404, `Se esperaba 404, recibido ${res.status}`);
  } else {
    assert(res.status !== 500, `No debe responder 500 (recibido ${res.status})`);
  }
});

await writeReport(true);
done(0);

// ---------- HTTP helpers ----------
function ua() {
  return { "User-Agent": "mu-e2e/1.3 (+gh actions)" };
}

async function get(url) {
  return retry(() => fetch(url, { method: "GET", headers: ua() }), { label: `GET ${url}` });
}

async function options(url, headers) {
  return retry(() => fetch(url, { method: "OPTIONS", headers: { ...ua(), ...headers } }), {
    label: `OPTIONS ${url}`,
  });
}

async function getJson(url) {
  const res = await retry(
    () => fetch(url, { method: "GET", headers: { ...ua(), Accept: "application/json" } }),
    { label: `GET ${url}` }
  );
  expectOk(res);
  expectJson(res);
  return res.json();
}

async function post(url, body, extraHeaders = {}) {
  return retry(
    () =>
      fetch(url, {
        method: "POST",
        headers: { ...ua(), "Content-Type": "application/json", ...extraHeaders },
        body: JSON.stringify(body),
      }),
    { label: `POST ${url}` }
  );
}

// ---------- Step/report ----------
async function step(label, fn) {
  const start = Date.now();
  let http;
  let note = "";
  let ct = "";
  let bodySample = "";
  let status = "ok";
  try {
    const res = await fn();
    if (res && res.status) {
      http = res.status;
      ct = res.headers?.get?.("content-type") ?? "";
      try {
        if (ct.toLowerCase().includes("application/json")) {
          bodySample = JSON.stringify(await res.clone().json()).slice(0, 400);
        } else if (typeof res.text === "function") {
          bodySample = (await res.clone().text()).slice(0, 200);
        }
      } catch {
        /* ignore */
      }
    }
    ok(`${label}${http ? ` (${http})` : ""}`);
    return res;
  } catch (e) {
    status = "fail";
    note = e?.message ?? String(e);
    err(`${label} -> ${note}`);
    await writeReport(false, { label, status, http, note, ct, bodySample, ms: Date.now() - start });
    done(1);
  } finally {
    steps.push({ ts: new Date().toISOString(), label, status, http, note, ct, bodySample, ms: Date.now() - start });
  }
}

function expectOk(res) {
  if (!res.ok) failHttp(res);
}
function expectJson(res) {
  const ct = res.headers.get("content-type") || "";
  assert(ct.toLowerCase().includes("application/json"), `content-type invalido: ${ct}`);
}
function failHttp(res) {
  throw new Error(`HTTP ${res.status} ${res.statusText}`);
}

async function retry(fn, { attempts = 3, backoffs = [200, 600, 1200], label = "request" } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fn();
      if (r.ok || !STRICT) return r;
      lastErr = new Error(`${label} -> HTTP ${r.status}`);
    } catch (e) {
      lastErr = e;
    }
    if (i < backoffs.length) await delay(backoffs[i]);
  }
  throw lastErr ?? new Error(`${label} agoto reintentos`);
}

// ---------- Util ----------
function ok(msg) {
  console.log(`✅ ${msg}`);
}
function log(msg) {
  console.log(`🔎 ${msg}`);
}
function err(msg) {
  console.error(`❌ ${msg}`);
}
function rand(n = 6) {
  return randomBytes(n).toString("hex");
}
function assert(c, m) {
  if (!c) throw new Error(m);
}

async function loadEnv() {
  const base = {
    PLUGIN_BASE: process.env.PLUGIN_BASE,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    MATERIAL_ID: process.env.MATERIAL_ID,
    NEW_STOCK: process.env.NEW_STOCK,
  };
  try {
    const txt = await readFile(new URL("../figma-plugin/.env.local", import.meta.url)).then((b) => b.toString());
    const envFile = parseDotenv(txt);
    return {
      ...envFile,
      ...base,
      PLUGIN_BASE: base.PLUGIN_BASE ?? envFile.PLUGIN_BASE,
      WEBHOOK_SECRET: base.WEBHOOK_SECRET ?? envFile.PLUGIN_SECRET ?? envFile.WEBHOOK_SECRET,
    };
  } catch {
    /* ignore */
  }
  return base;
}

function parseDotenv(text) {
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

async function writeReport(success, extraStep) {
  if (extraStep) steps.push({ ts: new Date().toISOString(), ...extraStep });
  const report = {
    success,
    startedAt: steps[0]?.ts ?? new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    env: { base: BASE, materialId: MAT_ID, newStock: NEW_STOCK, strict: !!STRICT },
    steps,
  };
  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2));
  log(`Reporte JSON -> ${REPORT_PATH}`);
}

function done(code) {
  process.exitCode = code;
  process.exit(code);
}
