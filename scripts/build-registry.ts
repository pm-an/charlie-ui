#!/usr/bin/env tsx
/**
 * build-registry.ts
 *
 * Reads source files, parses imports, rewrites paths, and generates
 * Charlie UI registry JSON files under `registry/`.
 *
 * Usage: npx tsx scripts/build-registry.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { resolve, dirname, extname, basename } from "node:path";
import { registryMetadata, type ItemMeta } from "./registry-metadata";

const ROOT = resolve(import.meta.dirname, "..");
const OUT_DIR = resolve(ROOT, "registry");
const PKG = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));

// ─── Helpers ──────────────────────────────────────────────────────────

/** Convert PascalCase to kebab-case */
function toKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/** Resolve a dependency version from package.json */
function resolveVersion(pkg: string): string | undefined {
  return (
    PKG.dependencies?.[pkg] ??
    PKG.peerDependencies?.[pkg] ??
    PKG.devDependencies?.[pkg]
  );
}

/** Read a source file relative to project root */
function readSource(relPath: string): string {
  return readFileSync(resolve(ROOT, relPath), "utf-8");
}

// ─── Import Path Mapping ─────────────────────────────────────────────

/**
 * Maps from internal import paths to consumer-project paths.
 * Returns [newPath, registryDepName | null].
 */
function mapImportPath(
  importPath: string,
  sourceFile: string
): [string, string | null] {
  // Utils
  if (importPath === "../utils/cn") return ["@/lib/cn", "cn"];
  if (importPath === "../utils/Slot") return ["@/lib/slot", "slot"];
  if (importPath === "../utils/composeRefs")
    return ["@/lib/compose-refs", "compose-refs"];
  if (importPath === "../utils/chart-helpers")
    return ["@/lib/chart-helpers", "chart-helpers"];

  // Hooks
  if (importPath === "../hooks/useControllableState")
    return ["@/hooks/use-controllable-state", "use-controllable-state"];
  if (importPath === "../hooks/useFieldAware")
    return ["@/hooks/use-field-aware", "use-field-aware"];

  // Animation (from components: ../animation/...)
  if (importPath === "../animation/tokens")
    return ["@/lib/animation-tokens", "animation-tokens"];
  if (importPath === "../animation/presets")
    return ["@/lib/animation-presets", "animation-presets"];
  if (importPath === "../animation/utils")
    return ["@/lib/animation-utils", "animation-utils"];
  if (importPath === "../animation/AnimationProvider")
    return ["@/components/ui/animation-provider", "animation-provider"];
  if (importPath === "../animation/useReducedMotion")
    return ["@/hooks/use-reduced-motion", "use-reduced-motion"];
  if (importPath === "../animation" || importPath === "../animation/index")
    return ["@/lib/animation-tokens", "animation-tokens"];

  // Animation-internal imports (from src/animation/*.ts files importing siblings)
  const isAnimationSource = sourceFile.startsWith("src/animation/");
  if (isAnimationSource && importPath.startsWith("./")) {
    const name = importPath.slice(2);
    if (name === "tokens") return ["@/lib/animation-tokens", "animation-tokens"];
    if (name === "presets") return ["@/lib/animation-presets", "animation-presets"];
    if (name === "utils") return ["@/lib/animation-utils", "animation-utils"];
    if (name === "useReducedMotion")
      return ["@/hooks/use-reduced-motion", "use-reduced-motion"];
    if (name === "AnimationProvider")
      return ["@/components/ui/animation-provider", "animation-provider"];
  }

  // Hooks-internal imports (from src/hooks/*.ts importing siblings)
  const isHooksSource = sourceFile.startsWith("src/hooks/");
  if (isHooksSource && importPath.startsWith("./")) {
    const name = importPath.slice(2);
    if (name === "useControllableState")
      return ["@/hooks/use-controllable-state", "use-controllable-state"];
    if (name === "useFieldAware")
      return ["@/hooks/use-field-aware", "use-field-aware"];
  }

  // Themes
  if (importPath === "../themes/presets")
    return ["@/lib/theme-presets", "theme-presets"];

  // Internal component-level files
  if (importPath === "./toast-store")
    return ["@/lib/toast-store", "toast-store"];
  if (importPath === "./field-context")
    return ["@/lib/field-context", "field-context"];

  // Rich text editor sub-files
  if (importPath === "./rich-text-editor/extensions")
    return ["@/components/ui/rich-text-editor/extensions", null];
  if (importPath === "./rich-text-editor/toolbar-items")
    return ["@/components/ui/rich-text-editor/toolbar-items", null];
  if (importPath === "./rich-text-editor/styles.css")
    return ["@/components/ui/rich-text-editor/styles.css", null];

  // Cross-component references: ./ComponentName → @/components/ui/kebab-name
  // Check that the part after "./" has no further slashes (i.e., single-level relative)
  if (importPath.startsWith("./") && !importPath.slice(2).includes("/")) {
    const name = importPath.slice(2); // Remove "./"
    const kebab = toKebab(name);
    return [`@/components/ui/${kebab}`, kebab];
  }

  // Not an internal path
  return [importPath, null];
}

// ─── Import Parser ───────────────────────────────────────────────────

type ParsedImports = {
  npmDeps: Set<string>;
  registryDeps: Set<string>;
  rewrittenContent: string;
};

/**
 * Parse imports from source content.
 * Extracts npm dependencies and registry dependencies,
 * and rewrites internal import paths.
 */
function parseImports(content: string, sourceFile: string): ParsedImports {
  const npmDeps = new Set<string>();
  const registryDeps = new Set<string>();

  // Match: import ... from "..."  and  import "..." (side-effect)
  const importRegex =
    /(?:import\s+(?:(?:type\s+)?(?:\{[^}]*\}|[^'"]*)\s+from\s+)?['"])([^'"]+)(?:['"])/g;

  let rewritten = content;

  // Collect all matches first to avoid issues with replace during iteration
  const matches: { full: string; path: string; index: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    matches.push({ full: match[0], path: match[1], index: match.index });
  }

  for (const m of matches) {
    const importPath = m.path;

    // Skip React and React-DOM (peer deps, always available)
    if (importPath === "react" || importPath === "react-dom") continue;
    if (importPath.startsWith("react/") || importPath.startsWith("react-dom/"))
      continue;

    // Is this a relative/internal import?
    if (
      importPath.startsWith("./") ||
      importPath.startsWith("../")
    ) {
      const [newPath, regDep] = mapImportPath(importPath, sourceFile);
      if (regDep) {
        registryDeps.add(regDep);
      }
      // Rewrite the import path in content
      rewritten = rewritten.replace(
        new RegExp(
          `(from\\s+['"])${escapeRegex(importPath)}(['"])`,
          "g"
        ),
        `$1${newPath}$2`
      );
      // Also handle side-effect imports: import "./foo"
      rewritten = rewritten.replace(
        new RegExp(
          `(import\\s+['"])${escapeRegex(importPath)}(['"])`,
          "g"
        ),
        `$1${newPath}$2`
      );
    } else {
      // NPM dependency — extract the package name
      // Scoped: @scope/pkg → @scope/pkg
      // Regular: pkg/sub → pkg
      const npmPkg = importPath.startsWith("@")
        ? importPath.split("/").slice(0, 2).join("/")
        : importPath.split("/")[0];
      npmDeps.add(npmPkg);
    }
  }

  return { npmDeps, registryDeps, rewrittenContent: rewritten };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Registry Item Builder ───────────────────────────────────────────

type RegistryFile = {
  path: string;
  content: string;
  type: string;
};

type RegistryItem = {
  $schema: string;
  name: string;
  type: string;
  title: string;
  description: string;
  category: string;
  dependencies: Record<string, string>;
  registryDependencies: string[];
  files: RegistryFile[];
};

function buildItem(name: string, meta: ItemMeta): RegistryItem {
  const allNpmDeps = new Set<string>();
  const allRegDeps = new Set<string>();
  const files: RegistryFile[] = [];

  // Process main source file
  const mainContent = readSource(meta.source);
  const mainParsed = parseImports(mainContent, meta.source);

  for (const dep of mainParsed.npmDeps) allNpmDeps.add(dep);
  for (const dep of mainParsed.registryDeps) allRegDeps.add(dep);

  const ext = extname(meta.source);
  const fileType = resolveFileType(meta.type, ext);

  files.push({
    path: meta.target,
    content: mainParsed.rewrittenContent,
    type: fileType,
  });

  // Process extra files (e.g., RichTextEditor sub-files)
  if (meta.extraFiles) {
    for (const extra of meta.extraFiles) {
      const extraContent = readSource(extra.source);
      const extraExt = extname(extra.source);

      if (extraExt === ".css") {
        // CSS files don't need import parsing
        files.push({
          path: extra.target,
          content: extraContent,
          type: "registry:style",
        });
      } else {
        const extraParsed = parseImports(extraContent, extra.source);
        for (const dep of extraParsed.npmDeps) allNpmDeps.add(dep);
        for (const dep of extraParsed.registryDeps) allRegDeps.add(dep);

        files.push({
          path: extra.target,
          content: extraParsed.rewrittenContent,
          type: resolveFileType(meta.type, extraExt),
        });
      }
    }
  }

  // Auto-add charlie-theme dependency for all components and blocks
  if (
    meta.type === "registry:component" ||
    meta.type === "registry:block"
  ) {
    allRegDeps.add("charlie-theme");
  }

  // Don't list self as a dependency
  allRegDeps.delete(name);

  // Resolve npm dependency versions
  const dependencies: Record<string, string> = {};
  for (const dep of allNpmDeps) {
    const version = resolveVersion(dep);
    if (version) {
      dependencies[dep] = version;
    }
  }

  return {
    $schema: "https://charlietogolden.github.io/charlie-ui/schema/registry-item.json",
    name,
    type: meta.type,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    dependencies,
    registryDependencies: [...allRegDeps].sort(),
    files,
  };
}

function resolveFileType(regType: string, ext: string): string {
  if (ext === ".css") return "registry:style";
  return regType;
}

// ─── Index Builder ───────────────────────────────────────────────────

type RegistryIndexItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  category: string;
  dependencies: string[];
  registryDependencies: string[];
};

function buildIndex(
  items: Map<string, RegistryItem>
): { $schema: string; items: RegistryIndexItem[] } {
  const indexItems: RegistryIndexItem[] = [];

  for (const [name, item] of items) {
    indexItems.push({
      name,
      type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      dependencies: Object.keys(item.dependencies),
      registryDependencies: item.registryDependencies,
    });
  }

  // Sort by name for stable output
  indexItems.sort((a, b) => a.name.localeCompare(b.name));

  return {
    $schema: "https://charlietogolden.github.io/charlie-ui/schema/registry.json",
    items: indexItems,
  };
}

// ─── Main ────────────────────────────────────────────────────────────

function main() {
  console.log("Building Charlie UI registry...\n");

  // Clean output directory
  if (existsSync(OUT_DIR)) {
    rmSync(OUT_DIR, { recursive: true });
  }
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(resolve(OUT_DIR, "r"), { recursive: true });

  const items = new Map<string, RegistryItem>();
  const errors: string[] = [];

  // Build each registry item
  for (const [name, meta] of Object.entries(registryMetadata)) {
    const sourcePath = resolve(ROOT, meta.source);
    if (!existsSync(sourcePath)) {
      errors.push(`Source file not found: ${meta.source} (item: ${name})`);
      continue;
    }

    try {
      const item = buildItem(name, meta);
      items.set(name, item);
    } catch (err) {
      errors.push(
        `Failed to build item "${name}": ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  if (errors.length > 0) {
    console.error("Errors during build:");
    for (const err of errors) {
      console.error(`  ✗ ${err}`);
    }
    process.exit(1);
  }

  // Write individual item files
  for (const [name, item] of items) {
    const filePath = resolve(OUT_DIR, "r", `${name}.json`);
    writeFileSync(filePath, JSON.stringify(item, null, 2) + "\n");
  }

  // Write index
  const index = buildIndex(items);
  writeFileSync(
    resolve(OUT_DIR, "registry.json"),
    JSON.stringify(index, null, 2) + "\n"
  );

  console.log(`✓ Generated ${items.size} registry items`);
  console.log(`✓ Written to ${OUT_DIR}/`);
  console.log(`  - registry.json (index)`);
  console.log(`  - r/*.json (${items.size} item files)`);
}

main();
