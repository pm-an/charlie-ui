import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizablePanels } from "./ResizablePanels";

const meta: Meta<typeof ResizablePanels> = {
  title: "Layout/ResizablePanels",
  component: ResizablePanels,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ResizablePanels>;

export const Horizontal: Story = {
  render: () => (
    <div className="h-screen">
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={25} minSize={15}>
          <div className="h-full bg-bg-200 p-4">
            <h3 className="text-sm font-medium text-white/80 mb-3">
              Sidebar
            </h3>
            <ul className="space-y-1 text-sm text-white/60">
              <li className="px-2 py-1.5 rounded bg-white/5 text-white/90">
                Dashboard
              </li>
              <li className="px-2 py-1.5 rounded hover:bg-white/5">
                Projects
              </li>
              <li className="px-2 py-1.5 rounded hover:bg-white/5">
                Settings
              </li>
              <li className="px-2 py-1.5 rounded hover:bg-white/5">
                Team Members
              </li>
              <li className="px-2 py-1.5 rounded hover:bg-white/5">
                Analytics
              </li>
            </ul>
          </div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={75}>
          <div className="h-full p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Dashboard Overview
            </h2>
            <p className="text-sm text-white/60 mb-4">
              Welcome back. Here is a summary of your project activity for the
              past 7 days.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-white/6 bg-white/[0.02] p-4">
                <p className="text-xs text-white/40 mb-1">Total Commits</p>
                <p className="text-2xl font-bold text-white">142</p>
              </div>
              <div className="rounded-lg border border-white/6 bg-white/[0.02] p-4">
                <p className="text-xs text-white/40 mb-1">Open PRs</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <div className="rounded-lg border border-white/6 bg-white/[0.02] p-4">
                <p className="text-xs text-white/40 mb-1">Deployments</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
            </div>
          </div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-screen">
      <ResizablePanels direction="vertical">
        <ResizablePanels.Panel defaultSize={65} minSize={30}>
          <div className="h-full bg-bg-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-white/40">
                main.tsx
              </span>
            </div>
            <pre className="text-sm font-mono text-white/80 leading-relaxed">
              <code>{`import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/globals.css";

const root = createRoot(
  document.getElementById("root")!
);

root.render(<App />);`}</code>
            </pre>
          </div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={35} minSize={20}>
          <div className="h-full bg-black/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-green-400/80">
                ~ /project
              </span>
              <span className="text-xs font-mono text-white/40">$</span>
            </div>
            <pre className="text-sm font-mono text-white/60 leading-relaxed">
              <code>{`$ npm run build
> tsc -b && vite build

vite v7.3.1 building for production...
transforming (42) src/components/index.ts
✓ 86 modules transformed.
dist/index.mjs   48.2 kB │ gzip: 12.8 kB
dist/style.css    6.1 kB │ gzip:  1.9 kB
✓ built in 1.24s`}</code>
            </pre>
          </div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    </div>
  ),
};

export const WithHandle: Story = {
  render: () => (
    <div className="h-screen">
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={30} minSize={20}>
          <div className="h-full bg-bg-200 p-4">
            <h3 className="text-sm font-medium text-white/80 mb-3">Files</h3>
            <ul className="space-y-0.5 text-sm font-mono text-white/60">
              <li className="px-2 py-1 rounded bg-white/5 text-white/90">
                src/App.tsx
              </li>
              <li className="px-2 py-1 rounded">src/index.ts</li>
              <li className="px-2 py-1 rounded">src/utils/cn.ts</li>
              <li className="px-2 py-1 rounded">package.json</li>
              <li className="px-2 py-1 rounded">tsconfig.json</li>
              <li className="px-2 py-1 rounded">vite.config.ts</li>
            </ul>
          </div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle withHandle />
        <ResizablePanels.Panel defaultSize={70}>
          <div className="h-full p-4">
            <pre className="text-sm font-mono text-white/80 leading-relaxed">
              <code>{`export function App() {
  return (
    <main className="min-h-screen bg-bg-100">
      <h1 className="text-2xl font-bold">
        Hello World
      </h1>
    </main>
  );
}`}</code>
            </pre>
          </div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    </div>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <div className="h-screen">
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={20} minSize={12}>
          <div className="h-full bg-bg-200 p-4">
            <h3 className="text-sm font-medium text-white/80 mb-3">
              Explorer
            </h3>
            <ul className="space-y-0.5 text-sm font-mono text-white/50">
              <li className="px-2 py-1 text-white/30">src/</li>
              <li className="px-2 py-1 pl-5 rounded bg-white/5 text-white/90">
                Button.tsx
              </li>
              <li className="px-2 py-1 pl-5">Card.tsx</li>
              <li className="px-2 py-1 pl-5">Input.tsx</li>
              <li className="px-2 py-1 pl-5">Modal.tsx</li>
            </ul>
          </div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={55} minSize={30}>
          <div className="h-full p-4">
            <div className="text-xs font-mono text-white/40 mb-3">
              Button.tsx
            </div>
            <pre className="text-sm font-mono text-white/80 leading-relaxed">
              <code>{`import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white",
        secondary: "bg-white/5 text-white/80",
        ghost: "text-white/60 hover:bg-white/5",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);`}</code>
            </pre>
          </div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={25} minSize={15}>
          <div className="h-full bg-bg-200 p-4">
            <h3 className="text-sm font-medium text-white/80 mb-3">
              Properties
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-white/40">variant</span>
                <p className="text-white/70 mt-0.5">
                  &quot;primary&quot; | &quot;secondary&quot; | &quot;ghost&quot;
                </p>
              </div>
              <div>
                <span className="text-white/40">size</span>
                <p className="text-white/70 mt-0.5">
                  &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;
                </p>
              </div>
              <div>
                <span className="text-white/40">disabled</span>
                <p className="text-white/70 mt-0.5">boolean</p>
              </div>
            </div>
          </div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <div className="h-screen">
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel defaultSize={25} minSize={15}>
          <div className="h-full bg-bg-200 p-4">
            <h3 className="text-sm font-medium text-white/80 mb-3">
              Navigation
            </h3>
            <ul className="space-y-1 text-sm text-white/60">
              <li className="px-2 py-1.5 rounded bg-white/5 text-white/90">
                Components
              </li>
              <li className="px-2 py-1.5 rounded">Hooks</li>
              <li className="px-2 py-1.5 rounded">Utilities</li>
              <li className="px-2 py-1.5 rounded">Themes</li>
            </ul>
          </div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel defaultSize={75}>
          <ResizablePanels direction="vertical">
            <ResizablePanels.Panel defaultSize={60} minSize={25}>
              <div className="h-full p-4">
                <div className="text-xs font-mono text-white/40 mb-3">
                  Editor
                </div>
                <pre className="text-sm font-mono text-white/80 leading-relaxed">
                  <code>{`function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }
  return context;
}`}</code>
                </pre>
              </div>
            </ResizablePanels.Panel>
            <ResizablePanels.Handle withHandle />
            <ResizablePanels.Panel defaultSize={40} minSize={20}>
              <div className="h-full bg-black/30 p-4">
                <div className="text-xs font-mono text-white/40 mb-2">
                  Output
                </div>
                <pre className="text-sm font-mono text-green-400/70 leading-relaxed">
                  <code>{`PASS  src/hooks/useTheme.test.ts
  ✓ returns theme context value (3ms)
  ✓ throws when used outside provider (1ms)
  ✓ updates on theme change (5ms)

Tests:  3 passed, 3 total
Time:   0.42s`}</code>
                </pre>
              </div>
            </ResizablePanels.Panel>
          </ResizablePanels>
        </ResizablePanels.Panel>
      </ResizablePanels>
    </div>
  ),
};

export const WithMinMax: Story = {
  render: () => (
    <div className="h-screen">
      <ResizablePanels direction="horizontal">
        <ResizablePanels.Panel
          defaultSize={30}
          minSize={15}
          maxSize={40}
        >
          <div className="h-full bg-bg-200 p-4">
            <h3 className="text-sm font-medium text-white/80 mb-1">
              Sidebar
            </h3>
            <p className="text-xs text-white/40 mb-3">
              Constrained: 15% min, 40% max
            </p>
            <ul className="space-y-1 text-sm text-white/60">
              <li className="px-2 py-1.5 rounded bg-white/5 text-white/90">
                Inbox (12)
              </li>
              <li className="px-2 py-1.5 rounded">Drafts (3)</li>
              <li className="px-2 py-1.5 rounded">Sent</li>
              <li className="px-2 py-1.5 rounded">Archive</li>
              <li className="px-2 py-1.5 rounded">Trash</li>
            </ul>
          </div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle withHandle />
        <ResizablePanels.Panel defaultSize={70} minSize={40}>
          <div className="h-full p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Inbox</h2>
            <p className="text-xs text-white/40 mb-4">
              Content panel: 40% minimum
            </p>
            <div className="space-y-2">
              <div className="rounded-lg border border-white/6 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white/90">
                    Design review feedback
                  </span>
                  <span className="text-xs text-white/30">2h ago</span>
                </div>
                <p className="text-sm text-white/50">
                  The latest mockups look great. A few notes on spacing...
                </p>
              </div>
              <div className="rounded-lg border border-white/6 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white/90">
                    CI pipeline update
                  </span>
                  <span className="text-xs text-white/30">5h ago</span>
                </div>
                <p className="text-sm text-white/50">
                  Build times have been reduced by 40% after switching to...
                </p>
              </div>
              <div className="rounded-lg border border-white/6 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white/90">
                    Sprint planning notes
                  </span>
                  <span className="text-xs text-white/30">1d ago</span>
                </div>
                <p className="text-sm text-white/50">
                  Here are the action items from today's planning session...
                </p>
              </div>
            </div>
          </div>
        </ResizablePanels.Panel>
      </ResizablePanels>
    </div>
  ),
};
