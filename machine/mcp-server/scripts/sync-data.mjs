#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const SOURCE_DIR = process.env.GOVWAIT_BUNDLE_SOURCE_DIR
  ? path.resolve(process.env.GOVWAIT_BUNDLE_SOURCE_DIR)
  : path.join(REPO_ROOT, "data", "exports");
const TARGET_DIR = path.join(PACKAGE_ROOT, "data");
const DATA_FILES = ["latest.json", "history.json", "forward-looking.json"];
const ALLOWED_TARGETS = new Set([...DATA_FILES, "provenance.json"]);

function parseJson(name, bytes) {
  try {
    return JSON.parse(bytes.toString("utf8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${path.join(SOURCE_DIR, name)}: ${error.message}`);
  }
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

mkdirSync(TARGET_DIR, { recursive: true });
const unexpected = readdirSync(TARGET_DIR).filter((name) => !ALLOWED_TARGETS.has(name));
if (unexpected.length) {
  throw new Error(`Refusing to bundle with unexpected package data files: ${unexpected.join(", ")}`);
}

const docs = {};
const files = {};
for (const name of DATA_FILES) {
  const sourcePath = path.join(SOURCE_DIR, name);
  if (!existsSync(sourcePath)) throw new Error(`Missing required export: ${sourcePath}`);
  const bytes = readFileSync(sourcePath);
  const doc = parseJson(name, bytes);
  if (!doc.generated_at) throw new Error(`${name} is missing generated_at`);
  docs[name] = doc;
  files[name] = { bytes: bytes.length, sha256: sha256(bytes) };
  writeFileSync(path.join(TARGET_DIR, name), bytes);
}

const generatedAt = docs["latest.json"].generated_at;
for (const name of DATA_FILES) {
  if (docs[name].generated_at !== generatedAt) {
    throw new Error(`Dataset generation mismatch: ${name} has ${docs[name].generated_at}, expected ${generatedAt}`);
  }
}

const latestRecords = docs["latest.json"].records;
const historyEntities = docs["history.json"].entities;
const forwardEntities = docs["forward-looking.json"].entities;
if (!Array.isArray(latestRecords) || !historyEntities || !forwardEntities) {
  throw new Error("Required dataset collections are missing");
}

const provenance = {
  schema_version: 1,
  dataset: "GovWait government processing-times dataset",
  dataset_url: "https://govwait.com/data/",
  methodology_url: "https://govwait.com/methodology/",
  data_reuse_url: "https://govwait.com/data-license/",
  dataset_generated_at: generatedAt,
  statistics: {
    current_routes: latestRecords.length,
    history_entities: Object.keys(historyEntities).length,
    history_observations: Object.values(historyEntities).reduce((sum, rows) => sum + rows.length, 0),
    forward_entities: Object.keys(forwardEntities).length,
    forward_snapshots: Object.values(forwardEntities).reduce((sum, entity) => sum + (entity.snapshots?.length ?? 0), 0),
    forward_cohorts: Object.values(forwardEntities).reduce(
      (sum, entity) => sum + (entity.snapshots ?? []).reduce((inner, snapshot) => inner + (snapshot.cohorts?.length ?? 0), 0),
      0,
    ),
  },
  files,
};

writeFileSync(path.join(TARGET_DIR, "provenance.json"), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(`Bundled ${latestRecords.length} current routes from dataset ${generatedAt}`);
console.log(`Wrote ${DATA_FILES.length + 1} package data files to ${TARGET_DIR}`);
