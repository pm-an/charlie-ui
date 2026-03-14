import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import registry from "./generated/registry.js";

const server = new McpServer({
  name: "charlie-ui",
  version: "0.1.0",
});

// ---------------------------------------------------------------------------
// Tool: list_components
// ---------------------------------------------------------------------------
server.tool(
  "list_components",
  "List all Charlie UI components. Optionally filter by category.",
  {
    category: z
      .enum([
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
      ])
      .optional()
      .describe("Filter by component category"),
  },
  async ({ category }) => {
    let components = registry.components;
    if (category) {
      components = components.filter(
        (c: { category: string }) => c.category === category
      );
    }

    const grouped: Record<string, typeof components> = {};
    for (const c of components) {
      (grouped[c.category] ??= []).push(c);
    }

    let text = `# Charlie UI Components (${components.length})\n\n`;
    for (const [cat, comps] of Object.entries(grouped)) {
      text += `## ${cat}\n`;
      for (const c of comps) {
        text += `- **${c.name}** — ${c.description}\n`;
      }
      text += "\n";
    }

    return { content: [{ type: "text", text }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: get_component
// ---------------------------------------------------------------------------
server.tool(
  "get_component",
  "Get full documentation for a specific Charlie UI component including props, variants, and usage examples.",
  {
    name: z
      .string()
      .describe("Component name (e.g. 'Button', 'Card', 'Tabs')"),
  },
  async ({ name }) => {
    const normalized = name.toLowerCase().replace(/[-_\s]/g, "");
    const component = registry.components.find(
      (c: { name: string; slug: string }) =>
        c.name.toLowerCase() === normalized ||
        c.slug.replace(/-/g, "") === normalized
    );

    if (!component) {
      const suggestions = registry.components
        .filter(
          (c: { name: string; slug: string }) =>
            c.name.toLowerCase().includes(normalized) ||
            c.slug.includes(normalized)
        )
        .map((c: { name: string }) => c.name);

      return {
        content: [
          {
            type: "text" as const,
            text: `Component "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : ""}\n\nUse list_components to see all available components.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `**Category:** ${component.category}\n\n${component.doc}`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: search_components
// ---------------------------------------------------------------------------
server.tool(
  "search_components",
  "Search Charlie UI components by keyword across names, descriptions, and documentation content.",
  {
    query: z
      .string()
      .describe(
        "Search query (e.g. 'loading', 'form', 'navigation', 'animation')"
      ),
  },
  async ({ query }) => {
    const terms = query.toLowerCase().split(/\s+/);

    const results = registry.components
      .map(
        (c: {
          name: string;
          category: string;
          description: string;
          doc: string;
        }) => {
          const haystack =
            `${c.name} ${c.category} ${c.description} ${c.doc}`.toLowerCase();
          const score = terms.reduce(
            (s, t) => s + (haystack.includes(t) ? 1 : 0),
            0
          );
          return { ...c, score };
        }
      )
      .filter((c: { score: number }) => c.score > 0)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No components found matching "${query}". Try broader terms or use list_components to browse.`,
          },
        ],
      };
    }

    let text = `# Search Results for "${query}" (${results.length} matches)\n\n`;
    for (const r of results) {
      text += `- **${r.name}** (${r.category}) — ${r.description}\n`;
    }
    text += `\nUse get_component to get full details for any component.`;

    return { content: [{ type: "text", text }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: get_design_tokens
// ---------------------------------------------------------------------------
server.tool(
  "get_design_tokens",
  "Get Charlie UI design token reference — colors, typography, spacing, radii, shadows, and animations.",
  {
    section: z
      .enum([
        "all",
        "colors",
        "typography",
        "spacing",
        "radii",
        "shadows",
        "animations",
      ])
      .optional()
      .describe("Specific token section. Defaults to all."),
  },
  async ({ section = "all" }) => {
    const doc = registry.guides.designTokens;

    if (section === "all") {
      return { content: [{ type: "text" as const, text: doc }] };
    }

    const sectionMap: Record<string, string> = {
      colors: "Color Palette",
      typography: "Typography",
      spacing: "Spacing",
      radii: "Border Radii",
      shadows: "Shadows",
      animations: "CSS Animations",
    };

    const heading = sectionMap[section];
    const regex = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`);
    const match = doc.match(regex);

    return {
      content: [
        {
          type: "text" as const,
          text: match ? `## ${heading}\n${match[1].trim()}` : doc,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: get_theme_info
// ---------------------------------------------------------------------------
server.tool(
  "get_theme_info",
  "Get the Charlie UI theming guide — how to customize colors, tokens, fonts, and override component styles.",
  async () => {
    return {
      content: [{ type: "text" as const, text: registry.guides.theming }],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: get_setup_guide
// ---------------------------------------------------------------------------
server.tool(
  "get_setup_guide",
  "Get Charlie UI installation and setup instructions.",
  async () => {
    const text = [registry.guides.installation, registry.guides.quickStart]
      .filter(Boolean)
      .join("\n\n---\n\n");

    return { content: [{ type: "text" as const, text }] };
  }
);

// ---------------------------------------------------------------------------
// Connect
// ---------------------------------------------------------------------------
const transport = new StdioServerTransport();
await server.connect(transport);
