import type { Meta, StoryObj } from "@storybook/react-vite";
import { BentoGrid } from "./BentoGrid";
import { Zap, Shield, BarChart3, Globe, Layers } from "lucide-react";

const meta: Meta<typeof BentoGrid> = {
  title: "Blocks/Marketing/BentoGrid",
  component: BentoGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-[#0a0a0b] p-8 md:p-12">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof BentoGrid>;

export const Default: Story = {
  render: () => (
    <BentoGrid>
      <BentoGrid.Item
        colSpan={2}
        rowSpan={2}
        icon={<Zap className="h-5 w-5" />}
        title="Lightning-fast performance"
        description="Built on modern React with tree-shaking, lazy loading, and zero-config optimizations. Every component is designed to render in under 16ms."
      />
      <BentoGrid.Item
        icon={<Shield className="h-5 w-5" />}
        title="Enterprise security"
        description="SOC 2 compliant with end-to-end encryption and role-based access control."
      />
      <BentoGrid.Item
        icon={<BarChart3 className="h-5 w-5" />}
        title="Real-time analytics"
        description="Track user behavior and performance metrics in real time."
      />
      <BentoGrid.Item
        colSpan={2}
        icon={<Globe className="h-5 w-5" />}
        title="Global CDN"
        description="Deployed across 200+ edge locations worldwide for sub-50ms response times."
      />
      <BentoGrid.Item
        icon={<Layers className="h-5 w-5" />}
        title="Composable architecture"
        description="Mix and match components to build any layout you can imagine."
      />
    </BentoGrid>
  ),
};

export const WithImages: Story = {
  render: () => (
    <BentoGrid>
      <BentoGrid.Item
        colSpan={2}
        rowSpan={2}
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
        title="Global infrastructure"
        description="Distributed across 6 continents with automatic failover and load balancing."
      />
      <BentoGrid.Item
        image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80"
        title="Data centers"
        description="Tier 4 certified facilities."
      />
      <BentoGrid.Item
        image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80"
        title="Encrypted"
        description="256-bit AES encryption at rest."
      />
      <BentoGrid.Item
        colSpan={2}
        image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
        title="Network monitoring"
        description="24/7 automated threat detection and response."
      />
      <BentoGrid.Item
        icon={<Shield className="h-5 w-5" />}
        title="Compliance"
        description="GDPR, HIPAA, and SOC 2 certified."
      />
    </BentoGrid>
  ),
};

export const Simple: Story = {
  render: () => (
    <BentoGrid>
      <BentoGrid.Item
        icon={<Zap className="h-5 w-5" />}
        title="Fast"
        description="Optimized for speed and efficiency."
      />
      <BentoGrid.Item
        icon={<Shield className="h-5 w-5" />}
        title="Secure"
        description="Built with security-first principles."
      />
      <BentoGrid.Item
        icon={<Globe className="h-5 w-5" />}
        title="Global"
        description="Available everywhere, always."
      />
    </BentoGrid>
  ),
};
