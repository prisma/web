# Prisma With Layout

Reusable components and layout for "Prisma with X" technology pages.

## Overview

This layout provides a consistent structure for pages showcasing Prisma integration with different technologies (Next.js, Remix, Nuxt, etc.). All components are framework-agnostic and data-driven.

## File Structure

```
prisma-with/
├── layout.tsx              # Main layout component
├── hero.tsx                # Hero section with tech logos
├── why-section.tsx         # "Why Prisma + Tech?" card grid
├── how-section.tsx         # "How they fit together" with tabs & code
├── resources-section.tsx   # Blog posts/resources cards
├── quote-section.tsx       # Customer testimonial
├── community-section.tsx   # Community examples
├── index.ts               # Barrel exports
└── README.md              # This file
```

## Usage

### 1. Create a JSON data file

Create a JSON file in `src/data/prisma-with/[tech-name].json` following the structure:

```json
{
  "hero": {
    "tech": "Next.js",
    "eyebrow": "Prisma in your stack",
    "icon": "fa-solid fa-layer-group",
    "imageUrl": "/icons/technologies/nextjs.svg",
    "imageUrlLight": "/icons/technologies/nextjs-light.svg",
    "title": "The easiest way to use Prisma in Next.js",
    "description": "...",
    "btns": [
      { "label": "Try it", "icon": "fa-regular fa-arrow-right", "url": "#" },
      { "label": "Read docs", "icon": "fa-regular fa-book-open", "url": "#" }
    ]
  },
  "why": {
    "title": "Why Prisma and Next.js?",
    "cards": [
      { "icon": "fa-regular fa-bolt", "title": "Fast", "description": "..." }
    ]
  },
  "how": {
    "title": "How they fit together",
    "description": "...",
    "tabs": {
      "defaultValue": "static-data",
      "head": [{ "title": "Static Data", "value": "static-data" }],
      "body": [{ "value": "static-data", "content": "<h4>Title</h4><p>...</p>" }]
    }
  },
  "why_prisma": {
    "title": "Resources",
    "cards": [
      {
        "image": "/images/blog/post.jpg",
        "url": "/blog/post",
        "badge": "Tutorial",
        "date": "Oct 22, 2025",
        "title": "How to...",
        "description": "...",
        "author": { "name": "John Doe", "avatar": "/images/authors/john.jpg" }
      }
    ]
  },
  "quote": {
    "text": "Quote text",
    "author": {
      "name": "Jane Doe",
      "imageUrl": "/photos/jane.jpg",
      "title": "CEO",
      "company": "Company"
    }
  },
  "community": {
    "title": "Community Examples",
    "cards": [
      {
        "icon": "fa-regular fa-file-lines",
        "title": "...",
        "description": "...",
        "btn": { "label": "Read more", "url": "#" }
      }
    ]
  }
}
```

### 2. Create code examples

In your page file, define code examples that match the tab values:

```tsx
const codeExamples: Record<string, string> = {
  "static-data": `// Your code example here
export default function Page() {
  return <div>Hello World</div>
}`,
  "dynamic-data": `// Another example...`,
};
```

### 3. Create the page

```tsx
import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/nextjs.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  // Your code examples
};

export const metadata: Metadata = {
  title: "Your Page Title",
  description: "Your description",
  alternates: {
    canonical: "https://www.prisma.io/nextjs",
  },
};

export default async function NextJsPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
```

## Component Details

### `PrismaWithLayout`

Main layout component that orchestrates all sections.

**Props:**
- `data: PrismaWithData` - Complete page data from JSON
- `codeExamples: Record<string, string>` - Code snippets keyed by tab value

### Individual Components

Each section can also be used independently:

```tsx
import { Hero, WhySection, HowSection } from "@/components/prisma-with";

// Use individually in custom layouts
<Hero data={data.hero} />
<WhySection data={data.why} />
<HowSection data={data.how} codeExamples={codeExamples} />
```

## Creating a New Technology Page

1. Copy `nextjs.json` to `[tech-name].json`
2. Update all content (hero, cards, etc.)
3. Create a new route: `app/(prisma-with)/[tech-name]/page.tsx`
4. Copy the page setup from `nextjs/page.tsx`
5. Update metadata and code examples
6. Done! ✨

## Styling

All components use:
- Tailwind CSS utilities
- Eclipse design system components (`@prisma/eclipse`)
- CSS variables for theming (light/dark mode compatible)

## Type Safety

The layout is fully typed with `PrismaWithData` exported from `layout.tsx`. TypeScript will validate your JSON data structure.