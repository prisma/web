# Theme Provider Usage

This package includes a custom React-based theme provider that works independently of Next.js.

## Setup

### 1. Wrap your app with the ThemeProvider

```tsx
import { ThemeProvider } from '@prisma-docs/ui/components/theme-provider';

function App() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="app-theme"
      attribute="data-theme"
    >
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 2. Use the ThemeToggle component

```tsx
import { ThemeToggle } from '@prisma-docs/ui/components/theme-toggle';

function Header() {
  return (
    <header>
      <ThemeToggle mode="light-dark" />
      {/* or */}
      <ThemeToggle mode="light-dark-system" />
    </header>
  );
}
```

### 3. Access theme in any component

```tsx
import { useTheme } from '@prisma-docs/ui/components/theme-provider';

function MyComponent() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

## ThemeProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Your app content |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Default theme on first load |
| `storageKey` | `string` | `'theme'` | localStorage key for persisting theme |
| `attribute` | `string` | `'data-theme'` | HTML attribute to set on document root |

## ThemeToggle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'light-dark' \| 'light-dark-system'` | `'light-dark'` | Toggle mode |
| `className` | `string` | - | Additional CSS classes |

### Modes

- **`light-dark`**: Simple toggle between light and dark (2 icons)
- **`light-dark-system`**: Toggle between light, dark, and system (3 icons)

## How it works

1. **Persistence**: Theme choice is saved to localStorage
2. **System preference**: Automatically detects system dark mode preference
3. **Attribute setting**: Sets `data-theme` attribute on `<html>` element
4. **Dark class**: Adds/removes `dark` class for Tailwind dark mode
5. **Reactive**: Listens to system theme changes when theme is set to 'system'

## Tailwind Configuration

Make sure your Tailwind config uses the `class` or `selector` strategy:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'selector'
  // ... rest of config
}
```

Or use the attribute selector:

```js
// tailwind.config.js
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  // ... rest of config
}
```

## CSS Variables

You can define theme-specific CSS variables:

```css
:root {
  --background: white;
  --foreground: black;
}

[data-theme="dark"],
.dark {
  --background: black;
  --foreground: white;
}
```
