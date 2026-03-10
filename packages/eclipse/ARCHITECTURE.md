# Eclipse Design System - Architecture

This document explains the structure of the Eclipse Design System and why each file/folder is necessary.

## Project Structure

```
apps/eclipse/
├── src/                          # Main design system package
│   ├── components/               # React components
│   │   ├── Button.tsx           # Button component with variants
│   │   └── index.ts             # Component exports
│   ├── lib/                      # Utilities
│   │   └── cn.ts                # Class name utility (clsx + tailwind-merge)
│   ├── styles/                   # CSS styles
│   │   └── globals.css          # ✅ ESSENTIAL: Tailwind + color system
│   ├── tokens/                   # Design tokens
│   │   └── index.ts             # ✅ ESSENTIAL: Design token definitions
│   ├── examples/                 # Example components (if needed)
│   └── index.ts                  # Main package entry point
├── dev/                          # Development showcase
│   ├── src/
│   │   ├── Showcase.tsx         # Demo of all components
│   │   ├── main.tsx             # Vite entry point
│   │   └── styles/
│   │       └── globals.css      # Imports from ../../../src/styles/
│   ├── index.html
│   ├── package.json             # Depends on @prisma/eclipse
│   ├── tailwind.config.ts       # Extends main config
│   └── vite.config.ts
├── package.json                  # Package configuration
├── tailwind.config.ts           # ✅ ESSENTIAL: Tailwind configuration
├── postcss.config.mjs           # ✅ ESSENTIAL: PostCSS with Tailwind v4
└── tsconfig.json
```

## Essential Files

### 1. `/src/styles/globals.css` ✅ **REQUIRED**

**Purpose**: Initializes Tailwind CSS and defines the color system.

**What it does**:
- Imports Tailwind CSS v4 with `@import "tailwindcss"`
- Defines all color tokens as CSS custom properties in `@theme` block
- Provides dark mode color overrides in `.dark` selector
- Contains custom utility classes (gradients)

**Why it's needed**:
- Colors MUST be CSS variables to support dynamic dark mode switching
- Tailwind v4 requires this structure to generate styles
- Custom properties allow runtime theme changes

**Key sections**:
```css
@import "tailwindcss";

@theme {
  /* Light mode colors as CSS custom properties */
  --color-background-default: #ffffff;
  --color-foreground-neutral: #151923;
  /* ... all color tokens */
}

.dark {
  /* Dark mode color overrides */
  --color-background-default: #0a0e14;
  /* ... all dark mode tokens */
}
```

### 2. `/src/tokens/index.ts` ✅ **REQUIRED**

**Purpose**: Defines non-color design tokens in TypeScript.

**What it contains**:
- Border radius values
- Blur effects
- Margin/padding scales
- Size scales
- Typography (font families, sizes, weights, line heights)

**Why it's needed**:
- Provides type-safe access to design tokens
- Single source of truth for spacing, typography, etc.
- Used by `tailwind.config.ts` to dynamically generate Tailwind utilities
- Can be imported by React components for programmatic access

**Example usage in Tailwind config**:
```ts
import { tokens } from "./src/tokens";

borderRadius: {
  circle: `${tokens.borderRadius.circle}px`,
  square: `${tokens.borderRadius.square}px`,
}
```

### 3. `/tailwind.config.ts` ✅ **REQUIRED**

**Purpose**: Configures Tailwind CSS with Eclipse design tokens.

**What it does**:
- Maps CSS custom properties to Tailwind color utilities
  - `bg-background-default` → `var(--color-background-default)`
- Generates spacing utilities from token values
- Configures typography scales
- Sets up dark mode as `class`-based

**Why it's needed**:
- Bridges design tokens and Tailwind utility classes
- Enables writing `className="bg-background-ppg"` instead of CSS
- Provides autocomplete/IntelliSense for design system colors

### 4. `/postcss.config.mjs` ✅ **REQUIRED**

**Purpose**: Configures PostCSS to process CSS with Tailwind v4.

**Content**:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**Why it's needed**:
- Tailwind CSS v4 requires the `@tailwindcss/postcss` plugin
- Processes `@import "tailwindcss"` and `@theme` directives
- Without this, CSS won't be processed and colors won't work

## Optional but Recommended Files

### `/src/lib/cn.ts`
**Purpose**: Utility for merging class names with Tailwind class deduplication.

**Usage**:
```tsx
import { cn } from "@prisma/eclipse/lib/cn";

<button className={cn("bg-background-default", isDark && "bg-background-neutral")} />
```

### `/src/components/`
**Purpose**: Reusable React components built with the design system.

**Note**: These are the actual design system components that consumers will use.

## What's NOT Needed

### ❌ Duplicate token definitions
- Don't define colors in both CSS and TypeScript
- Colors live in `globals.css` as CSS variables
- Other tokens live in `tokens/index.ts` as TypeScript

### ❌ Separate theme files
- All theming is handled in `globals.css` with `.dark` selector
- No need for `light.css` and `dark.css` files

### ❌ Build step for tokens
- Tokens are imported directly as TypeScript
- No need to compile or transform them

## How It All Works Together

1. **Developer writes component**:
   ```tsx
   <Button className="bg-background-ppg text-foreground-ppg">
     Click me
   </Button>
   ```

2. **Tailwind config maps to CSS variables**:
   ```ts
   // tailwind.config.ts
   background: {
     ppg: "var(--color-background-ppg)"
   }
   ```

3. **CSS defines the actual color**:
   ```css
   /* globals.css */
   @theme {
     --color-background-ppg: #e8fcf9;
   }
   
   .dark {
     --color-background-ppg: #0a4943;
   }
   ```

4. **Dark mode toggle changes the class**:
   ```tsx
   document.documentElement.classList.toggle('dark');
   // This changes ALL color variables at once!
   ```

## Using Eclipse in Your App

### Minimal Setup

1. **Install the package**:
   ```bash
   pnpm add @prisma/eclipse
   ```

2. **Import the CSS** (in your root component):
   ```tsx
   import "@prisma/eclipse/styles/globals.css";
   ```

3. **Extend Tailwind config**:
   ```ts
   import eclipseConfig from "@prisma/eclipse/tailwind.config";
   
   export default {
     presets: [eclipseConfig],
     content: ["./src/**/*.{ts,tsx}"],
   };
   ```

4. **Use the components**:
   ```tsx
   import { Button } from "@prisma/eclipse";
   ```

That's it! No build steps, no complex configuration.

## Development Workflow

The `/dev` folder is a clean showcase that:
- ✅ Imports from `@prisma/eclipse` (no duplication)
- ✅ Extends the main Tailwind config
- ✅ Provides live preview of all components

When you make changes to `/src`, the `/dev` showcase automatically reflects them.

## Summary

**Must have**:
- ✅ `/src/styles/globals.css` - Color system + Tailwind init
- ✅ `/src/tokens/index.ts` - Design token definitions
- ✅ `/tailwind.config.ts` - Tailwind configuration
- ✅ `/postcss.config.mjs` - PostCSS with Tailwind v4

**Optional**:
- `/src/components/` - Your design system components
- `/src/lib/` - Utility functions
- `/dev/` - Development showcase

**Don't need**:
- ❌ Separate light/dark CSS files
- ❌ Build scripts for tokens
- ❌ Duplicate configurations
- ❌ CSS-in-JS or styled-components

Keep it simple, keep it clean! 🎨
