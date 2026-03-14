// === Utilities ===
export { cn } from "./utils/cn";
export { Slot, type SlotProps } from "./utils/Slot";
export { composeRefs } from "./utils/composeRefs";

// === Hooks ===
export { useControllableState, useFieldAware, type UseFieldAwareOptions, type UseFieldAwareReturn } from "./hooks";
export { useFocusTrap } from "./hooks/useFocusTrap";
export { useFocusReturn } from "./hooks/useFocusReturn";
export { useRovingTabIndex, type RovingDirection, type UseRovingTabIndexOptions } from "./hooks/useRovingTabIndex";
export { useAriaAnnounce } from "./hooks/useAriaAnnounce";
export { useEscapeKey } from "./hooks/useEscapeKey";
export { useScrollLock } from "./hooks/useScrollLock";

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
export { Kbd, kbdVariants, resolveKey, KEY_SYMBOLS, type KbdProps } from "./components/Kbd";
export { Divider, dividerVariants, type DividerProps } from "./components/Divider";
export { CodeBlock, type CodeBlockProps } from "./components/CodeBlock";
export { Skeleton, skeletonVariants, type SkeletonProps } from "./components/Skeleton";
export { Label, type LabelProps } from "./components/Label";
export { Checkbox, checkboxVariants, type CheckboxProps } from "./components/Checkbox";
export { RadioGroup, type RadioGroupProps, type RadioGroupItemProps } from "./components/RadioGroup";
export { Switch, switchVariants, type SwitchProps } from "./components/Switch";
export { Textarea, type TextareaProps } from "./components/Textarea";
export { Slider, sliderTrackVariants, sliderThumbVariants, type SliderProps, type SliderMark } from "./components/Slider";
export { Alert, alertVariants, type AlertProps } from "./components/Alert";
export { Progress, progressVariants, type ProgressProps } from "./components/Progress";
export { Spinner, sizeMap as spinnerSizeMap, type SpinnerProps, type SpinnerType, type SpinnerSize } from "./components/Spinner";
export { SpinnerOverlay, type SpinnerOverlayProps } from "./components/SpinnerOverlay";
export { Select, selectTriggerVariants, type SelectProps, type SelectOption } from "./components/Select";
export { Field, type FieldProps, type FieldLabelProps, type FieldDescriptionProps, type FieldErrorProps } from "./components/Field";
export { useFieldContext } from "./components/field-context";
export type { FieldContextValue } from "./components/field-context";
export { Form, type FormProps, type FormFieldProps as FormFieldAdapterProps } from "./components/Form";
/** @deprecated Use Field instead */
export { FormField, useFormField, type FormFieldProps } from "./components/FormField";

// === Cards ===
export { Card, type CardProps } from "./components/Card";
export { FeatureCard, type FeatureCardProps } from "./components/FeatureCard";
export { PricingCard, type PricingCardProps } from "./components/PricingCard";
export { Accordion, type AccordionProps } from "./components/Accordion";
export { Testimonial, type TestimonialProps } from "./components/Testimonial";
export { BlogCard, type BlogCardProps } from "./components/BlogCard";
export { StatCard, type StatCardProps } from "./components/StatCard";

// === Layout ===
export { Navbar, type NavbarProps } from "./components/Navbar";
export { Hero, type HeroProps } from "./components/Hero";
export { Section, type SectionProps } from "./components/Section";
export { Container, type ContainerProps } from "./components/Container";
export { Footer, type FooterProps } from "./components/Footer";
export { Newsletter, type NewsletterProps } from "./components/Newsletter";
export { GradientBackground, type GradientBackgroundProps } from "./components/GradientBackground";
export { SocialCard, type SocialCardProps } from "./components/SocialCard";
export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbsItemProps, type BreadcrumbsSeparatorProps } from "./components/Breadcrumbs";
export { ScrollArea, type ScrollAreaProps } from "./components/ScrollArea";
export { Sidebar, type SidebarProps, type SidebarItemProps, type SidebarGroupProps } from "./components/Sidebar";
export { ResizablePanels, type ResizablePanelsProps, type ResizablePanelProps, type ResizableHandleProps } from "./components/ResizablePanels";

// === Interactive ===
export { Tabs, type TabsProps, type TabPanelProps } from "./components/Tabs";
export { Tooltip, type TooltipProps } from "./components/Tooltip";
export { Avatar, type AvatarProps } from "./components/Avatar";
export { AvatarGroup, type AvatarGroupProps } from "./components/AvatarGroup";
export { CommandPalette, type CommandPaletteProps } from "./components/CommandPalette";
export { ToggleGroup, type ToggleGroupProps } from "./components/ToggleGroup";
export { ChangelogEntry, type ChangelogEntryProps } from "./components/ChangelogEntry";
export { Toast, type ToastProps, type ToastPosition } from "./components/Toast";
export { Toaster, type ToasterProps } from "./components/Toaster";
export { toast, type ToastData, type ToastVariant } from "./components/toast-store";
export { Pagination, paginationButtonVariants, type PaginationProps } from "./components/Pagination";
export { Modal, modalVariants, type ModalProps } from "./components/Modal";
export { FullscreenModal, type FullscreenModalProps } from "./components/FullscreenModal";
/** @deprecated Use DropdownMenu instead */
export { Dropdown, type DropdownProps, type DropdownItemProps, type DropdownMenuPanelProps } from "./components/Dropdown";
export { Popover, type PopoverProps, type PopoverContentProps } from "./components/Popover";
export { Drawer, drawerVariants, type DrawerProps } from "./components/Drawer";
export { Collapsible, type CollapsibleProps, type CollapsibleTriggerProps, type CollapsibleContentProps } from "./components/Collapsible";
export { Stepper, stepCircleVariants, type StepperProps, type StepItem } from "./components/Stepper";
export { CopyButton, copyButtonVariants, type CopyButtonProps } from "./components/CopyButton";
export { DataTable, tableRowVariants, tableCellVariants, type DataTableProps, type DataTableVariant, type DataTableDensity } from "./components/DataTable";
export { Timeline, type TimelineProps, type TimelineItemProps } from "./components/Timeline";
export { FileUpload, fileUploadVariants, type FileUploadProps, type FileUploadFile } from "./components/FileUpload";
export { OTPInput, slotVariants as otpSlotVariants, containerVariants as otpContainerVariants, type OTPInputProps } from "./components/OTPInput";
export { DatePicker, type DatePickerProps } from "./components/DatePicker";
export { DateRangePicker, type DateRangePickerProps, type RangePreset } from "./components/DateRangePicker";
export { TimePicker, type TimePickerProps, type TimeValue } from "./components/TimePicker";
export { DropdownMenu, type DropdownMenuProps, type DropdownMenuItemProps, type DropdownMenuCheckboxItemProps } from "./components/DropdownMenu";
export { ContextMenu, type ContextMenuProps, type ContextMenuItemProps } from "./components/ContextMenu";
export { VirtualList, type VirtualListProps } from "./components/VirtualList";
export {
  RichTextEditor,
  useRichTextEditor,
  createDefaultExtensions,
  richTextEditorVariants,
  type RichTextEditorProps,
  type RichTextEditorToolbarProps,
  type RichTextEditorContentProps,
  type RichTextEditorBubbleMenuProps,
  type ToolbarGroup,
  type ToolbarConfig,
  type CustomToolbarItem,
  type DefaultExtensionName,
  type ExtensionConfig,
} from "./components/RichTextEditor";

// === Charts ===
export { LineChart, type LineChartProps, type LineChartLine } from "./components/LineChart";
export { BarChart, type BarChartProps, type BarChartBar } from "./components/BarChart";
export { AreaChart, type AreaChartProps, type AreaChartArea } from "./components/AreaChart";
export { PieChart, type PieChartProps, type PieChartDataItem } from "./components/PieChart";
export { RadarChart, type RadarChartProps, type RadarChartRadar } from "./components/RadarChart";

// === Animation ===
export {
  // Tokens
  duration,
  easing,
  spring,
  distance,
  type Duration,
  type Easing,
  type Spring,
  type Distance,
  // Presets
  presets,
  type PresetName,
  type AnimationPreset,
  // Hook
  useReducedMotion,
  // Provider
  AnimationProvider,
  useAnimationConfig,
  type AnimationConfig,
  type AnimationContextValue,
  type AnimationProviderProps,
} from "./animation";
export {
  Animate,
  Fade,
  Slide,
  Scale,
  ScaleFade,
  Collapse,
  Pop,
  type AnimateProps,
  type FadeProps,
  type SlideProps,
  type ScaleProps,
  type ScaleFadeProps,
  type CollapseProps,
  type PopProps,
} from "./components/Animate";
export { StaggerGroup, type StaggerGroupProps } from "./components/StaggerGroup";

// === Blocks: Marketing ===
export { CTASection, ctaSectionVariants, type CTASectionProps } from "./components/CTASection";
export { FAQSection, type FAQSectionProps, type FAQItem } from "./components/FAQSection";
export { LogoCloud, logoCloudVariants, type LogoCloudProps, type LogoItem } from "./components/LogoCloud";
export { StatsSection, statsSectionVariants, type StatsSectionProps, type StatItem } from "./components/StatsSection";
export { FeatureSection, type FeatureSectionProps, type FeatureSectionFeature } from "./components/FeatureSection";
export { TestimonialSection, type TestimonialSectionProps, type TestimonialSectionItem } from "./components/TestimonialSection";
export { PricingSection, type PricingSectionProps, type PricingSectionPlan } from "./components/PricingSection";
export { BlogSection, type BlogSectionProps, type BlogSectionPost } from "./components/BlogSection";
export { TeamSection, type TeamSectionProps, type TeamMember } from "./components/TeamSection";
export { ContactSection, type ContactSectionProps, type ContactInfo, type ContactFormData } from "./components/ContactSection";
export { AnnouncementBar, announcementBarVariants, type AnnouncementBarProps } from "./components/AnnouncementBar";
export { IntegrationsSection, type IntegrationsSectionProps, type Integration } from "./components/IntegrationsSection";
export { BentoGrid, BentoGridItem, type BentoGridProps, type BentoGridItemProps } from "./components/BentoGrid";
export { ComparisonTable, type ComparisonTableProps, type ComparisonPlan, type ComparisonFeature } from "./components/ComparisonTable";
export { LogoCloud as TrustBar } from "./components/LogoCloud";

// === Blocks: Auth ===
export { LoginForm, type LoginFormProps, type LoginFormSocialProvider } from "./components/LoginForm";
export { SignupForm, type SignupFormProps, type SignupFormSocialProvider } from "./components/SignupForm";
export { ForgotPasswordForm, type ForgotPasswordFormProps } from "./components/ForgotPasswordForm";

// === Blocks: Feedback ===
export { ErrorPage, type ErrorPageProps, type ErrorCode } from "./components/ErrorPage";
export { EmptyState, emptyStateVariants, type EmptyStateProps } from "./components/EmptyState";

// === Blocks: Application ===
export { DashboardLayout, type DashboardLayoutProps, type DashboardSidebarProps, type DashboardHeaderProps, type DashboardContentProps } from "./components/DashboardLayout";
export { SettingsPage, type SettingsPageProps, type SettingsSectionProps, type SettingsSectionItem } from "./components/SettingsPage";
export { ProfileSection, type ProfileSectionProps, type ProfileStat } from "./components/ProfileSection";
export { OnboardingWizard, type OnboardingWizardProps, type OnboardingStep } from "./components/OnboardingWizard";
export { ChatInterface, type ChatInterfaceProps, type ChatMessage } from "./components/ChatInterface";
export { NotificationPanel, type NotificationPanelProps, type NotificationItem } from "./components/NotificationPanel";
export { KanbanBoard, type KanbanBoardProps, type KanbanColumn, type KanbanCard } from "./components/KanbanBoard";
export { CalendarView, type CalendarViewProps, type CalendarEvent } from "./components/CalendarView";
export { FileManager, type FileManagerProps, type FileItem, type FileManagerBreadcrumb } from "./components/FileManager";

// === Blocks: Ecommerce ===
export { ProductCard, type ProductCardProps } from "./components/ProductCard";
export { ProductGrid, type ProductGridProps } from "./components/ProductGrid";
export { ShoppingCart, type ShoppingCartProps, type ShoppingCartItem } from "./components/ShoppingCart";
export { CheckoutForm, type CheckoutFormProps, type CheckoutFormData, type CheckoutShippingData, type CheckoutPaymentData } from "./components/CheckoutForm";
export { OrderSummary, type OrderSummaryProps, type OrderSummaryItem, type OrderSummaryAddress, type OrderStatus } from "./components/OrderSummary";
export { CreditCardInput, type CreditCardInputProps, type CreditCardData, type CreditCardErrors, type CardType } from "./components/CreditCardInput";
