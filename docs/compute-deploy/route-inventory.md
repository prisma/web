# Prisma Compute Route Inventory

Verified on 2026-06-19 after deploying the no-proxy Compute configuration.

## Apps

| App | URL | Runtime |
| --- | --- | --- |
| Homepage | https://cmqkpxx900dea0ddxaoyu2s8l.fra.prisma.build | Next.js standalone |
| Docs | https://cmqkoe8hg0cyt03l79u7thj20.fra.prisma.build | Bun static runtime generated from docs Next build with a prioritized current-docs route subset |
| Blog | https://cmqkpw54o0yp4zndvj3zei5ml.fra.prisma.build | Bun static runtime generated from blog Next build |

## Homepage

| Route | Purpose | Result |
| --- | --- | --- |
| `/` | Homepage | `200 text/html` |
| `/compute` | Product page | `200 text/html` |
| `/pricing` | Pricing page | `200 text/html` |
| `/changelog` | Changelog index | `200 text/html` |
| `/changelog/2026-04-07` | Changelog detail page | `200 text/html` |
| `/orm` | ORM product page | `200 text/html` |
| `/postgres` | Postgres product page | `200 text/html` |
| `/docs/compute/configuration` | Site rewrite to docs Compute app | `200 text/html` |
| `/blog/launching-prisma-compute-public-beta` | Site rewrite to blog Compute app | `200 text/html` |
| `/blog/postgres-bloom-index-the-overlooked-postgres-feature` | Site rewrite to reported 2026 blog post | `200 text/html` |

## Docs

| Route | Purpose | Result |
| --- | --- | --- |
| `/docs` | Docs landing page | `200 text/html` |
| `/docs/compute` | Compute section index | `200 text/html` |
| `/docs/compute/getting-started` | Compute getting started guide | `200 text/html` |
| `/docs/compute/github` | Compute GitHub integration | `200 text/html` |
| `/docs/compute/deployments` | Compute deployments guide | `200 text/html` |
| `/docs/prisma-compute/deploy` | Compute quickstart | `200 text/html` |
| `/docs/compute/configuration` | Compute configuration reference | `200 text/html` |
| `/docs/orm` | ORM section index | `200 text/html` |
| `/docs/orm/prisma-client/setup-and-configuration/introduction` | ORM reference page | `200 text/html` |
| `/docs/orm/prisma-client/queries/crud` | ORM query reference page | `200 text/html` |
| `/docs/postgres` | Postgres section index | `200 text/html` |
| `/docs/guides` | Guides section index | `200 text/html` |
| `/docs/guides/frameworks/nextjs` | Framework guide | `200 text/html` |
| `/docs/cli` | CLI section index | `200 text/html` |
| `/docs/ai` | AI section index | `200 text/html` |
| `/docs/accelerate` | Accelerate section index | `200 text/html` |
| `/docs/management-api/getting-started` | API reference page | `200 text/html` |
| `/docs/rss.xml` | RSS feed | `200 text/plain` |
| `/docs/og/compute/configuration/image.png` | Generated OG image snapshot | `200 image/png` |
| `/docs/favicon.ico` | Favicon route | `200 image/x-icon` |
| `/docs/_next/static/media/MonaSansVF%5Bwdth%2Cwght%2Copsz%2Cital%5D-s.p.8a501443.woff2` | Encoded font URL regression check | `200 font/woff2` |
| `/docs/imgs/sidebar-banners/prisma-next.png` | Sidebar promo image | `200 image/png` |

## Blog

| Route | Purpose | Result |
| --- | --- | --- |
| `/blog` | Blog index | `200 text/html` |
| `/blog/launching-prisma-compute-public-beta` | Reported failing blog post | `200 text/html` |
| `/blog/launching-prisma-compute-public-beta?_gl=...` | Reported failing blog post with tracking query | `200 text/html` |
| `/blog/postgres-bloom-index-the-overlooked-postgres-feature` | Reported 2026 blog post | `200 text/html` |
| `/blog/postgres-bloom-index-the-overlooked-postgres-feature?_gl=...` | Reported 2026 blog post with tracking query | `200 text/html` |
| `/blog/prisma-compute-custom-domains` | Current Compute series post | `200 text/html` |
| `/blog/bringing-prisma-orm-to-react-native-and-expo` | Current ORM post | `200 text/html` |
| `/blog/series` | Blog series index | `200 text/html` |
| `/blog/series/prisma-compute` | Blog series page | `200 text/html` |
| `/blog/series/postgres-features` | Dependent series page for reported 2026 post | `200 text/html` |
| `/blog/series/postgres-features?_rsc=...` | Dependent series prefetch regression check | `200 text/html` |
| `/blog/author/shane-neubauer` | Author page | `200 text/html` |
| `/blog/author/ankur-datta` | Dependent author page for reported 2026 post | `200 text/html` |
| `/blog/author/ankur-datta?_rsc=...` | Dependent author prefetch regression check | `200 text/html` |
| `/blog/rss.xml` | RSS feed | `200 application/rss+xml` |
| `/blog/favicon.ico` | Favicon route | `200 image/x-icon` |
| `/blog/launching-prisma-compute-public-beta/imgs/hero.png` | Blog post media asset | `200 image/png` |
| `/blog/postgres-bloom-index-the-overlooked-postgres-feature/imgs/bloom-filters-in-postgres.png` | Reported 2026 post media asset | `200 image/png` |
| `/blog/prisma-turso-ea-support-rXGd_Tmy3UXX` | Removed pre-2024 post | `404 text/plain` expected |

## Notes

- No route in this inventory is proxied to `www.prisma.io`.
- Blog content before 2024 was removed from source and media to reduce deployment size.
- Docs and blog use generated `.compute/server.ts` files that embed the verified routes and required assets during Compute builds.
- The docs builder now derives a prioritized subset from docs frontmatter URLs. The current deployment verified 181 captured docs HTML routes, including `/docs/compute`, all Compute docs, major section indexes, and representative ORM, Postgres, Guides, Management API, CLI, AI, Accelerate, Studio, and Console pages.
- The blog builder now derives the 20 newest retained post routes from frontmatter and includes dependent author and series pages for those posts. The current deployment verified 42 generated source routes plus 4 query/rewrite URLs.
