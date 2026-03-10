# Eclipse Design System

Eclipse is Prisma's comprehensive design system built with Tailwind CSS and design tokens from Figma.

## Documentation

For complete documentation, examples, and interactive demos, visit:

**[Eclipse Design System Documentation](https://prisma.io/docs/design-system)**

## Quick Start

```bash
pnpm add @prisma/eclipse
```

```tsx
import { Button } from "@prisma/eclipse";
import "@prisma/eclipse/styles/globals.css";

export function App() {
  return <Button variant="ppg">Click me</Button>;
}
```

## What's Included

- 🎨 **Design Tokens** - Colors, typography, spacing, and more from Figma
- 🧩 **Components** - Pre-built, accessible React components
- 🌗 **Dark Mode** - Full light/dark theme support
- 🎯 **Tailwind CSS** - Utility-first styling
- 📦 **TypeScript** - Full type safety

## Project Structure

```
eclipse/
├── src/
│   ├── components/       # React components
│   ├── lib/             # Utilities (cn, etc.)
│   ├── styles/          # Global CSS
│   ├── tokens/          # Design tokens
│   └── index.ts         # Main entry
├── .templates/          # Component templates
├── ARCHITECTURE.md      # Architecture overview
├── GETTING_STARTED.md   # Setup guide
├── TOKENS.md           # Token documentation
└── TROUBLESHOOTING.md  # Common issues
```

## Development

For maintainers working on Eclipse itself:

- See [GETTING_STARTED.md](./GETTING_STARTED.md) for setup
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
- See [TOKENS.md](./TOKENS.md) for token management
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues

## Contributing

When adding new components or tokens, please refer to the documentation files above and ensure changes are reflected in the main documentation site.

## Support

For questions or issues, please reach out to the Prisma design team or open an issue on GitHub.
