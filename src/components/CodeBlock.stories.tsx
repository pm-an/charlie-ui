import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CodeBlock } from "./CodeBlock";

const meta: Meta<typeof CodeBlock> = {
  title: "Primitives/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  argTypes: {
    language: { control: "text" },
    showCopy: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = {
  args: {
    code: `const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};

greet("world");`,
  },
};

export const WithLanguage: Story = {
  args: {
    language: "typescript",
    code: `interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
}

function getDisplayName(user: User): string {
  return user.name ?? user.email;
}`,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("typescript")).toBeVisible();
    await expect(canvas.getByText(/interface User/)).toBeVisible();
  },
};

export const WithCopyButton: Story = {
  args: {
    showCopy: true,
    language: "bash",
    code: `npm install @charlie-ui/react`,
  },
};
