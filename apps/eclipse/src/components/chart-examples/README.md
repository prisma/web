# Chart Examples

This directory contains interactive chart examples used in the Eclipse design system documentation.

## Overview

These examples demonstrate various chart types and configurations using the Chart component from `@prisma/eclipse`, which is built on top of Recharts.

## Available Examples

### Basic Chart Types

- **BasicBarChartExample** - Simple bar chart showing query data by month
- **LineChartExample** - Line chart displaying connection trends over time
- **AreaChartExample** - Stacked area chart showing requests vs cached data
- **PieChartExample** - Pie chart visualizing browser visitor distribution

### Advanced Examples

- **ChartWithLegendExample** - Bar chart with legend comparing multiple data series
- **MultipleDataSeriesExample** - Chart displaying three different data series
- **StackedAreaChartExample** - Area chart with stacked data (cached vs uncached)
- **CustomStyledChartExample** - Line chart with custom styling and enhanced visuals

### Tooltip Variations

- **TooltipIndicatorDotExample** - Chart with dot-style tooltip indicator
- **TooltipIndicatorLineExample** - Chart with line-style tooltip indicator
- **TooltipIndicatorDashedExample** - Chart with dashed-style tooltip indicator

## Usage

Import the examples in MDX files:

```tsx
import { BasicBarChartExample } from "@/components/chart-examples/interactive-examples";

<BasicBarChartExample />
```

Or import from the index file:

```tsx
import { BasicBarChartExample, LineChartExample } from "@/components/chart-examples";
```

## File Structure

```
chart-examples/
├── README.md                    # This file
├── index.ts                     # Barrel export file
└── interactive-examples.tsx     # All chart example components
```

## Data Patterns

All examples use realistic Prisma-related data scenarios:

- Database queries and connections
- Request caching metrics
- Performance statistics
- Multi-product comparisons (ORM, Accelerate, etc.)

## TypeScript Notes

Some examples may show TypeScript warnings about missing `payload` props on `ChartLegendContent`. These are false positives - Recharts injects the `payload` prop at runtime through the render prop pattern. The examples will work correctly despite these warnings.

## Adding New Examples

When adding new chart examples:

1. Create the example component in `interactive-examples.tsx`
2. Export it from `index.ts`
3. Import and use it in the relevant MDX documentation file
4. Follow the naming convention: `[ChartType][Feature]Example`
5. Use realistic, Prisma-related data scenarios
6. Include proper TypeScript types
7. Add meaningful chart configurations with labels and colors

## Best Practices

- Keep examples focused on a single feature or pattern
- Use consistent color schemes aligned with Eclipse design system
- Provide meaningful labels and configurations
- Ensure examples are responsive and accessible
- Use the "use client" directive since charts are interactive
- Keep data sets small but representative