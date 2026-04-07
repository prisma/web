**Date:** 2026-04-06
**Site:** `https://www.prisma.io/docs` (Next.js 16 App Router + Fumadocs)
**Pages audited:** 363 v7 MDX + 316 v6 MDX = 679 total

---

## SEO Health Score: 72 / 100

| Category | Score | Weight | Weighted |
| --- | --- | --- | --- |
| Technical SEO | 65/100 | 22% | 14.3 |
| Content Quality | 78/100 | 23% | 17.9 |
| On-Page SEO | 82/100 | 20% | 16.4 |
| Schema / Structured Data | 60/100 | 10% | 6.0 |
| Performance (CWV) | 45/100 | 10% | 4.5 |
| AI Search Readiness | 85/100 | 10% | 8.5 |
| Images | 50/100 | 5% | 2.5 |
| **Total** |  |  | **72** |

---

## Critical Issues

### 1. Image optimization disabled (`images: { unoptimized: true }`)

**File:** `next.config.mjs:233`**Priority:** Critical

`images: { unoptimized: true }` disables Next.js's built-in image optimization (WebP conversion, lazy loading, responsive srcsets, automatic sizing). This directly harms **Largest Contentful Paint (LCP)** — a Core Web Vitals ranking signal. Any `<Image>` components in the docs render as unoptimized `<img>` tags.

**Fix:** Remove `unoptimized: true`. If this was set for a static export reason, use the Vercel Image Optimization service (included on Vercel deployments) or configure `loader: 'custom'` with a CDN.

---

### 2. Root redirect is a 302 (temporary), not 301 (permanent)

**File:** `next.config.mjs:213-219`**Priority:** Critical

```jsx
{
  source: "/",
  destination: "/docs",
  permanent: false,   // ← 302, should be 301
  basePath: false,
}
```

A 302 does not pass PageRank/link equity to `/docs`. Any external links to `https://www.prisma.io/` (e.g., homepage links from social profiles, blog posts, partner sites) lose their link value. This has been a long-standing misconfiguration that compounds over time as backlinks accumulate.

**Fix:** Change `permanent: false` → `permanent: true`.

---

## High Priority

### 3. 55 pages missing `description` frontmatter

**File:** `content/docs/management-api/endpoints/**`**Priority:** High

~15% of v7 content has no meta description. Without a `description:` field, `generateMetadata()` returns `undefined` and Google auto-generates the snippet — usually worse for CTR. Affected pages are almost entirely auto-generated Management API endpoint pages.

**Fix:** Add `description:` frontmatter to all 55 pages, or add a fallback in `generateMetadata()` using the first paragraph of MDX content.

---

### 4. TechArticle schema missing `datePublished`

**File:** `src/components/structured-data.tsx:13-38`**Priority:** High

The TechArticle JSON-LD includes `dateModified` (when available) but never `datePublished`. Google's TechArticle rich result spec requires `datePublished` for eligibility.

```tsx
const schema = {
  '@type': 'TechArticle',
  // ❌ datePublished: missing
  dateModified: lastModified?.toISOString(),
```

**Fix:** Add `datePublished` to the frontmatter schema and populate it. If unavailable, use `dateModified` as a fallback.

---

### 5. BreadcrumbList names derived from slugs, not page titles

**File:** `src/components/structured-data.tsx:62-68`**Priority:** High

```tsx
name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
```

This produces names like `"Orm"`, `"Prisma client"`, `"Setup and configuration"` instead of proper display names ("Prisma ORM", "Prisma Client", "Setup and Configuration"). Google shows BreadcrumbList names in search results.

**Fix:** Use the page's `data.title` or the parent section's `meta.json` title for intermediate breadcrumb items, not slug-derived strings.

---

### 6. No `WebSite` schema with `SearchAction`

**File:** `src/app/layout.tsx` (missing)
**Priority:** High

The site has fully functional search (Orama-based at `/api/search`). Adding a `WebSite` schema with `SearchAction` at root level enables Google's **Sitelinks Searchbox** for branded searches ("prisma docs").

**Fix:** Add to `src/app/layout.tsx`:

```json
{
  "@context": "<https://schema.org>",
  "@type": "WebSite",
  "name": "Prisma Documentation",
  "url": "<https://www.prisma.io/docs>",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "<https://www.prisma.io/docs?q={search_term_string}>"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

### 7. Flat sitemap priorities — all pages equal

**File:** `src/app/(docs)/sitemap.ts:12-21`**Priority:** High

Every v7 page gets `priority: 0.5`. The sitemap spec recommends differentiated priorities: root/index pages `1.0`, section landing pages `0.8`, leaf pages `0.5-0.6`. With 679 URLs, crawl budget matters — especially for v6 legacy pages.

**Fix:**

```tsx
priority: page.slugs.length === 0 ? 1.0        // root
         : page.slugs.length === 1 ? 0.8        // section
         : 0.5,                                   // leaf
```

---

### 8. Soft-redirect stub pages indexed

**Files:** `content/docs/accelerate/connection-pooling.mdx`, `content/docs/accelerate/caching.mdx`**Priority:** High

These 9-line stub pages contain only "This page has moved..." text and are included in the sitemap with priority 0.5. They pass no canonical signal to the new URL and will be indexed as thin content.

**Fix:** Add `noindex: true` frontmatter support in `generateMetadata()`, or replace the stubs with proper HTTP 301 redirects in `vercel.json`.

---

## Medium Priority

### 9. Missing HSTS header

**File:** `next.config.mjs:179-200`**Priority:** Medium

Security headers include CSP, `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` — but no `Strict-Transport-Security`. HSTS is a ranking signal for HTTPS enforcement.

**Fix:**

```jsx
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
```

---

### 10. No `Organization` schema at root level

**File:** `src/app/layout.tsx` (missing)
**Priority:** Medium

No site-level Organization schema with `sameAs` social profiles, logo, or contact info. This enriches Google's Knowledge Panel for branded searches.

**Fix:** Add to `src/app/layout.tsx`:

```json
{
  "@context": "<https://schema.org>",
  "@type": "Organization",
  "name": "Prisma",
  "url": "<https://www.prisma.io>",
  "logo": "<https://www.prisma.io/images/logo.svg>",
  "sameAs": [
    "<https://twitter.com/prisma>",
    "<https://github.com/prisma/prisma>",
    "<https://www.linkedin.com/company/prismaio>"
  ]
}
```

---

### 11. `llms.txt` includes v6 and v7 without version guidance

**File:** `src/app/llms.txt/route.ts:8-40`**Priority:** Medium

The llms.txt lists both v7 ("Latest") and v6 pages. AI models crawling this see duplicate concepts across versions with no signal about which is authoritative, diluting AI citation quality.

**Fix:** Add a preamble section:

```markdown
> This documentation covers Prisma v7 (current) and v6 (legacy).
> Prefer "Latest" section pages for current recommendations.
> v6 pages are maintained for backwards compatibility only.
```

---

### 12. Sitemap `revalidate = false` — never auto-refreshes

**File:** `src/app/(docs)/sitemap.ts:5`**Priority:** Medium

`export const revalidate = false` means the sitemap is generated once at build time and never revalidated via ISR. New pages added between deployments won't appear in the sitemap until the next full deploy.

**Fix:** Set `export const revalidate = 3600` (or another appropriate interval).

---

### 13. OG image route fetches Google Fonts on every cold start

**File:** `src/app/og/[...slug]/route.tsx`**Priority:** Medium

The OG image route fetches 3 Google Fonts (Barlow, Inter, JetBrains Mono) via `loadGoogleFont()`. The module-level `fontCache` helps within a runtime instance but doesn't persist across cold starts — each cold start adds font-fetch latency to OG image generation.

**Fix:** Bundle the font files as static assets in `/public/fonts/` and load them from the filesystem instead of fetching from Google.

---

### 14. v6 canonical URLs may signal duplicate content

**File:** `src/app/(docs)/v6/[[...slug]]/page.tsx:104`**Priority:** Medium

v6 pages set their canonical to `/docs/v6/orm/...` — they do **not** point to the equivalent v7 page. For pages where v6 content is nearly identical to v7, this creates genuine duplicate content without a disambiguation signal.

**Fix:** For v6 pages with a nearly-identical v7 equivalent, set the canonical to the v7 URL. Or add `noindex` to low-value v6 fallback pages.

---

## Low Priority

### 15. Missing `Permissions-Policy` header

**File:** `next.config.mjs:179-200`**Priority:** Low

**Fix:** Add: `{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }`

---

### 16. No image sitemap

**Priority:** Low

The docs site generates OG images for every page. Including them in an image sitemap could improve image indexation and image search discovery.

---

### 17. `assetPrefix` diverges from `basePath`

**File:** `next.config.mjs:229-230`**Priority:** Low

`assetPrefix: "/docs-static"` while pages are at `basePath: "/docs"`. Appears intentional (CDN routing), but worth verifying the CDN mapping is correct in production to prevent JS/CSS 404s.

---

### 18. No `.well-known/security.txt`

**Priority:** Low

Minor domain authority/trust signal. Easy win for security hygiene.

---

## What's Working Well

- **Meta descriptions:** 100% of pages have custom `metaDescription`
- **Dynamic OG images:** Fully branded, covers all 679 pages with section-aware styling
- **TechArticle + BreadcrumbList schema:** On every page (data quality fixes needed)
- **llms.txt + llms-full.txt:** Ahead of most documentation sites for AI readiness
- **robots.txt:** Correctly disallows `/api/`, `/_next/`, `/og/`, query params
- **Canonical URLs:** Properly implemented via `generateMetadata()` on all pages
- **Twitter card + OG metadata:** Full coverage on all pages
- **PostHog analytics:** 404 tracking enables proactive broken link detection
- **CSP headers:** Comprehensive Content Security Policy
- **ISR-compatible:** `generateStaticParams()` + dynamic page routes

---

## Prioritized Action Plan

| Priority | Issue | Effort | Impact |
| --- | --- | --- | --- |
| **Critical** | Image optimization disabled (`images: unoptimized`) | Low | LCP, CWV |
| **Critical** | 302 → 301 root redirect | Trivial | Link equity |
| **High** | Add `datePublished` to TechArticle schema | Low | Rich results |
| **High** | Fix BreadcrumbList names (slugs → titles) | Medium | SERP display |
| **High** | Add WebSite + SearchAction schema | Low | Sitelinks Searchbox |
| **High** | Fix stub/moved pages (noindex or redirect) | Low | Thin content |
| **High** | Add descriptions to 55 endpoint pages | Medium | CTR |
| **High** | Differentiate sitemap priorities by depth | Low | Crawl budget |
| **Medium** | Add HSTS header | Trivial | Security signal |
| **Medium** | Add Organization schema at root | Low | Knowledge Panel |
| **Medium** | Improve llms.txt preamble | Trivial | AI citation quality |
| **Medium** | Set sitemap `revalidate` to a TTL | Trivial | Sitemap freshness |
| **Medium** | Bundle OG fonts locally | Medium | OG render speed |
| **Medium** | v6 canonical strategy | Medium | Duplicate content |
| **Low** | Permissions-Policy header | Trivial | Security hygiene |
| **Low** | Image sitemap | Low | Image search |
| **Low** | Verify assetPrefix CDN mapping | Low | Asset delivery |
| **Low** | Add `.well-known/security.txt` | Trivial | Trust signal |