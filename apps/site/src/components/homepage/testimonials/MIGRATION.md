# Testimonials Migration: Vanilla Extract → Tailwind CSS

## Summary

This document outlines the migration of the testimonials component from Vanilla Extract CSS to Tailwind CSS.

## Files Changed

1. **tailwind.config.ts** - Added animation keyframes and utilities
2. **index.tsx** - Converted component to use Tailwind classes
3. **testimonial-item.tsx** - Converted component to use Tailwind classes
4. **index.css.ts** - ❌ Can be deleted (no longer needed)

## Key Changes

### 1. Tailwind Config Updates

Added custom animations:
- `slideDown` / `slideDown2` - For downward scrolling testimonials
- `slideUp` / `slideUp2` - For upward scrolling testimonials  
- `fadein` - Fade-in animation

Added custom utilities:
- `.paused` - For pausing animations on hover
- `.running` - For running animations

### 2. Component Class Conversions

#### testimonialRoot
**Before:** Vanilla Extract style object
**After:** 
```tsx
cn(
  "grid max-w-full gap-[30px] relative",
  "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[30%]...",
  "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[30%]..."
)
```

#### Responsive Display Classes
- **mobile**: `grid md:hidden`
- **tablet**: `hidden md:grid lg:hidden grid-cols-2`
- **desktop**: `hidden lg:grid grid-cols-3`

#### brandWheel
**Before:** Complex Vanilla Extract style
**After:** `relative flex flex-row items-center overflow-hidden w-full min-h-[680px] h-[100px] max-w-[1200px] mx-auto hover:![animation-duration:0s]`

#### rollingList
**Before:** Separate style with animation
**After:** 
```tsx
cn(
  "absolute flex-shrink-0 w-full min-w-full flex flex-col justify-around mx-auto",
  reverse ? "animate-slide-up md:hover:paused" : "animate-slide-down md:hover:paused"
)
```

#### testimonialItemRoot
**Before:** Vanilla Extract style object
**After:** `text-foreground-neutral p-6 my-3 font-[family-name:var(--barlow)] font-normal text-lg bg-surface-primary border border-border-primary rounded-[10px] leading-[25.2px]`

### 3. Nth-child Selectors

Converted global styles to Tailwind arbitrary variants:

**Before:**
```ts
globalStyle(`${testimonialRoot} > div:nth-child(3)`, {
  display: 'none',
  '@media': { '(min-width: 940px)': { display: 'flex' } }
})
```

**After:**
```tsx
"[&>*:nth-child(3)]:flex [&>*]:flex-1"
```

### 4. Pseudo-elements

**Before:**
```ts
"::before": {
  content: " / ",
  color: vars.colors.text.disabled,
}
```

**After:**
```tsx
"before:content-['_/_'] before:text-foreground-neutral-disabled"
```

## Animation Timing

- Original: 100s base, 130s for slide down
- Kept the same durations in Tailwind config
- Hover pause behavior maintained with `md:hover:paused` utility

## Color Token Mapping

| Vanilla Extract | Tailwind |
|----------------|----------|
| `vars.colors.text.secondary` | `text-foreground-neutral-weak` |
| `vars.colors.text.terciary` | `text-foreground-neutral-weak` |
| `vars.colors.text.disabled` | `text-foreground-neutral-disabled` |
| `vars.colors.surface.primary` | `bg-surface-primary` |
| `vars.colors.border.primary` | `border-border-primary` |
| `vars.colors.surface.brand.darker` | `text-surface-brand-darker` |

## Breaking Changes

None - the component API remains the same:
- `list` prop still accepts `TestimonialItemType[]`
- `noShadow` prop still removes gradients
- `mask` prop still applies mask styles

## Testing Checklist

- [ ] Mobile view (< 768px) - single column
- [ ] Tablet view (768px - 940px) - two columns
- [ ] Desktop view (> 940px) - three columns
- [ ] Hover pause animation works on desktop
- [ ] Gradient overlays appear/disappear with `noShadow` prop
- [ ] Animations scroll smoothly
- [ ] Both regular and "startups" variant of testimonial items render correctly

## Next Steps

1. Delete `web/apps/site/src/components/homepage/testimonials/index.css.ts`
2. Test the component thoroughly
3. Verify no build errors
4. Check that animations perform smoothly