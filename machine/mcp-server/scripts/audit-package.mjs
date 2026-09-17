#!/usr/bin/env node
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(HERE, "..");
const PACKAGE_NAME = "govwait-mcp";
const EXPECTED_FILES = [
  "DATA-NOTICE.md",
  "LICENSE",
  "README.md",
  "data/forward-looking.json",
  "data/history.json",
  "data/latest.json",
  "data/provenance.json",
  "dist/index.js",
  "package.json",
];
const FORBIDDEN_PATH = /(^|\/)(?:\.env(?:\.|$)|node_modules|src|scripts|test|tests|cache|logs?)(?:\/|$)|\.(?:db|sqlite|sqlite3|pem|key|log|map|ts)$/i;
const FORBIDDEN_CONTENT = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:ghp_|github_pat_|npm_|sk_live_|AKIA)[A-Za-z0-9_-]{12,}\b/,
  /\b(?:CLOUDFLARE_API_TOKEN|NODE_AUTH_TOKEN|NPM_TOKEN)\s*[:=]/i,
  /\/Users\/[A-Za-z0-9._-]+\//,
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? PACKAGE_ROOT,
    env: options.env ?? process.env,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed\n${result.stdout}\n${result.stderr}`);
  }
  return result;
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

const tempRoot = mkdtempSync(path.join(tmpdir(), "govwait-mcp-audit-"));
try {
  run("npm", ["run", "build"]);
  const npmEnv = {
    ...process.env,
    npm_config_cache: path.join(tempRoot, "npm-cache"),
    npm_config_logs_max: "0",
  };
  const pack = run("npm", ["pack", "--ignore-scripts", "--json", "--pack-destination", tempRoot], {
    env: npmEnv,
  });
  const report = JSON.parse(pack.stdout);
  if (!Array.isArray(report) || report.length !== 1) throw new Error("npm pack returned an unexpected report");

  const artifact = report[0];
  const actualFiles = artifact.files.map((file) => file.path).sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(EXPECTED_FILES)) {
    throw new Error(`Package allow-list mismatch\nExpected: ${EXPECTED_FILES.join(", ")}\nActual: ${actualFiles.join(", ")}`);
  }
  const forbidden = actualFiles.filter((name) => FORBIDDEN_PATH.test(name));
  if (forbidden.length) throw new Error(`Forbidden package paths: ${forbidden.join(", ")}`);
  if (artifact.size > 2 * 1024 * 1024 || artifact.unpackedSize > 6 * 1024 * 1024) {
    throw new Error(`Package exceeds size budget (${artifact.size} packed, ${artifact.unpackedSize} unpacked)`);
  }

  const tarballPath = path.join(tempRoot, artifact.filename);
  const installRoot = path.join(tempRoot, "clean-install");
  const installedPackage = path.join(installRoot, "node_modules", PACKAGE_NAME);
  mkdirSync(installedPackage, { recursive: true });
  run("tar", ["-xzf", tarballPath, "-C", installedPackage, "--strip-components", "1"]);
  cpSync(path.join(PACKAGE_ROOT, "node_modules"), path.join(installRoot, "node_modules"), {
    recursive: true,
    force: false,
    errorOnExist: false,
  });
  writeFileSync(path.join(installRoot, "package.json"), '{"name":"govwait-mcp-audit","private":true}\n');
  const installedRoot = realpathSync(path.join(installRoot, "node_modules", PACKAGE_NAME));
  const packageJson = JSON.parse(readFileSync(path.join(installedRoot, "package.json"), "utf8"));
  if (packageJson.private !== true) throw new Error("Safety gate failed: package must remain private before publication approval");
  if (packageJson.license !== "SEE LICENSE IN LICENSE") throw new Error("Licence gate failed: package must point to its scoped LICENSE file");
  const licenseText = readFileSync(path.join(installedRoot, "LICENSE"), "utf8");
  if (!/Apache License\n\s+Version 2\.0, January 2004/.test(licenseText)) {
    throw new Error("Licence gate failed: canonical Apache 2.0 text is missing");
  }
  if (!/files under any `data\/` directory/.test(licenseText)) {
    throw new Error("Licence gate failed: government-source data exclusion is missing");
  }

  const provenancePath = path.join(installedRoot, "data", "provenance.json");
  const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
  for (const [name, expected] of Object.entries(provenance.files)) {
    const installedPath = path.join(installedRoot, "data", name);
    const bytes = readFileSync(installedPath).length;
    if (bytes !== expected.bytes || sha256(installedPath) !== expected.sha256) {
      throw new Error(`Bundled data integrity mismatch for ${name}`);
    }
  }

  for (const name of actualFiles) {
    const installedPath = path.join(installedRoot, name);
    if (name === "package.json" || name === "LICENSE" || name.endsWith(".md") || name.endsWith(".js") || name.endsWith(".json")) {
      const text = readFileSync(installedPath, "utf8");
      const hit = FORBIDDEN_CONTENT.find((pattern) => pattern.test(text));
      if (hit) throw new Error(`Sensitive or machine-local content pattern found in ${name}`);
    }
  }

  const smokeEnv = { ...process.env };
  delete smokeEnv.GOVWAIT_DATA_DIR;
  smokeEnv.GOVWAIT_SERVER_ENTRY = path.join(installedRoot, "dist", "index.js");
  smokeEnv.GOVWAIT_SERVER_CWD = installRoot;
  smokeEnv.GOVWAIT_EXPECT_DATA_DIR = path.join(installedRoot, "data");
  const smoke = run(process.execPath, [path.join(PACKAGE_ROOT, "smoke-test.mjs")], {
    cwd: installRoot,
    env: smokeEnv,
  });

  process.stdout.write(smoke.stdout);
  process.stderr.write(smoke.stderr);

  let retainedArtifact;
  if (process.env.GOVWAIT_KEEP_RELEASE_ARTIFACT === "1") {
    const releaseDir = path.join(PACKAGE_ROOT, "release");
    mkdirSync(releaseDir, { recursive: true });
    retainedArtifact = path.join(releaseDir, artifact.filename);
    cpSync(tarballPath, retainedArtifact);
    writeFileSync(`${retainedArtifact}.sha256`, `${sha256(retainedArtifact)}  ${artifact.filename}\n`);
  }

  console.log("\nPACKAGE AUDIT: ALL PASS");
  console.log(`Files: ${actualFiles.length} exact allow-listed files`);
  console.log(`Size: ${artifact.size} bytes packed / ${artifact.unpackedSize} bytes unpacked`);
  console.log(`Integrity: ${Object.keys(provenance.files).length} bundled data hashes verified`);
  console.log("Licensing: Apache 2.0 applies only to GovWait-owned software code; bundled government-source data is excluded");
  console.log("Isolation: packed artifact ran in a clean temp project using the npm-ci dependency tree, without parent-repository data or GOVWAIT_DATA_DIR");
  console.log("Publication safety: package remains private; nothing was published");
  if (retainedArtifact) console.log(`Private release candidate: ${retainedArtifact}`);
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
