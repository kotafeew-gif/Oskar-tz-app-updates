import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const releaseInfoPath = path.join(repoRoot, "release-info.json");
const packagePath = path.join(repoRoot, "package.json");
const lockPath = path.join(repoRoot, "package-lock.json");

const releaseInfo = JSON.parse(fs.readFileSync(releaseInfoPath, "utf8"));
const version = String(releaseInfo.version || "").trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`Invalid release-info.json version: ${version}`);
}
if (!Array.isArray(releaseInfo.startMessage)) {
  throw new Error("release-info.json startMessage must be an array");
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
if (packageJson.version !== version) {
  packageJson.version = version;
  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

if (fs.existsSync(lockPath)) {
  const packageLock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  packageLock.version = version;
  if (packageLock.packages?.[""]) packageLock.packages[""].version = version;
  fs.writeFileSync(lockPath, `${JSON.stringify(packageLock, null, 2)}\n`);
}

console.log(`Release info synced: ${version}`);
