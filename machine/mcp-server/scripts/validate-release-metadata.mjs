#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const packageJson = JSON.parse(readFileSync(path.join(PACKAGE_ROOT, "package.json"), "utf8"));
const serverJson = JSON.parse(readFileSync(path.join(PACKAGE_ROOT, "server.json"), "utf8"));
const packageLicense = readFileSync(path.join(PACKAGE_ROOT, "LICENSE"), "utf8");
const repositoryLicense = readFileSync(path.join(REPO_ROOT, "LICENSE"), "utf8");
const repositoryLicenseScope = readFileSync(path.join(REPO_ROOT, "SOFTWARE-SCOPE.md"), "utf8");
const dataNotice = readFileSync(path.join(PACKAGE_ROOT, "DATA-NOTICE.md"), "utf8");
const glamaJson = JSON.parse(readFileSync(path.join(REPO_ROOT, "glama.json"), "utf8"));
const registryPackage = serverJson.packages?.[0];
const canonicalApacheStart = packageLicense.indexOf("Apache License\n");
assert.notEqual(canonicalApacheStart, -1, "package licence must contain canonical Apache 2.0 terms");
const canonicalApacheLicense = packageLicense.slice(canonicalApacheStart);

const checks = [
  ["public publication gate", () => assert.equal(Object.hasOwn(packageJson, "private"), false)],
  ["approved scoped licence pointer", () => assert.equal(packageJson.license, "SEE LICENSE IN LICENSE")],
  ["release candidate version", () => assert.equal(packageJson.version, "0.1.1")],
  ["repository licence is canonical Apache 2.0 text", () => assert.equal(repositoryLicense, canonicalApacheLicense)],
  ["canonical Apache 2.0 text", () => assert.match(packageLicense, /Apache License\n\s+Version 2\.0, January 2004/)],
  ["government data excluded from software licence", () => assert.match(packageLicense, /files under any `data\/` directory/)],
  ["repository licence scope is code only", () => assert.match(repositoryLicenseScope, /applies\nonly to software code owned by GovWait contributors/)],
  ["repository scope excludes government data", () => assert.match(repositoryLicenseScope, /files under any `data\/` directory/)],
  ["repository scope prevents a broader root grant", () => assert.match(repositoryLicenseScope, /does not\nexpand the covered work beyond the software identified here/)],
  ["data notice grants no additional rights", () => assert.match(dataNotice, /does not grant additional rights/)],
  ["Glama metadata uses the live schema", () => assert.equal(glamaJson.$schema, "https://glama.ai/mcp/schemas/server.json")],
  ["Glama maintainer is the repository owner", () => assert.deepEqual(glamaJson.maintainers, ["artwisdom"])],
  ["Glama metadata is minimal", () => assert.deepEqual(Object.keys(glamaJson).sort(), ["$schema", "maintainers"])],
  ["recommended npm identity", () => assert.equal(packageJson.name, "govwait-mcp")],
  ["official registry ownership link", () => assert.equal(packageJson.mcpName, "io.github.artwisdom/govwait")],
  ["registry name matches package ownership link", () => assert.equal(serverJson.name, packageJson.mcpName)],
  ["registry version matches package", () => assert.equal(serverJson.version, packageJson.version)],
  ["registry description fits live limit", () => {
    assert.equal(typeof serverJson.description, "string");
    assert.ok(serverJson.description.length > 0 && serverJson.description.length <= 100);
  }],
  ["one package distribution", () => assert.equal(serverJson.packages?.length, 1)],
  ["npm identifier matches package", () => assert.equal(registryPackage?.identifier, packageJson.name)],
  ["npm version matches package", () => assert.equal(registryPackage?.version, packageJson.version)],
  ["official npm registry type", () => assert.equal(registryPackage?.registryType, "npm")],
  ["npx runtime hint", () => assert.equal(registryPackage?.runtimeHint, "npx")],
  ["local stdio transport", () => assert.deepEqual(registryPackage?.transport, { type: "stdio" })],
  ["no runtime credentials", () => assert.equal(registryPackage?.environmentVariables, undefined)],
  ["no remote endpoint claim", () => assert.equal(serverJson.remotes, undefined)],
  ["stable public repository identity", () => assert.deepEqual(serverJson.repository, {
    url: "https://github.com/artwisdom/govwait",
    source: "github",
    id: "1342333561",
    subfolder: "machine/mcp-server",
  })],
];

for (const [label, check] of checks) {
  check();
  console.log(`PASS ${label}`);
}

console.log(`\nRELEASE METADATA: ${checks.length}/${checks.length} PASS`);
console.log("Candidate readiness: local, unpublished 0.1.1 package + scoped Apache-2.0 code licence + matching Registry metadata; validation does not publish, sync, build, release, deploy, or contact a registry");
