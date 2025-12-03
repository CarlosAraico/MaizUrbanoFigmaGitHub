import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import ngrok from "ngrok";

const ROOT = process.cwd();
const BE_ENV = path.join(ROOT, "backend/.env");
const PLUGIN_ENV = path.join(ROOT, "figma-plugin/.env.local");
const PORT = 4000;

function ensureSecret() {
  let secret = "CHANGE_ME";
  if (fs.existsSync(BE_ENV)) {
    const parsed = dotenv.parse(fs.readFileSync(BE_ENV));
    secret = parsed.WEBHOOK_SECRET || crypto.randomBytes(24).toString("hex");
    if (!parsed.WEBHOOK_SECRET) {
      const updated = Object.entries({ ...parsed, WEBHOOK_SECRET: secret })
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");
      fs.writeFileSync(BE_ENV, updated);
      console.log("* WEBHOOK_SECRET generado en backend/.env");
    }
  } else {
    secret = crypto.randomBytes(24).toString("hex");
    fs.writeFileSync(BE_ENV, `PORT=${PORT}\nWEBHOOK_SECRET=${secret}\n`);
    console.log("* backend/.env creado");
  }
  return secret;
}

function writePluginEnv(url, secret) {
  fs.writeFileSync(
    PLUGIN_ENV,
    `# AUTO-GENERATED\nPLUGIN_BASE=${url}\nPLUGIN_SECRET=${secret}\n`
  );
  console.log(`* figma-plugin/.env.local actualizado: ${url}`);
}

async function start() {
  const waitOn = (await import("wait-on")).default;
  await waitOn({
    resources: [`http://127.0.0.1:${PORT}/api/health`],
    timeout: 30000,
  });

  let url;
  if (process.env.CI === "true") {
    console.log("🧪 Entorno CI detectado: omitiendo ngrok");
    url = `http://127.0.0.1:${PORT}`;
  } else {
    console.log("🔌 Iniciando ngrok...");
    url = await ngrok.connect({ addr: PORT, proto: "http" });
    console.log("✅ ngrok activo");
  }

  const httpsUrl = url.includes("ngrok") ? url.replace("http://", "https://") : url;
  const secret = ensureSecret();
  writePluginEnv(httpsUrl, secret);

  console.log("\n=== TUNEL ACTIVO ===");
  console.log(`Local   : http://127.0.0.1:${PORT}`);
  console.log(`Publico : ${httpsUrl}`);
  console.log(
    "\nFigma Desktop -> Plugins -> Development -> Import from manifest -> figma-plugin/manifest.json\n"
  );
}

async function stop() {
  try {
    await ngrok.disconnect();
    await ngrok.kill();
    console.log("Tunel detenido.");
  } catch {
    /* ignore */
  }
}

if (process.argv.includes("--stop")) {
  await stop();
} else {
  await start();
}
