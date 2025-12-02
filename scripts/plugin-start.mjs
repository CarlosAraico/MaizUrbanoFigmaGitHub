#!/usr/bin/env node
/**
 * Arranca y valida el plugin de forma integral.
 * - setup + up (ngrok) salvo --no-up
 * - espera backend y .env.local
 * - ajusta allowedDomains en manifest
 * - build del plugin
 * - E2E opcional (--no-e2e)
 * - ZIP + SHA256 + build manifest en CI o con --zip
 * - Exporta plugin_zip, plugin_sha256, plugin_manifest a GITHUB_OUTPUT
 */
import { spawn, spawnSync } from "node:child_process";
import { readFile, writeFile, access, constants, mkdir } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const flags = new Set(process.argv.slice(2));
const NO_E2E = flags.has("--no-e2e");
const FORCE_ZIP = flags.has("--zip");
const NO_UP = flags.has("--no-up");
const CI_MODE = flags.has("--ci") || process.env.GITHUB_ACTIONS === "true" || process.env.CI === "true";

const __root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const paths = {
  backendEnv: resolve(__root, "backend/.env"),
  pluginEnv: resolve(__root, "figma-plugin/.env.local"),
  manifest: resolve(__root, "figma-plugin/manifest.json"),
  verify: resolve(__root, "scripts/verify.mjs"),
  artifacts: resolve(__root, "artifacts"),
  distDir: resolve(__root, "figma-plugin/dist"),
};

let upProc;

main().catch((err) => {
  console.error("🛑", err?.stack || err);
  cleanup(1);
});

async function main() {
  banner("Plugin Start");

  // setup
  await runStep("setup", () => shSync("npm", ["run", "setup"]));

  // up (dev servers + ngrok)
  if (!NO_UP) {
    upProc = shBg("npm", ["run", "up"]);
    onExit(() => cleanup(1));
  } else {
    console.log("⚠️  Saltando `npm run up` (--no-up)");
  }

  await waitForUrl("http://127.0.0.1:4000/api/health", 60_000, "Backend local");
  if (!NO_UP) {
    await waitForFile(paths.pluginEnv, 60_000, "figma-plugin/.env.local");
  }

  // entorno
  const env = await loadEnv();
  const BASE = pick(process.env.PLUGIN_BASE, env.PLUGIN_BASE);
  const SECRET = pick(process.env.WEBHOOK_SECRET, env.WEBHOOK_SECRET, env.PLUGIN_SECRET);
  const MAT_ID = pick(process.env.MATERIAL_ID, "corn-blue");
  const NEW_STOCK = Number(pick(process.env.NEW_STOCK, 123));

  assert(BASE && /^https?:\/\//.test(BASE), "PLUGIN_BASE requerido (https://<ngrok>.ngrok-free.dev o http://127.0.0.1:4000)");
  assert(SECRET, "WEBHOOK_SECRET/PLUGIN_SECRET requerido");
  assert(Number.isFinite(NEW_STOCK), "NEW_STOCK debe ser numérico");

  log(`BASE=${BASE}`);
  log(`MATERIAL_ID=${MAT_ID} NEW_STOCK=${NEW_STOCK}`);

  // allowedDomains
  await ensureAllowedDomains(BASE);

  // health remoto
  await waitForUrl(trimSlash(BASE) + "/api/health", 30_000, "Health remoto");

  // build plugin
  await runStep("build plugin", () => shSync("npm", ["--workspace", "figma-plugin", "run", "build"]));

  // E2E opcional
  if (!NO_E2E) {
    await runStep("E2E verify", () =>
      shSync(process.execPath, [paths.verify], {
        env: {
          ...process.env,
          PLUGIN_BASE: BASE,
          WEBHOOK_SECRET: SECRET,
          MATERIAL_ID: MAT_ID,
          NEW_STOCK: String(NEW_STOCK),
        },
      })
    );
  } else {
    console.log("⚠️  E2E omitido (--no-e2e)");
  }

  // ZIP + SHA + manifest
  if (CI_MODE || FORCE_ZIP) {
    const { zipPath, shaPath, manifestPath } = await packageWithMetadata(BASE);
    console.log("📦 ZIP →", zipPath);
    console.log("🔐 SHA256 →", shaPath);
    console.log("📝 Build manifest →", manifestPath);
    await setOutput("plugin_zip", zipPath);
    await setOutput("plugin_sha256", shaPath);
    await setOutput("plugin_manifest", manifestPath);
  }

  console.log("\n🎉 Listo para Figma Desktop");
  console.log("   Plugins → Development → Import from manifest…");
  console.log("   Selecciona: figma-plugin/manifest.json\n");

  cleanup(0);
}

// ---------- allowedDomains ----------
async function ensureAllowedDomains(baseUrl) {
  const origin = toOrigin(baseUrl);
  const wildcard = "https://*.ngrok-free.dev";
  const mf = JSON.parse(await readFile(paths.manifest, "utf8").catch(() => "{}"));
  mf.networkAccess ??= {};
  mf.networkAccess.allowedDomains ??= [];
  const before = new Set(mf.networkAccess.allowedDomains);
  if (origin && !before.has(origin)) mf.networkAccess.allowedDomains.push(origin);
  if (origin && origin.includes(".ngrok-free.dev") && !before.has(wildcard)) mf.networkAccess.allowedDomains.push(wildcard);
  if (mf.networkAccess.allowedDomains.length !== before.size) {
    await writeFile(paths.manifest, JSON.stringify(mf, null, 2) + "\n", "utf8");
    ok(`manifest.json actualizado: ${origin}${origin?.includes(".ngrok-free.dev") ? " + wildcard" : ""}`);
  } else {
    ok("allowedDomains ya correcto");
  }
}

// ---------- ZIP + SHA256 + Build Manifest ----------
async function packageWithMetadata(baseUrl) {
  await mkdir(paths.artifacts, { recursive: true });
  const stamp = Date.now();
  const zipPath = resolve(paths.artifacts, `figma-plugin-${stamp}.zip`);
  const shaPath = `${zipPath}.sha256`;
  const manifestPath = `${zipPath}.build.json`;

  if (process.platform === "win32") {
    const r = spawnSync("powershell", [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Force -Path "${paths.distDir}\\*" -DestinationPath "${zipPath}" -CompressionLevel Optimal`,
    ], { stdio: "inherit", cwd: __root });
    if (r.status !== 0) throw new Error("Compress-Archive falló");
  } else {
    const r = spawnSync("zip", ["-r", "-q", zipPath, "."], { stdio: "inherit", cwd: paths.distDir });
    if (r.status !== 0) throw new Error("zip falló (instala zip)");
  }

  const buf = await readFile(zipPath);
  const sha = createHash("sha256").update(buf).digest("hex");
  await writeFile(shaPath, `${sha}  ${basename(zipPath)}\n`, "utf8");

  const pluginMf = JSON.parse(await readFile(paths.manifest, "utf8").catch(() => "{}"));
  const version = pluginMf.version ?? "unknown";
  const commit = (args) => {
    const [bin, ...rest] = args.split(" ");
    const res = spawnSync(bin, rest, { cwd: __root });
    return (res.stdout || "").toString().trim();
  };
  const gitSha = commit("git rev-parse HEAD");
  const gitDate = commit("git log -1 --format=%cI");
  const gitBranch = process.env.GITHUB_REF_NAME || commit("git rev-parse --abbrev-ref HEAD");

  const build = {
    pluginVersion: version,
    zip: basename(zipPath),
    sha256: sha,
    builtAt: new Date().toISOString(),
    commit: { sha: gitSha, date: gitDate, branch: gitBranch },
    env: { base: baseUrl, ci: !!CI_MODE },
  };
  await writeFile(manifestPath, JSON.stringify(build, null, 2), "utf8");
  return { zipPath, shaPath, manifestPath };
}

// ---------- infra ----------
async function runStep(label, fn) {
  console.log(`\n▶ ${label}`);
  const res = await fn();
  return res;
}

function shSync(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", cwd: __root, ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} falló con codigo ${r.status}`);
  return 0;
}

function shBg(cmd, args, opts = {}) {
  const child = spawn(cmd, args, { stdio: "inherit", cwd: __root, ...opts });
  child.on("error", (e) => console.error("Subproceso error:", e));
  return child;
}

async function waitForUrl(url, timeoutMs, label) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url, { method: "GET" });
      if (r.ok) {
        ok(`${label} OK (${r.status})`);
        return;
      }
    } catch {}
    await delay(1000);
  }
  throw new Error(`${label} no respondió en ${timeoutMs}ms → ${url}`);
}

async function waitForFile(p, timeoutMs, label) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await exists(p)) {
      ok(`${label} listo`);
      return;
    }
    await delay(1000);
  }
  throw new Error(`${label} no apareció en ${timeoutMs}ms: ${p}`);
}

async function loadEnv() {
  const env = {};
  try {
    Object.assign(env, parseDotenv(await readFile(paths.pluginEnv, "utf8")));
  } catch {}
  try {
    const be = parseDotenv(await readFile(paths.backendEnv, "utf8"));
    if (be.WEBHOOK_SECRET) env.WEBHOOK_SECRET = be.WEBHOOK_SECRET;
  } catch {}
  return env;
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

function toOrigin(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return url;
  }
}
function trimSlash(s) {
  return s.replace(/\/+$/, "");
}
async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
function pick(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") return v;
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
function banner(t) {
  console.log(`\n━━━ ${t} ━━━`);
}
function log(m) {
  console.log("🔎", m);
}
function ok(m) {
  console.log("✅", m);
}
function onExit(cb) {
  process.once("SIGINT", () => cb());
  process.once("SIGTERM", () => cb());
}
async function setOutput(key, val) {
  if (process.env.GITHUB_OUTPUT) {
    await writeFile(process.env.GITHUB_OUTPUT, `${key}=${val}\n`, { flag: "a" });
  }
}
function cleanup(code) {
  if (upProc && !upProc.killed) {
    try {
      upProc.kill();
    } catch {}
  }
  process.exit(code);
}
