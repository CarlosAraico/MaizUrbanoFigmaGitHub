#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, basename } from "node:path";
import { createHash } from "node:crypto";

const root = resolve(new URL(".", import.meta.url).pathname, "..");
const artifactsDir = resolve(root, "artifacts");
const manifestPath = resolve(root, "figma-plugin/manifest.json");
const distDir = resolve(root, "figma-plugin/dist");

async function main() {
  const stamp = Date.now();
  await mkdir(artifactsDir, { recursive: true });

  const zipPath = resolve(artifactsDir, `figma-plugin-${stamp}.zip`);
  const shaPath = `${zipPath}.sha256`;
  const buildPath = `${zipPath}.build.json`;

  zipDist(zipPath);

  const buf = await readFile(zipPath);
  const sha = createHash("sha256").update(buf).digest("hex");
  await writeFile(shaPath, `${sha}  ${basename(zipPath)}\n`, "utf8");

  const mf = JSON.parse(await readFile(manifestPath, "utf8").catch(() => "{}"));
  const version = mf.version ?? "unknown";
  const gitSha = cmd("git rev-parse HEAD");
  const gitDate = cmd("git log -1 --format=%cI");
  const gitBranch = process.env.GITHUB_REF_NAME || cmd("git rev-parse --abbrev-ref HEAD");

  const build = {
    pluginVersion: version,
    zip: basename(zipPath),
    sha256: sha,
    builtAt: new Date().toISOString(),
    commit: { sha: gitSha, date: gitDate, branch: gitBranch },
  };
  await writeFile(buildPath, JSON.stringify(build, null, 2), "utf8");

  console.log("📦 ZIP:", zipPath);
  console.log("🔐 SHA256:", shaPath);
  console.log("📝 Build manifest:", buildPath);

  if (process.env.GITHUB_OUTPUT) {
    await writeFile(process.env.GITHUB_OUTPUT, `plugin_zip=${zipPath}\nplugin_sha256=${shaPath}\nplugin_manifest=${buildPath}\n`, { flag: "a" });
  }
}

function zipDist(zipPath) {
  if (process.platform === "win32") {
    const r = spawnSync("powershell", [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Force -Path "${distDir}\\*" -DestinationPath "${zipPath}" -CompressionLevel Optimal`
    ], { stdio: "inherit" });
    if (r.status !== 0) throw new Error("Compress-Archive falló");
  } else {
    const r = spawnSync("zip", ["-r", "-q", zipPath, "."], { stdio: "inherit", cwd: distDir });
    if (r.status !== 0) throw new Error("zip falló (instala zip)");
  }
}

function cmd(command) {
  const [bin, ...args] = command.split(" ");
  const res = spawnSync(bin, args, { cwd: root });
  return (res.stdout || "").toString().trim();
}

main().catch((err) => {
  console.error("🛑", err?.message || err);
  process.exit(1);
});
