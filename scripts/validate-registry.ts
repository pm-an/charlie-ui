#!/usr/bin/env tsx
/**
 * validate-registry.ts
 *
 * CI-friendly validation script for the built registry.
 * Checks structural integrity, cross-references, and content.
 *
 * Usage: npx tsx scripts/validate-registry.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { readdirSync } from "node:fs";

const ROOT = resolve(import.meta.dirname, "..");
const REGISTRY_DIR = resolve(ROOT, "registry");
const INDEX_PATH = resolve(REGISTRY_DIR, "registry.json");

type IndexItem = {
  name: string;
  type: string;
  dependencies: string[];
  registryDependencies: string[];
};

type RegistryFile = {
  path: string;
  content: string;
  type: string;
};

type RegistryItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: Record<string, string>;
  registryDependencies: string[];
  files: RegistryFile[];
};

let errorCount = 0;
let warnCount = 0;

function error(msg: string) {
  console.error(`  ✗ ${msg}`);
  errorCount++;
}

function warn(msg: string) {
  console.warn(`  ⚠ ${msg}`);
  warnCount++;
}

function main() {
  console.log("Validating Charlie UI registry...\n");

  // 1. Check registry directory exists
  if (!existsSync(REGISTRY_DIR)) {
    console.error("Registry directory not found. Run build-registry.ts first.");
    process.exit(1);
  }

  // 2. Check index file exists
  if (!existsSync(INDEX_PATH)) {
    console.error("registry.json not found.");
    process.exit(1);
  }

  const indexRaw = readFileSync(INDEX_PATH, "utf-8");
  const index: { items: IndexItem[] } = JSON.parse(indexRaw);

  console.log(`Found ${index.items.length} items in registry.json\n`);

  // Collect all item names for cross-reference checks
  const allNames = new Set(index.items.map((i) => i.name));

  // Load all individual item files
  const items = new Map<string, RegistryItem>();
  for (const entry of index.items) {
    const itemPath = resolve(REGISTRY_DIR, "r", `${entry.name}.json`);
    if (!existsSync(itemPath)) {
      error(
        `Item "${entry.name}" is in registry.json but r/${entry.name}.json is missing`
      );
      continue;
    }
    const item: RegistryItem = JSON.parse(readFileSync(itemPath, "utf-8"));
    items.set(entry.name, item);
  }

  // 3. Check for orphan files in r/ that aren't in the index
  const itemFiles = readdirSyncSafe(resolve(REGISTRY_DIR, "r"));
  for (const file of itemFiles) {
    if (!file.endsWith(".json")) continue;
    const name = file.replace(".json", "");
    if (!allNames.has(name)) {
      warn(`r/${file} exists but is not listed in registry.json`);
    }
  }

  // 4. Validate each item
  console.log("Checking individual items...");
  for (const [name, item] of items) {
    // Check required fields
    if (!item.title) error(`${name}: missing title`);
    if (!item.description) error(`${name}: missing description`);
    if (!item.type) error(`${name}: missing type`);

    // Check files
    if (!item.files || item.files.length === 0) {
      error(`${name}: no files`);
    } else {
      for (const file of item.files) {
        if (!file.path) error(`${name}: file missing path`);
        if (!file.content || file.content.trim().length === 0) {
          error(`${name}: file "${file.path}" has empty content`);
        }
        if (!file.type) error(`${name}: file "${file.path}" missing type`);
      }
    }

    // Check registry dependencies reference existing items
    for (const dep of item.registryDependencies) {
      if (!allNames.has(dep)) {
        error(
          `${name}: registryDependency "${dep}" does not exist in the registry`
        );
      }
    }

    // Check npm dependencies have valid semver versions
    for (const [dep, version] of Object.entries(item.dependencies)) {
      if (!version || typeof version !== "string") {
        error(`${name}: dependency "${dep}" has no version`);
      } else if (!/^\^?\d|^~?\d|^\d|^>=/.test(version)) {
        warn(`${name}: dependency "${dep}" version "${version}" looks unusual`);
      }
    }
  }

  // 5. Check for circular registry dependencies
  console.log("\nChecking for circular dependencies...");
  for (const [name] of items) {
    const visited = new Set<string>();
    const stack = [name];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) {
        if (current === name) {
          error(`${name}: circular dependency detected (path includes "${current}")`);
          break;
        }
        continue;
      }
      visited.add(current);

      const currentItem = items.get(current);
      if (currentItem) {
        for (const dep of currentItem.registryDependencies) {
          if (dep === name && current !== name) {
            error(
              `${name}: circular dependency: ${name} → ... → ${current} → ${name}`
            );
          } else if (!visited.has(dep)) {
            stack.push(dep);
          }
        }
      }
    }
  }

  // 6. Check that components and blocks have charlie-theme dependency
  console.log("\nChecking charlie-theme dependencies...");
  for (const [name, item] of items) {
    if (
      (item.type === "registry:component" || item.type === "registry:block") &&
      !item.registryDependencies.includes("charlie-theme")
    ) {
      warn(`${name}: component/block missing "charlie-theme" registry dependency`);
    }
  }

  // Summary
  console.log("\n" + "─".repeat(50));
  if (errorCount === 0 && warnCount === 0) {
    console.log(
      `✓ Registry validation passed — ${items.size} items, no issues found`
    );
  } else {
    console.log(
      `Validation complete: ${errorCount} error(s), ${warnCount} warning(s)`
    );
  }

  if (errorCount > 0) {
    process.exit(1);
  }
}

function readdirSyncSafe(dir: string): string[] {
  try {
    return readdirSync(dir) as string[];
  } catch {
    return [];
  }
}

main();
