# Getting Started with Eclipse Design System

Welcome to the Eclipse Design System! This guide will help you get up and running quickly.

## What's Included

Eclipse is a comprehensive design system that includes:

- ✅ **Design Tokens** - Imported from Figma with full light/dark mode support
- ✅ **Color System** - Semantic colors for backgrounds, foregrounds, and strokes
- ✅ **Typography Scale** - Font families, sizes, weights, and line heights
- ✅ **Spacing System** - Consistent margin, padding, and sizing tokens
- ✅ **Components** - Pre-built React components with TypeScript support
- ✅ **Tailwind Integration** - All tokens available as Tailwind utilities

## Quick Start

### 1. Installation

Since Eclipse is part of the monorepo, add it to your project's dependencies:

```json
{
  "dependencies": {
    "@prisma/eclipse": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

### 2. Import Styles

Import the global styles in your app's entry point:

```tsx
import "@prisma/eclipse/styles/globals.css";
```

### 3. Configure Tailwind (Optional)

To use Eclipse tokens in your Tailwind config:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import eclipseConfig from "@prisma/eclipse/tailwind.config";

const config: Config = {
  presets: [eclipseConfig],
  content: [
    "./src/**/*.{ts,tsx}",
    // Include Eclipse components
    "../../apps/eclipse/src/**/*.{ts,tsx}",
  ],
};

export default config;
```

### 4. Use Components

Import and use Eclipse components:

```tsx
import { Button } from "@prisma/eclipse";

export function MyComponent() {
  return (
    <div>
      <Button variant="ppg" size="lg">
        Get Started with Prisma Pulse
      </Button>
    </div>
  );
}
```

## Using Design Tokens

### Colors

Eclipse provides semantic color tokens that work in both light and dark modes:

```tsx
// Backgrounds
<div className="bg-background-neutral">Neutral background</div>
<div className="bg-background-ppg">PPG branded background</div>
<div className="bg-background-orm">ORM branded background</div>

// Foreground (text/icons)
<span className="text-foreground-neutral">Default text</span>
<span className="text-foreground-error">Error text</span>
<span className="text-foreground-success">Success text</span>

// Strokes (borders)
<div className="border border-stroke-neutral">Bordered element</div>
```

### Spacing

Use consistent spacing throughout your app:

```tsx
// Margin
<div className="m-margin-md">Content with margin</div>

// Padding
<div className="p-padding-block-container">
  Container with padding
</div>

// Element sizes
<div className="w-size-xl h-size-xl">Square element (32x32)</div>
```

### Typography

```tsx
// Font families
<h1 className="font-sans-display text-3xl font-bold">
  Display Heading
</h1>

<p className="font-sans text-md">
  Body text using Inter
</p>

<code className="font-mono text-sm">
  const code = true;
</code>

// Font sizes (with corresponding line heights)
<p className="text-sm">Small text (14px/20px)</p>
<p className="text-md">Medium text (16px/24px)</p>
<p className="text-lg">Large text (18px/28px)</p>
```

### Border Radius

```tsx
<div className="rounded-low">Low radius (3px)</div>
<div className="rounded-square">Default radius (6px)</div>
<div className="rounded-high">High radius (12px)</div>
<div className="rounded-circle">Circular (999px)</div>
```

## Dark Mode

Eclipse fully supports dark mode. Simply add the `dark` class to enable it:

```tsx
export function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="bg-background-default text-foreground-neutral">
        {/* All colors automatically adjust for dark mode */}
        <button onClick={() => setIsDark(!isDark)}>
          Toggle Dark Mode
        </button>
      </div>
    </div>
  );
}
```

## Component Examples

### Button Variants

```tsx
import { Button } from "@prisma/eclipse";

<Button variant="default">Default</Button>
<Button variant="ppg">Prisma Pulse & Accelerate</Button>
<Button variant="orm">Prisma ORM</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Button</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🚀</Button>
```

### Semantic Patterns

```tsx
// Error message
<div className="p-padding-block-container bg-background-error rounded-high border border-stroke-error">
  <p className="text-foreground-error">
    An error occurred
  </p>
</div>

// Success message
<div className="p-padding-block-container bg-background-success rounded-high border border-stroke-success">
  <p className="text-foreground-success">
    Operation successful!
  </p>
</div>

// Warning message
<div className="p-padding-block-container bg-background-warning rounded-high border border-stroke-warning">
  <p className="text-foreground-warning">
    Please review this carefully
  </p>
</div>
```

### Gradients

```tsx
<div className="bg-gradient-orm text-foreground-orm-reverse p-8 rounded-high">
  ORM Branded Section
</div>

<div className="bg-gradient-ppg text-foreground-ppg-reverse p-8 rounded-high">
  PPG Branded Section
</div>
```

## Creating Custom Components

Use the `cn` utility for className merging and CVA for variants:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@prisma/eclipse/lib/cn";

const cardVariants = cva(
  "rounded-high border",
  {
    variants: {
      variant: {
        default: "bg-background-default border-stroke-neutral",
        elevated: "bg-background-default border-stroke-neutral shadow-lg",
      },
      padding: {
        sm: "p-padding-block-container-tight",
        md: "p-padding-block-container",
        lg: "p-padding-block-container-loose",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
```

## Using TypeScript Tokens

Access tokens directly in TypeScript:

```tsx
import { tokens } from "@prisma/eclipse/tokens";

// Use in JavaScript/TypeScript logic
const buttonHeight = tokens.size.element.lg; // 28
const primaryColor = tokens.colors.background.ppg; // "hsl(180 93% 95%)"
const fontFamily = tokens.typography.fontFamily.sans; // "Inter"
```

## Next Steps

- 📖 Read the full [Token Reference](./TOKENS.md) for all available tokens
- 🎨 Explore the [example showcase](./src/examples/showcase.tsx) for more patterns
- 🧩 Check out the [component template](../.templates/Component.tsx.template) for creating new components
- 📚 Review the [README](./README.md) for project structure and architecture

## Common Patterns

### Responsive Design

```tsx
<div className="p-padding-block-container-tight md:p-padding-block-container lg:p-padding-block-container-loose">
  Responsive padding
</div>
```

### Hover States

```tsx
<button className="bg-background-neutral hover:bg-background-neutral-strong transition-colors">
  Hover me
</button>
```

### Focus States

```tsx
<button className="focus:ring-2 focus:ring-stroke-ppg focus:outline-none">
  Accessible button
</button>
```

### Combining Tokens

```tsx
<div className="
  bg-background-default
  text-foreground-neutral
  p-padding-block-container
  rounded-high
  border border-stroke-neutral
  shadow-lg
">
  Well-styled component
</div>
```

## Tips & Best Practices

1. **Use Semantic Colors**: Prefer semantic tokens (`background-neutral`, `foreground-error`) over raw color values
2. **Consistent Spacing**: Always use spacing tokens instead of arbitrary values
3. **Dark Mode First**: Test your components in both light and dark modes
4. **TypeScript**: Leverage TypeScript for better autocomplete and type safety
5. **Composition**: Build complex components by composing simpler ones

## Need Help?

- Check the [TOKENS.md](./TOKENS.md) for the complete token reference
- Review [examples/showcase.tsx](./src/examples/showcase.tsx) for usage patterns
- Look at existing components in `src/components/` for inspiration

Happy building! 🚀
