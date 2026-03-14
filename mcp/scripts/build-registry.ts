/**
 * Auto-generates the component registry for the MCP server by scanning source files.
 * Falls back to hand-written docs when available, otherwise generates docs from source.
 * Run: npx tsx scripts/build-registry.ts
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, "../../src/components");
const docsDir = join(__dirname, "../../docs");
const outFile = join(__dirname, "../src/generated/registry.ts");

// ---------------------------------------------------------------------------
// 1. Category + description metadata
// ---------------------------------------------------------------------------
const CATEGORIES = [
  "Primitives",
  "Forms",
  "Navigation",
  "Layout",
  "Cards",
  "Data Display",
  "Charts",
  "Overlays",
  "Feedback",
  "Animation",
] as const;

type Category = (typeof CATEGORIES)[number];

const COMPONENT_META: Record<string, { category: Category; description: string }> = {
  // Primitives
  Button: { category: "Primitives", description: "Primary interactive element with multiple variants and sizes" },
  Badge: { category: "Primitives", description: "Inline status labels with color variants" },
  Kbd: { category: "Primitives", description: "Keyboard shortcut display element" },
  Divider: { category: "Primitives", description: "Horizontal rule with optional label" },
  Skeleton: { category: "Primitives", description: "Loading placeholder in text, circle, or rectangle shapes" },
  Label: { category: "Primitives", description: "Accessible form label element" },
  CopyButton: { category: "Primitives", description: "Click-to-copy button with success feedback" },
  CodeBlock: { category: "Primitives", description: "Code display with language label and copy button" },

  // Forms
  Input: { category: "Forms", description: "Text input with label, helper text, error state, and icon slots" },
  Textarea: { category: "Forms", description: "Multi-line text input with auto-resize option" },
  Checkbox: { category: "Forms", description: "Checkbox input with label and indeterminate state" },
  RadioGroup: { category: "Forms", description: "Radio button group for single selection" },
  Switch: { category: "Forms", description: "Toggle switch for boolean settings" },
  Toggle: { category: "Forms", description: "Animated on/off toggle button" },
  ToggleGroup: { category: "Forms", description: "Segmented control for exclusive selection" },
  Slider: { category: "Forms", description: "Range slider with single or dual thumbs" },
  Select: { category: "Forms", description: "Dropdown select with search and custom rendering" },
  OTPInput: { category: "Forms", description: "One-time password input with individual digit fields" },
  FileUpload: { category: "Forms", description: "File upload with drag-and-drop and preview" },
  DatePicker: { category: "Forms", description: "Date selection with calendar popup and presets" },
  DateRangePicker: { category: "Forms", description: "Date range selection with dual calendars" },
  TimePicker: { category: "Forms", description: "Time selection with hour and minute controls" },
  FormField: { category: "Forms", description: "Form field wrapper with label, error, and helper text" },
  RichTextEditor: { category: "Forms", description: "Rich text editor with formatting toolbar" },

  // Navigation
  Breadcrumbs: { category: "Navigation", description: "Breadcrumb navigation with customizable separators" },
  Pagination: { category: "Navigation", description: "Page navigation with page numbers and controls" },
  Tabs: { category: "Navigation", description: "Tab navigation with pills, underline, and segment styles" },
  Stepper: { category: "Navigation", description: "Step-by-step progress indicator" },
  Sidebar: { category: "Navigation", description: "Collapsible sidebar navigation with sections" },

  // Layout
  Container: { category: "Layout", description: "Centered content wrapper with max-width options" },
  Section: { category: "Layout", description: "Page section with eyebrow, title, and content area" },
  Hero: { category: "Layout", description: "Page hero section with centered or split layout" },
  Navbar: { category: "Layout", description: "Fixed navigation bar with responsive mobile menu" },
  Footer: { category: "Layout", description: "Multi-column site footer with links and bottom bar" },
  GradientBackground: { category: "Layout", description: "Decorative gradient overlay with preset themes" },
  Newsletter: { category: "Layout", description: "Email subscription form with title and description" },
  ResizablePanels: { category: "Layout", description: "Resizable split-panel layout with drag handle" },
  ScrollArea: { category: "Layout", description: "Custom scrollable area with styled scrollbar" },
  CTASection: { category: "Layout", description: "Call-to-action section with heading and buttons" },

  // Cards
  Card: { category: "Cards", description: "General-purpose card with Header, Body, and Footer" },
  BlogCard: { category: "Cards", description: "Article preview card with image, tag, and excerpt" },
  PricingCard: { category: "Cards", description: "Pricing tier card with features list and CTA" },
  FeatureCard: { category: "Cards", description: "Feature showcase card with icon and description" },
  SocialCard: { category: "Cards", description: "Gradient-backed card for social links" },
  StatCard: { category: "Cards", description: "Statistics display card with value, label, and trend" },
  Testimonial: { category: "Cards", description: "Customer quote card with author and avatar" },
  ChangelogEntry: { category: "Cards", description: "Timeline-style changelog item with version and tags" },

  // Data Display
  DataTable: { category: "Data Display", description: "Data table with sorting, filtering, and pagination" },
  VirtualList: { category: "Data Display", description: "Virtualized list for large datasets" },
  Accordion: { category: "Data Display", description: "Expandable content panels with single or multiple mode" },
  Collapsible: { category: "Data Display", description: "Collapsible content section with animated toggle" },
  Avatar: { category: "Data Display", description: "User avatar with image, fallback initials, and status dot" },
  AvatarGroup: { category: "Data Display", description: "Stacked avatar group with overflow indicator" },
  Timeline: { category: "Data Display", description: "Vertical timeline with customizable items" },

  // Charts
  LineChart: { category: "Charts", description: "Line chart with multiple series and tooltips" },
  BarChart: { category: "Charts", description: "Bar chart with grouped or stacked layout" },
  AreaChart: { category: "Charts", description: "Area chart with gradient fills" },
  PieChart: { category: "Charts", description: "Pie or donut chart with labels" },
  RadarChart: { category: "Charts", description: "Radar/spider chart for multi-axis comparison" },

  // Overlays
  Modal: { category: "Overlays", description: "Dialog modal with backdrop and focus trap" },
  FullscreenModal: { category: "Overlays", description: "Full-viewport modal overlay" },
  Drawer: { category: "Overlays", description: "Slide-out panel from any screen edge" },
  Popover: { category: "Overlays", description: "Floating content panel anchored to a trigger" },
  Tooltip: { category: "Overlays", description: "Hover/focus tooltip with configurable placement" },
  ContextMenu: { category: "Overlays", description: "Right-click context menu with items and dividers" },
  Dropdown: { category: "Overlays", description: "Dropdown menu (deprecated — use DropdownMenu)" },
  DropdownMenu: { category: "Overlays", description: "Dropdown menu with keyboard navigation" },
  CommandPalette: { category: "Overlays", description: "Spotlight-style command palette with search" },

  // Feedback
  Alert: { category: "Feedback", description: "Alert banner with info, success, warning, and error variants" },
  Toast: { category: "Feedback", description: "Notification toast with auto-dismiss" },
  Toaster: { category: "Feedback", description: "Toast container that renders active toasts" },
  Progress: { category: "Feedback", description: "Progress bar with determinate and indeterminate modes" },
  Spinner: { category: "Feedback", description: "Loading spinner animation" },
  SpinnerOverlay: { category: "Feedback", description: "Full-area loading overlay with spinner" },

  // Animation
  Animate: { category: "Animation", description: "Animation wrapper with preset enter/exit transitions" },
  StaggerGroup: { category: "Animation", description: "Staggered animation container for child elements" },
};

// Slug mapping for hand-written doc files (kebab-case filenames)
function toSlug(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// ---------------------------------------------------------------------------
// 2. Source parsing helpers
// ---------------------------------------------------------------------------

/** Extract balanced block starting from the first `{` at or after startIndex */
function extractBracedBlock(source: string, startIndex: number): string {
  let depth = 0;
  let started = false;
  let result = "";
  for (let i = startIndex; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") {
      depth++;
      started = true;
    }
    if (ch === "}") depth--;
    if (started) result += ch;
    if (started && depth === 0) return result;
  }
  return result;
}

interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

/** Extract custom props from a component's Props type/interface definition */
function extractProps(source: string, componentName: string): PropInfo[] {
  const props: PropInfo[] = [];

  // Try multiple patterns for the props definition
  const propsPatterns = [
    // type XProps = ... & { ... }
    new RegExp(`type\\s+${componentName}Props\\s*=\\s*[^{]*\\{`, "s"),
    // interface XProps { ... }
    new RegExp(`interface\\s+${componentName}Props\\s*(?:extends\\s+[^{]*)?\\{`, "s"),
    // Also try without exact component name prefix (e.g., "Props" alone)
    new RegExp(`type\\s+\\w*Props\\s*=\\s*[^{]*\\{`, "s"),
  ];

  let blockStart = -1;
  for (const pattern of propsPatterns) {
    const match = source.match(pattern);
    if (match && match.index !== undefined) {
      // Find the last { in the match to get the props block
      const matchEnd = match.index + match[0].length;
      blockStart = matchEnd - 1; // position of the {
      break;
    }
  }

  if (blockStart === -1) return props;

  const block = extractBracedBlock(source, blockStart);
  if (!block) return props;

  // Remove the outer braces
  const inner = block.slice(1, -1);

  // Parse individual prop lines
  // Handle JSDoc comments: /** description */
  const lines = inner.split("\n");
  let currentJSDoc = "";

  for (const line of lines) {
    const trimmed = line.trim();

    // Capture JSDoc single-line: /** ... */
    const jsdocMatch = trimmed.match(/^\/\*\*\s*(.*?)\s*\*\/$/);
    if (jsdocMatch) {
      currentJSDoc = jsdocMatch[1];
      continue;
    }

    // Skip multi-line JSDoc markers
    if (trimmed.startsWith("/**") || trimmed.startsWith("*") || trimmed.startsWith("*/")) {
      const inlineMatch = trimmed.match(/^\*\s+(.+)/);
      if (inlineMatch) currentJSDoc = inlineMatch[1].replace(/\*\/$/, "").trim();
      continue;
    }

    // Match prop definition: name?: Type;
    const propMatch = trimmed.match(/^(readonly\s+)?(\w+)(\?)?:\s*(.+?);?\s*$/);
    if (propMatch) {
      const [, , name, optional, type] = propMatch;
      // Skip React internal props and common HTML attrs
      if (["children", "className", "style", "ref", "key"].includes(name)) {
        currentJSDoc = "";
        continue;
      }
      props.push({
        name,
        type: cleanType(type),
        required: !optional,
        description: currentJSDoc,
      });
      currentJSDoc = "";
    } else {
      // Reset JSDoc if we hit a non-prop line
      if (trimmed && !trimmed.startsWith("//")) currentJSDoc = "";
    }
  }

  return props;
}

/** Clean up type strings for display */
function cleanType(type: string): string {
  return type
    .replace(/\s+/g, " ")
    .replace(/;$/, "")
    .trim();
}

interface VariantInfo {
  name: string;
  options: string[];
  default?: string;
}

/** Strip string literals from source to prevent matching content inside strings */
function stripStrings(source: string): string {
  // Replace content of "..." and '...' and `...` with empty strings
  return source
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/`(?:[^`\\]|\\.)*`/g, "``");
}

/** Extract CVA variant definitions from source (handles multiple cva calls) */
function extractCVAVariants(source: string): VariantInfo[] {
  const variants: VariantInfo[] = [];
  const seen = new Map<string, VariantInfo>();

  // Find ALL cva() calls
  const cvaRegex = /\bconst\s+\w+\s*=\s*cva\s*\(/gs;
  let cvaMatch;

  while ((cvaMatch = cvaRegex.exec(source)) !== null) {
    const cvaStart = cvaMatch.index + cvaMatch[0].length;
    const afterCva = source.slice(cvaStart);
    const variantsIdx = afterCva.indexOf("variants:");
    if (variantsIdx === -1) continue;

    const variantsBlockStart = cvaStart + variantsIdx + "variants:".length;
    const nextBrace = source.indexOf("{", variantsBlockStart);
    if (nextBrace === -1) continue;

    const variantsBlock = extractBracedBlock(source, nextBrace);
    if (!variantsBlock) continue;

    // Strip strings to avoid matching CSS pseudo-classes like hover: inside class strings
    const cleanBlock = stripStrings(variantsBlock);

    // Parse each variant: name: { option1: ..., option2: ... }
    const variantRegex = /(\w+)\s*:\s*\{/g;
    let match;
    while ((match = variantRegex.exec(cleanBlock)) !== null) {
      const variantName = match[1];
      const optionBlockStart = match.index + match[0].length - 1;
      const optionBlock = extractBracedBlock(cleanBlock, optionBlockStart);
      if (!optionBlock) continue;

      // Extract option keys at top level only
      const inner = optionBlock.slice(1, -1);
      const optionKeys: string[] = [];
      const keyRegex = /(\w+)\s*:/g;
      let keyMatch;
      while ((keyMatch = keyRegex.exec(inner)) !== null) {
        const before = inner.slice(0, keyMatch.index);
        let d = 0;
        for (const ch of before) {
          if (ch === "{" || ch === "[") d++;
          if (ch === "}" || ch === "]") d--;
        }
        if (d === 0) optionKeys.push(keyMatch[1]);
      }

      if (optionKeys.length > 0 && !seen.has(variantName)) {
        const info: VariantInfo = { name: variantName, options: optionKeys };
        seen.set(variantName, info);
        variants.push(info);
      }
    }

    // Extract defaultVariants
    const defaultsMatch = afterCva.match(/defaultVariants\s*:\s*\{([^}]+)\}/);
    if (defaultsMatch) {
      const defaultsBlock = defaultsMatch[1];
      const defaultRegex = /(\w+)\s*:\s*"(\w+)"/g;
      let dm;
      while ((dm = defaultRegex.exec(defaultsBlock)) !== null) {
        const variant = seen.get(dm[1]);
        if (variant && !variant.default) variant.default = dm[2];
      }
    }
  }

  return variants;
}

/** Detect compound sub-components (Object.assign pattern) */
function extractCompoundComponents(source: string, componentName: string): string[] {
  const subs: string[] = [];

  // Pattern: Object.assign(XRoot, { Header: XHeader, Body: XBody })
  const assignMatch = source.match(
    /Object\.assign\s*\(\s*\w+\s*,\s*\{([\s\S]+?)\}\s*\)/
  );
  if (assignMatch) {
    const entries = assignMatch[1];
    const keyRegex = /(\w+)\s*:/g;
    let m;
    while ((m = keyRegex.exec(entries)) !== null) {
      subs.push(`${componentName}.${m[1]}`);
    }
  }

  return subs;
}

/** Check if component uses forwardRef */
function usesForwardRef(source: string): boolean {
  return /\bforwardRef\s*</.test(source);
}

/** Detect what HTML element type the component extends */
function detectBaseElement(source: string): string | null {
  const match = source.match(/HTML(\w+)Element/);
  return match ? match[1].toLowerCase() : null;
}

// ---------------------------------------------------------------------------
// 3. Documentation generation
// ---------------------------------------------------------------------------

interface ComponentEntry {
  name: string;
  slug: string;
  category: string;
  description: string;
  doc: string;
}

function generateDoc(
  name: string,
  description: string,
  props: PropInfo[],
  variants: VariantInfo[],
  subComponents: string[],
  hasForwardRef: boolean,
  baseElement: string | null
): string {
  const lines: string[] = [];

  lines.push(`# ${name}\n`);
  lines.push(`${description}\n`);

  // Import
  lines.push(`## Import\n`);
  lines.push("```tsx");
  lines.push(`import { ${name} } from "@charlietogolden/charlie-ui";`);
  lines.push("```\n");

  // Props table
  if (props.length > 0) {
    lines.push(`## Props\n`);
    lines.push("| Prop | Type | Required | Description |");
    lines.push("|------|------|----------|-------------|");
    for (const p of props) {
      const typeStr = p.type.replace(/\|/g, "\\|");
      lines.push(`| ${p.name} | \`${typeStr}\` | ${p.required ? "Yes" : "No"} | ${p.description} |`);
    }
    lines.push("");
  }

  // Variants
  if (variants.length > 0) {
    lines.push(`## Variants\n`);
    for (const v of variants) {
      const options = v.options
        .map((o) => (o === v.default ? `\`${o}\` (default)` : `\`${o}\``))
        .join(", ");
      lines.push(`**${v.name}:** ${options}\n`);
    }
  }

  // Sub-components
  if (subComponents.length > 0) {
    lines.push(`## Sub-components\n`);
    for (const sub of subComponents) {
      lines.push(`- \`<${sub} />\``);
    }
    lines.push("");
  }

  // Notes
  const notes: string[] = [];
  if (hasForwardRef) notes.push("Supports `ref` forwarding.");
  if (baseElement) notes.push(`Renders as \`<${baseElement}>\` — accepts all standard HTML attributes.`);
  if (notes.length > 0) {
    lines.push(`## Notes\n`);
    for (const n of notes) lines.push(`- ${n}`);
    lines.push("");
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// 4. Main build
// ---------------------------------------------------------------------------

// Scan source files
const files = readdirSync(srcDir).filter(
  (f) =>
    f.endsWith(".tsx") &&
    !f.endsWith(".stories.tsx") &&
    !f.endsWith(".test.tsx") &&
    !f.startsWith("__") &&
    !f.includes("toast-store")
);

const components: ComponentEntry[] = [];
const unmapped: string[] = [];

for (const file of files) {
  const name = basename(file, ".tsx");
  const meta = COMPONENT_META[name];

  if (!meta) {
    unmapped.push(name);
    continue;
  }

  const slug = toSlug(name);
  const filePath = join(srcDir, file);
  const source = readFileSync(filePath, "utf-8");

  // Check for hand-written doc first
  const handwrittenPath = join(docsDir, "components", `${slug}.md`);
  let doc: string;

  if (existsSync(handwrittenPath)) {
    doc = readFileSync(handwrittenPath, "utf-8");
  } else {
    // Auto-generate from source
    const props = extractProps(source, name);
    const variants = extractCVAVariants(source);
    const subs = extractCompoundComponents(source, name);
    const fwdRef = usesForwardRef(source);
    const baseEl = detectBaseElement(source);
    doc = generateDoc(name, meta.description, props, variants, subs, fwdRef, baseEl);
  }

  components.push({
    name,
    slug,
    category: meta.category,
    description: meta.description,
    doc,
  });
}

// Sort by category order, then alphabetically within category
const categoryOrder = Object.fromEntries(CATEGORIES.map((c, i) => [c, i]));
components.sort((a, b) => {
  const catDiff = (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99);
  return catDiff !== 0 ? catDiff : a.name.localeCompare(b.name);
});

// Log unmapped components
if (unmapped.length > 0) {
  console.warn(`  Skipped (no metadata): ${unmapped.join(", ")}`);
}

// ---------------------------------------------------------------------------
// 5. Read guide files (still from docs/)
// ---------------------------------------------------------------------------
function readGuide(relativePath: string): string {
  try {
    return readFileSync(join(docsDir, relativePath), "utf-8");
  } catch {
    console.warn(`  Warning: missing guide ${relativePath}`);
    return "";
  }
}

const guides: Record<string, string> = {
  installation: readGuide("getting-started/installation.md"),
  quickStart: readGuide("getting-started/quick-start.md"),
  designTokens: readGuide("getting-started/design-tokens.md"),
  theming: readGuide("guides/theming.md"),
  responsive: readGuide("guides/responsive.md"),
  animations: readGuide("guides/animations.md"),
};

// ---------------------------------------------------------------------------
// 6. Write registry
// ---------------------------------------------------------------------------
const data = { components, guides };

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  `// Auto-generated by build-registry.ts — do not edit manually\nexport default ${JSON.stringify(data, null, 0)};\n`
);

console.log(
  `Registry built: ${components.length} components across ${CATEGORIES.length} categories → ${outFile}`
);
