# Eclipse Design System Tokens

This document provides a comprehensive reference for all design tokens in the Eclipse Design System, imported from Figma.

## Table of Contents

- [Color Tokens](#color-tokens)
- [Spacing Tokens](#spacing-tokens)
- [Typography Tokens](#typography-tokens)
- [Border Radius Tokens](#border-radius-tokens)
- [Blur Tokens](#blur-tokens)
- [Usage Examples](#usage-examples)

---

## Color Tokens

### Background Colors

Background colors are used for surfaces, containers, and backgrounds throughout the design system.

#### Neutral

- `background-default` - Primary background color
- `background-default-050` - 50% opacity version
- `background-default-075` - 75% opacity version
- `background-neutral-strong` - Strong neutral background
- `background-neutral` - Default neutral background
- `background-neutral-weak` - Weak neutral background
- `background-neutral-weaker` - Weaker neutral background
- `background-neutral-reverse-strong` - Strong reverse (inverted) background
- `background-neutral-reverse` - Reverse (inverted) background

#### Product: Prisma Pulse & Accelerate (PPG)

- `background-ppg-strong` - Strong PPG background
- `background-ppg` - Default PPG background
- `background-ppg-reverse-strong` - Strong reverse PPG background
- `background-ppg-reverse` - Reverse PPG background

#### Product: Prisma ORM (ORM)

- `background-orm-strong` - Strong ORM background
- `background-orm` - Default ORM background
- `background-orm-reverse-strong` - Strong reverse ORM background
- `background-orm-reverse` - Reverse ORM background

#### Semantic: Status Colors

**Error**
- `background-error-strong` - Strong error background
- `background-error` - Default error background
- `background-error-reverse-strong` - Strong reverse error background
- `background-error-reverse` - Reverse error background

**Success**
- `background-success-strong` - Strong success background
- `background-success` - Default success background
- `background-success-reverse-strong` - Strong reverse success background
- `background-success-reverse` - Reverse success background

**Warning**
- `background-warning-strong` - Strong warning background
- `background-warning` - Default warning background
- `background-warning-reverse-strong` - Strong reverse warning background
- `background-warning-reverse` - Reverse warning background

#### Additional Color Backgrounds

Each of these follows the same pattern (`strong` and default variants):
- Cyan: `background-cyan-strong`, `background-cyan`
- Fuchsia: `background-fuchsia-strong`, `background-fuchsia`
- Lime: `background-lime-strong`, `background-lime`
- Pink: `background-pink-strong`, `background-pink`
- Purple: `background-purple-strong`, `background-purple`
- Sky: `background-sky-strong`, `background-sky`
- Violet: `background-violet-strong`, `background-violet`
- Yellow: `background-yellow-strong`, `background-yellow`

### Foreground Colors

Foreground colors are used for text, icons, and other foreground elements.

Each color has multiple strength variants:
- `strong` - Highest contrast
- Default (no suffix) - Standard contrast
- `weak` - Lower contrast
- `reverse` - For use on colored backgrounds
- `reverse-weak` - Lower contrast on colored backgrounds

**Available foreground colors:**
- `foreground-neutral-*`
- `foreground-ppg-*`
- `foreground-orm-*`
- `foreground-error-*`
- `foreground-success-*`
- `foreground-warning-*`
- `foreground-cyan-*`
- `foreground-fuchsia-*`
- `foreground-lime-*`
- `foreground-pink-*`
- `foreground-purple-*`
- `foreground-sky-*`
- `foreground-violet-*`
- `foreground-yellow-*`

### Stroke Colors

Stroke colors are used for borders, dividers, and outlines.

- `stroke-neutral-stronger`
- `stroke-neutral-strong`
- `stroke-neutral`
- `stroke-neutral-weak`
- `stroke-ppg`
- `stroke-orm`
- `stroke-error`
- `stroke-success`
- `stroke-warning`
- `stroke-cyan`
- `stroke-fuchsia`
- `stroke-lime`
- `stroke-pink`
- `stroke-purple`
- `stroke-sky`
- `stroke-violet`
- `stroke-yellow`

### Gradient Colors

Pre-defined multi-stop gradients:

- `bg-gradient-orm` - ORM branded gradient
- `bg-gradient-ppg` - PPG branded gradient

---

## Spacing Tokens

### Margin

Margin tokens for consistent spacing between elements:

- `margin-4xs` - 4px
- `margin-3xs` - 8px
- `margin-2xs` - 12px
- `margin-xs` - 16px
- `margin-sm` - 20px
- `margin-md` - 24px
- `margin-lg` - 28px
- `margin-xl` - 32px
- `margin-4xl` - 48px

### Size

Element sizing tokens:

- `size-element-2xs` - 12px
- `size-element-xs` - 16px
- `size-element-sm` - 20px
- `size-element-md` - 24px
- `size-element-lg` - 28px
- `size-element-xl` - 32px
- `size-element-2xl` - 36px
- `size-element-3xl` - 40px
- `size-element-4xl` - 48px
- `size-element-5xl` - 64px
- `size-element-6xl` - 96px

---

## Typography Tokens

### Font Families

- `font-sans-display` - Mona Sans (for display text)
- `font-sans` - Inter (body text)
- `font-mono` - Mona Sans Mono (code)

### Font Sizes

All font sizes include corresponding line heights:

- `text-2xs` - 11px / 16px line height
- `text-xs` - 12px / 16px line height
- `text-sm` - 14px / 20px line height
- `text-md` - 16px / 24px line height
- `text-lg` - 18px / 28px line height
- `text-xl` - 20px / 28px line height
- `text-2xl` - 24px / 32px line height
- `text-3xl` - 30px / 36px line height

### Font Weights

- `font-normal` - 400 (light mode) / 375 (dark mode)
- `font-medium` - 500 (light mode) / 475 (dark mode)
- `font-semibold` - 600 (light mode) / 575 (dark mode)
- `font-bold` - 750 (light mode) / 725 (dark mode)
- `font-ultra-bold` - 900 (light mode) / 850 (dark mode)

> **Note:** Font weights are automatically adjusted in dark mode for better readability.

---

## Border Radius Tokens

- `rounded-circle` - 999px (fully rounded)
- `rounded-square-low` - 3px
- `rounded-square` - 6px
- `rounded-square-high` - 12px

---

## Blur Tokens

- `blur-surface-low` - 16px
- `blur-surface` - 24px
- `blur-surface-high` - 40px

---

## Usage Examples

### Using Colors in Components

```tsx
// Background and foreground
<div className="bg-background-neutral text-foreground-neutral">
  Content
</div>

// Product-specific colors
<Button className="bg-background-ppg-reverse text-foreground-ppg-reverse">
  Prisma Pulse
</Button>

// Semantic colors
<div className="bg-background-error text-foreground-error">
  Error message
</div>
```

### Using Spacing

```tsx
// Margin
<div className="m-margin-md">Spaced content</div>

// Sizes
<div className="w-size-xl h-size-xl">
  Square element
</div>
```

### Using Typography

```tsx
// Font families
<h1 className="font-sans-display text-3xl font-bold">
  Display Heading
</h1>

<p className="font-sans text-md">
  Body text
</p>

<code className="font-mono text-sm">
  const code = true;
</code>
```

### Using Border Radius

```tsx
<div className="rounded-square-high p-4 bg-background-neutral">
  Card with rounded corners
</div>

<button className="rounded-circle p-4">
  Circular button
</button>
```

### Dark Mode

All color tokens automatically adjust for dark mode:

```tsx
<div className="dark">
  {/* All colors will use their dark mode values */}
  <div className="bg-background-default text-foreground-neutral">
    Dark mode content
  </div>
</div>
```

### Gradients

```tsx
<div className="bg-gradient-orm text-foreground-orm-reverse">
  ORM branded gradient
</div>

<div className="bg-gradient-ppg text-foreground-ppg-reverse">
  PPG branded gradient
</div>
```

---

## Token Organization

All tokens are defined in:
- **TypeScript constants**: `src/tokens/index.ts`
- **Tailwind configuration**: `tailwind.config.ts`
- **CSS custom properties**: `src/styles/globals.css`

This three-layer approach ensures:
1. Type safety in TypeScript
2. Tailwind utility class generation
3. Runtime theme switching via CSS variables

---

## Contributing

When adding new tokens:

1. Update `src/tokens/index.ts` with the new token values
2. Add corresponding entries in `tailwind.config.ts`
3. If it's a color token, add CSS custom properties in `src/styles/globals.css`
4. Update this documentation
5. Run `pnpm types:check` to ensure no type errors
