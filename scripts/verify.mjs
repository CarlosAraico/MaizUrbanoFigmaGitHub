/**
 * Verificador E2E sin dependencias (Node 20+).
 * Carga PLUGIN_BASE, WEBHOOK_SECRET, MATERIAL_ID, NEW_STOCK de env o figma-plugin/.env.local.
 * Ejecuta health local/remoto, webhook idempotente e inventory.
 * Emite reporte JSON (artifacts/e2e-report.json por defecto).
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { resolve, dirname } from "node:path";

const argv = new Map(process.argv.slice(2).map((a) => {
  const [k, v] = a.split("=");
  return [k, v ?? true];
}));
const STRICT = argv.has("--strict");
const REPORT_PATH = resolveReportPath(
  argv.get("--report") || process.env.REPORT_PATH || "artifacts/e2e-report.json"
);

const steps = [];

// ---------- Entorno ----------
const env = await loadEnv();
const BASE = env.PLUGIN_BASE?.trim();
const SECRET = env.WEBHOOK_SECRET?.trim();
const MAT_ID = (env.MATERIAL_ID ?? "corn-blue").trim();
const NEW_STOCK = Number(env.NEW_STOCK ?? 123);
const EVENT_ID = `evt-${Date.now()}-${rand(3)}`;

assert(BASE && /^https?:\/\//.test(BASE), "PLUGIN_BASE requerido, ej: https://<ngrok>.ngrok-free.dev o http://127.0.0.1:4000");
assert(SECRET, "WEBHOOK_SECRET requerido");
assert(Number.isFinite(NEW_STOCK), "NEW_STOCK debe ser numerico");

log(`BASE=${BASE}`);
log(`MATERIAL_ID=${MAT_ID} NEW_STOCK=${NEW_STOCK} EVENT_ID=${EVENT_ID}`);

// ---------- Tests ----------
await step("Health LOCAL", async () => {
  const res = await get("http://127.0.0.1:4000/api/health");
  expectOk(res);
});

await step("Health REMOTO", async () => {
  const res = await get(`${BASE}/api/health`);
  expectOk(res);
});

const payload = { event_id: EVENT_ID, material_id: MAT_ID, new_stock: NEW_STOCK };

await step("Webhook inicial", async () => {
  const res = await post(`${BASE}/api/webhooks/inventory`, payload, SECRET);
  expectOk(res);
  expectJson(res);
});

await step("Webhook idempotente", async () => {
  const res = await post(`${BASE}/api/webhooks/inventory`, payload, SECRET);
  expectOk(res);
  expectJson(res);
});

await step("Inventario y stock", async () => {
  const res = await get(`${BASE}/api/inventory/${encodeURIComponent(MAT_ID)}`, {
    acceptJson: true,
  });
  expectOk(res);
  expectJson(res);
  const data = await res.json();
  const stock = Number(data?.stock);
  assert(Number.isFinite(stock), "Inventario sin stock numerico");
  assert(stock === NEW_STOCK, `Stock esperado ${NEW_STOCK}, recibido ${stock}`);
});

await writeReport(true);
done(0);

// ---------- HTTP helpers ----------
function ua() {
  return { "User-Agent": "mu-e2e/1.2 (+github actions)" };
}

async function get(url, { acceptJson = false } = {}) {
  return retry(
    () =>
      fetch(url, {
        method: "GET",
        headers: { ...ua(), ...(acceptJson ? { Accept: "application/json" } : {}) },
      }),
    { label: `GET ${url}` }
  );
}

async function post(url, body, secret) {
  return retry(
    () =>
      fetch(url, {
        method: "POST",
        headers: {
          ...ua(),
          "Content-Type": "application/json",
          "X-Webhook-Secret": secret,
        },
        body: JSON.stringify(body),
      }),
    { label: `POST ${url}` }
  );
}

async function retry(fn, { attempts = 3, backoffs = [200, 600, 1200], label = "request" } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fn();
      if (res.ok || !STRICT) return res;
      lastErr = new Error(`${label} -> HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    if (i < backoffs.length) await delay(backoffs[i]);
  }
  throw lastErr ?? new Error(`${label} agotó reintentos`);
}

// ---------- Step/report ----------
async function step(label, fn) {
  const start = Date.now();
  let status = "ok";
  let http = null;
  let note = "";
  let ct = "";
  let bodySample = "";

  try {
    const res = await fn();
    if (res && res.status) {
      http = res.status;
      ct = res.headers?.get?.("content-type") ?? "";
      try {
        if (ct.includes("application/json")) {
          bodySample = JSON.stringify(await res.clone().json()).slice(0, 400);
        } else {
          bodySample = (await res.clone().text()).slice(0, 400);
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
    steps.push({
      ts: new Date().toISOString(),
      label,
      status,
      http,
      note,
      ct,
      bodySample,
      ms: Date.now() - start,
    });
  }
}

function expectOk(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
}

function expectJson(res) {
  const ct = res.headers.get("content-type") || "";
  assert(ct.includes("application/json"), `content-type invalido: ${ct}`);
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
function rand(bytes = 4) {
  return randomBytes(bytes).toString("hex");
}
function assert(cond, message) {
  if (!cond) throw new Error(message);
}

async function loadEnv() {
  const base = {
    PLUGIN_BASE: process.env.PLUGIN_BASE,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    MATERIAL_ID: process.env.MATERIAL_ID,
    NEW_STOCK: process.env.NEW_STOCK,
  };
  try {
    const txt = await readFile(resolve("figma-plugin/.env.local"), "utf8");
    const fileEnv = parseDotenv(txt);
    return {
      ...fileEnv,
      ...base,
      PLUGIN_BASE: base.PLUGIN_BASE ?? fileEnv.PLUGIN_BASE,
      WEBHOOK_SECRET: base.WEBHOOK_SECRET ?? fileEnv.PLUGIN_SECRET ?? fileEnv.WEBHOOK_SECRET,
    };
  } catch {
    return base;
  }
}

function parseDotenv(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function resolveReportPath(p) {
  return resolve(process.cwd(), p);
}

async function writeReport(success, extraStep) {
  if (extraStep) steps.push({ ts: new Date().toISOString(), ...extraStep });
  const report = {
    success,
    startedAt: steps[0]?.ts ?? new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    env: {
      base: BASE,
      materialId: MAT_ID,
      newStock: NEW_STOCK,
      strict: STRICT,
    },
    steps,
  };
  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  log(`Reporte JSON -> ${REPORT_PATH}`);
}

function done(code) {
  process.exitCode = code;
  if (code === 0) {
    console.log("🎉 Todo OK");
  } else {
    console.error("🛑 Falló la verificación");
  }
  process.exit(code);
}
