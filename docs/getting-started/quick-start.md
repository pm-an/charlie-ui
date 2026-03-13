# Quick Start

This guide walks you through building a simple landing page using Charlie UI components. By the end, you will have a working page with a navbar, hero section, feature cards, and a footer.

## Basic Setup

Make sure you have completed the [Installation](installation.md) steps, then import the components you need:

```tsx
import {
  Navbar,
  Hero,
  Section,
  Container,
  FeatureCard,
  Button,
  Badge,
  Footer,
} from "@piotr/charlie-ui";
import "@piotr/charlie-ui/styles.css";
```

## Building a Landing Page

### 1. Add a Navbar

```tsx
<Navbar
  logo={<span className="text-white font-bold text-lg">MyApp</span>}
  links={[
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#docs", badge: "New" },
  ]}
  actions={
    <>
      <Button variant="ghost" size="sm">Sign In</Button>
      <Button variant="primary" size="sm">Get Started</Button>
    </>
  }
/>
```

### 2. Add a Hero Section

```tsx
<Hero
  variant="centered"
  gradient
  eyebrow="Introducing MyApp"
  title="Build faster with dark-themed components"
  description="A complete component library for modern React applications, designed with care and shipped with love."
  actions={
    <>
      <Button variant="primary" size="lg">Get Started</Button>
      <Button variant="secondary" size="lg">View on GitHub</Button>
    </>
  }
/>
```

### 3. Add Feature Cards in a Section

```tsx
import { Zap, Shield, Palette } from "lucide-react";

<Section
  eyebrow="Features"
  title="Everything you need"
  description="Built for developers who care about design."
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <FeatureCard
      icon={<Zap className="w-5 h-5" />}
      title="Lightning Fast"
      description="Optimized for performance with minimal bundle size."
    />
    <FeatureCard
      icon={<Shield className="w-5 h-5" />}
      title="Type Safe"
      description="Full TypeScript support with comprehensive type definitions."
    />
    <FeatureCard
      icon={<Palette className="w-5 h-5" />}
      title="Customizable"
      description="Extend and override any design token with Tailwind CSS."
    />
  </div>
</Section>
```

### 4. Use Cards for Content

```tsx
import { Card } from "@piotr/charlie-ui";

<Card>
  <Card.Header
    title="Getting Started"
    description="Learn how to use Charlie UI in your project."
  />
  <Card.Body>
    <p className="text-white/60 text-sm">
      Charlie UI provides 30+ components designed for dark-themed interfaces.
    </p>
  </Card.Body>
  <Card.Footer>
    <div className="flex gap-3">
      <Badge variant="green">Stable</Badge>
      <Badge variant="blue">v0.1.0</Badge>
    </div>
  </Card.Footer>
</Card>
```

### 5. Add a Footer

```tsx
<Footer
  logo={<span className="text-white font-bold text-lg">MyApp</span>}
  columns={[
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Changelog", href: "#changelog" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#docs" },
        { label: "GitHub", href: "https://github.com", external: true },
      ],
    },
  ]}
  bottom={<span>Copyright 2026 MyApp. All rights reserved.</span>}
/>
```

## Full Page Example

Here is the complete page assembled together:

```tsx
import {
  Navbar, Hero, Section, FeatureCard,
  Card, Badge, Button, Footer,
} from "@piotr/charlie-ui";
import "@piotr/charlie-ui/styles.css";
import { Zap, Shield, Palette } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Navbar
        logo={<span className="text-white font-bold text-lg">MyApp</span>}
        links={[
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
        ]}
        actions={<Button size="sm">Get Started</Button>}
      />

      <Hero
        gradient
        eyebrow="Welcome"
        title="Build beautiful dark UIs"
        description="30+ components. TypeScript. Tailwind CSS v4."
        actions={<Button size="lg">Get Started</Button>}
      />

      <Section eyebrow="Features" title="Why Charlie UI?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="Fast"
            description="Lightweight and optimized."
          />
          <FeatureCard
            icon={<Shield className="w-5 h-5" />}
            title="Typed"
            description="Full TypeScript support."
          />
          <FeatureCard
            icon={<Palette className="w-5 h-5" />}
            title="Themed"
            description="Customizable design tokens."
          />
        </div>
      </Section>

      <Footer
        logo={<span className="text-white font-bold">MyApp</span>}
        columns={[
          {
            title: "Links",
            links: [{ label: "GitHub", href: "#", external: true }],
          },
        ]}
      />
    </div>
  );
}
```
