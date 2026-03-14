# PricingCard

A pricing tier card with tier name, price, feature list, and a call-to-action button. Supports a highlighted state for the recommended tier.

## Import

```tsx
import { PricingCard } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tier` | `string` | **(required)** | Tier name (e.g. `"Free"`, `"Pro"`, `"Enterprise"`). |
| `price` | `string` | **(required)** | Price display string (e.g. `"$0"`, `"$19"`, `"Custom"`). |
| `period` | `string` | **(required)** | Billing period label (e.g. `"month"`, `"year"`). |
| `description` | `string` | **(required)** | Short description of the tier. |
| `features` | `string[]` | **(required)** | Array of feature descriptions shown as a checklist. |
| `cta` | `string` | **(required)** | Call-to-action button label. |
| `highlighted` | `boolean` | `false` | Applies elevated styling (brighter border, shadow, filled CTA button). |
| `badge` | `string` | -- | Badge text displayed next to the tier name (e.g. `"Popular"`, `"Best Value"`). |
| `annualPrice` | `string` | -- | Struck-through annual price shown below the main price. |
| `onCtaClick` | `() => void` | -- | Callback when the CTA button is clicked. |
| `className` | `string` | -- | Additional CSS classes. |

## Usage

### Basic Pricing Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <PricingCard
    tier="Free"
    price="$0"
    period="month"
    description="For individuals getting started."
    features={[
      "5 projects",
      "Basic analytics",
      "Community support",
    ]}
    cta="Get Started"
  />
  <PricingCard
    tier="Pro"
    price="$19"
    period="month"
    description="For professionals and small teams."
    features={[
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Custom domains",
    ]}
    cta="Upgrade to Pro"
    highlighted
    badge="Popular"
  />
  <PricingCard
    tier="Enterprise"
    price="Custom"
    period="year"
    description="For large organizations."
    features={[
      "Everything in Pro",
      "SSO & SAML",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
    ]}
    cta="Contact Sales"
  />
</div>
```

### With Annual Price

```tsx
<PricingCard
  tier="Pro"
  price="$15"
  period="month"
  annualPrice="$19/month billed monthly"
  description="Save 20% with annual billing."
  features={["Unlimited projects", "Priority support"]}
  cta="Start Free Trial"
  highlighted
/>
```

### With Click Handler

```tsx
<PricingCard
  tier="Pro"
  price="$19"
  period="month"
  description="Best for professionals."
  features={["All features"]}
  cta="Subscribe"
  onCtaClick={() => handleSubscription("pro")}
/>
```

## Notes

- The highlighted card has a brighter border (`border-white/15`), elevated shadow (`.shadow-card-elevated`), and a filled primary CTA button.
- Non-highlighted cards have an outline-style CTA button (`border border-white/10`).
- Features are rendered as a checklist with green `Check` icons from Lucide React.
- The card uses a flex column layout so the feature list expands to fill available space, keeping the CTA at the bottom.
- Supports `forwardRef` for ref forwarding.
