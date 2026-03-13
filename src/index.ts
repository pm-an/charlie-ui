// === Utilities ===
export { cn } from "./utils/cn";

// === Theming ===
export {
  ThemeProvider,
  useTheme,
  type CharlieTheme,
  type ThemeProviderProps,
} from "./components/ThemeProvider";
export {
  defaultTheme,
  indigoTheme,
  oceanTheme,
  emeraldTheme,
  amberTheme,
  roseTheme,
  violetTheme,
  createTheme,
} from "./themes/presets";

// === Atoms ===
export { Button, buttonVariants, type ButtonProps } from "./components/Button";
export { Badge, badgeVariants, type BadgeProps } from "./components/Badge";
export { Input, type InputProps } from "./components/Input";
export { Toggle, type ToggleProps } from "./components/Toggle";
export { Kbd, type KbdProps } from "./components/Kbd";
export { Divider, dividerVariants, type DividerProps } from "./components/Divider";
export { CodeBlock, type CodeBlockProps } from "./components/CodeBlock";
export { Skeleton, skeletonVariants, type SkeletonProps } from "./components/Skeleton";

// === Cards ===
export { Card, type CardProps } from "./components/Card";
export { FeatureCard, type FeatureCardProps } from "./components/FeatureCard";
export { PricingCard, type PricingCardProps } from "./components/PricingCard";
export { Accordion, type AccordionProps } from "./components/Accordion";
export { Testimonial, type TestimonialProps } from "./components/Testimonial";
export { BlogCard, type BlogCardProps } from "./components/BlogCard";

// === Layout ===
export { Navbar, type NavbarProps } from "./components/Navbar";
export { Hero, type HeroProps } from "./components/Hero";
export { Section, type SectionProps } from "./components/Section";
export { Container, type ContainerProps } from "./components/Container";
export { Footer, type FooterProps } from "./components/Footer";
export { Newsletter, type NewsletterProps } from "./components/Newsletter";
export { GradientBackground, type GradientBackgroundProps } from "./components/GradientBackground";
export { SocialCard, type SocialCardProps } from "./components/SocialCard";

// === Interactive ===
export { Tabs, type TabsProps } from "./components/Tabs";
export { Tooltip, type TooltipProps } from "./components/Tooltip";
export { Avatar, type AvatarProps } from "./components/Avatar";
export { AvatarGroup, type AvatarGroupProps } from "./components/AvatarGroup";
export { CommandPalette, type CommandPaletteProps } from "./components/CommandPalette";
export { ToggleGroup, type ToggleGroupProps } from "./components/ToggleGroup";
export { ChangelogEntry, type ChangelogEntryProps } from "./components/ChangelogEntry";
export { Toast, type ToastProps } from "./components/Toast";
