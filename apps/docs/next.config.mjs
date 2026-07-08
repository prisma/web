import { withSentryConfig } from "@sentry/nextjs";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://ingest.promptwatch.com
    https://cdn-cookieyes.com
    https://cdn.tolt.io
    https://unpkg.com
    https://cdn.jsdelivr.net
    https://www.youtube.com
    https://www.youtube-nocookie.com
    https://tally.so
    https://va.vercel-scripts.com
    https://www.googletagmanager.com
    https://widget.kapa.ai
    https://www.google.com
    https://www.gstatic.com
    https://metrics.kapa.ai
    https://proxyhog.prisma-data.net
    https://cdn.cr-relay.com
    https://app.enzuzo.com/
    https://static.ads-twitter.com
    https://snap.licdn.com
    https://vercel.live
    https://58qr5yci46.execute-api.us-east-1.amazonaws.com
    https://analytics.twitter.com
    https://t.co
    https://static.ads-twitter.com
    https://px.ads.linkedin.com
    https://snap.licdn.com
    https://region1.google-analytics.com
    https://googleads.g.doubleclick.net
    https://pagead2.googlesyndication.com
    https://googleads.g.doubleclick.net
    https://td.doubleclick.net
    https://cdnjs.cloudflare.com
    https://raw.githubusercontent.com
    https://hcaptcha.com
    https://*.hcaptcha.com
    https://*.fontawesome.com;

  style-src 'self' 'unsafe-inline'
    https://fonts.googleapis.com
    https://cdn.tolt.io
    https://vercel.live
    https://proxyhog.prisma-data.net
    https://hcaptcha.com
    https://*.hcaptcha.com
    https://cdnjs.cloudflare.com
    https://*.fontawesome.com;

  font-src 'self' data:
    https://fonts.gstatic.com
    https://vercel.live
    https://assets.vercel.com
    https://cdnjs.cloudflare.com
    https://*.fontawesome.com;

  img-src 'self' data:
    https://cdn.sanity.io
    https://prismalens.vercel.app
    https://api.producthunt.com
    https://www.google.com
    https://www.google.com/s2/favicons
    https://*.gstatic.com
    https://pbs.twimg.com/
    https://cdn.tolt.io
    https://cdn-cookieyes.com
    https://website-prisma.vercel.app
    https://www.cursor.com/
    https://cursor.com/
    https://analytics.twitter.com
    https://t.co
    https://static.ads-twitter.com
    https://px.ads.linkedin.com
    https://snap.licdn.com
    https://pagead2.googlesyndication.com
    https://googleads.g.doubleclick.net
    https://vercel.live https://vercel.com data: blob:
    https://td.doubleclick.net
    https://raw.githubusercontent.com;

  connect-src 'self'
    https://ingest.promptwatch.com
    https://api.github.com
    https://p2zxqf70.api.sanity.io
    https://www.youtube.com
    https://cdn.jsdelivr.net
    https://accelerate-analytics-exporter.prisma-data.net
    https://www.prisma-status.com
    https://api.rippling.com
    https://api.producthunt.com
    https://*.tally.so
    https://va.vercel-scripts.com
    https://www.googletagmanager.com
    https://www.google.com
    https://www.gstatic.com
    https://kapa-widget-proxy-la7dkmplpq-uc.a.run.app
    https://metrics.kapa.ai
    https://cdn-cookieyes.com
    https://log.cookieyes.com
    https://*.algolia.net
    https://*.algolianet.com
    https://proxyhog.prisma-data.net
    https://directory.cookieyes.com
    https://api.cr-relay.com
    https://pagead2.googlesyndication.com
    https://px.ads.linkedin.com
    https://internal-t.posthog.com
    https://vercel.live wss://ws-us3.pusher.com
    https://react-tweet.vercel.app
    https://cdn.tolt.io
    https://58qr5yci46.execute-api.us-east-1.amazonaws.com
    https://analytics.twitter.com
    https://t.co
    https://static.ads-twitter.com
    https://px.ads.linkedin.com
    https://snap.licdn.com
    https://region1.google-analytics.com
    https://googleads.g.doubleclick.net
    https://pagead2.googlesyndication.com
    https://googleads.g.doubleclick.net
    https://td.doubleclick.net
    https://raw.githubusercontent.com
    https://www.google-analytics.com
    https://unpkg.com
    https://proxy.kapa.ai
    https://hcaptcha.com
    https://*.hcaptcha.com
    https://*.fontawesome.com;

  media-src 'self'
    https://*.prisma.io
    https://unpkg.com
    https://cdn.jsdelivr.net
    https://www.youtube.com;

  frame-src 'self'
    https://www.youtube.com
    https://youtube.com
    https://youtube-nocookie.com
    https://tally.so
    https://*.tally.so
    https://www.googletagmanager.com
    https://www.google.com
    https://www.gstatic.com
    https://vercel.live/
    https://pagead2.googlesyndication.com
    https://googleads.g.doubleclick.net
    https://td.doubleclick.net
    https://calculator.prisma.io/
    https://ppg-pricing-calculator.vercel.app
    https://hcaptcha.com
    https://*.hcaptcha.com;

  child-src 'self'
    https://www.youtube.com
    https://youtube.com
    https://youtube-nocookie.com
    https://tally.so
    https://*.tally.so
    https://www.googletagmanager.com
    https://www.google.com
    https://www.gstatic.com;

  worker-src 'self';

  object-src 'none';

  base-uri 'self';

  form-action 'self';

  frame-ancestors 'self';
`;

const securityHeaders = [
  {
    key: "Accept-Encoding",
    value: "gzip, compress, br, zstd",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const llmsTxtHeader = {
  key: "Link",
  value: '</docs/llms.txt>; rel="llms-txt"',
};

const docsMarkdownHeaders = [
  {
    key: "Link",
    value:
      '</docs/:path.md>; rel="alternate"; type="text/markdown", </docs/llms.txt>; rel="llms-txt"',
  },
];

const docsRootMarkdownHeaders = [
  {
    key: "Link",
    value: '</docs.md>; rel="alternate"; type="text/markdown", </docs/llms.txt>; rel="llms-txt"',
  },
];

const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "localhost,127.0.0.1,192.168.1.48")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const config = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: true,
        basePath: false,
      },
      {
        source: "/orm/latest",
        destination: "/orm",
        permanent: true,
      },
      {
        source: "/orm/latest/:path*",
        destination: "/orm/:path*",
        permanent: true,
      },
      {
        source: "/v6/orm",
        destination: "/orm/v6",
        permanent: true,
      },
      {
        source: "/v6/orm/:path*",
        destination: "/orm/v6/:path*",
        permanent: true,
      },
      {
        source: "/orm/next/create-prisma",
        destination: "/next/getting-started",
        permanent: false,
      },
      {
        source: "/next/create-prisma",
        destination: "/next/getting-started",
        permanent: false,
      },
      {
        source: "/next/quickstart",
        destination: "/next/quickstart/postgresql",
        permanent: false,
      },
      {
        source: "/next/prisma-postgres/quickstart",
        destination: "/prisma-postgres/quickstart/prisma-next",
        permanent: false,
      },
      // The Prisma Next + Prisma Postgres quickstart now lives in the Prisma Postgres
      // Quickstart dropdown alongside the other ORMs.
      {
        source: "/next/prisma-postgres/quickstart/prisma-next",
        destination: "/prisma-postgres/quickstart/prisma-next",
        permanent: false,
      },
      {
        source: "/orm/next/quickstart/:path*",
        destination: "/next/quickstart/:path*",
        permanent: false,
      },
      {
        source: "/orm/next/add-to-existing-project/:path*",
        destination: "/next/add-to-existing-project/:path*",
        permanent: false,
      },
      // ── Prisma Next URL cutover (DR-8687) — DO NOT ENABLE YET ─────────────
      // The redirects below retire live Prisma 7 URLs, so they ship only when
      // Prisma Next becomes the default docs version (the /orm/next tree moves
      // to /orm). Until then, keep your section's redirects here, commented
      // out, so the full cutover map builds up in one reviewable place.
      // Section owners: append your block below with a DR reference.
      //
      // DR-8681 Fundamentals:
      // { source: "/orm/prisma-client", destination: "/orm/next/fundamentals/reading-data", permanent: false },
      // { source: "/orm/prisma-client/queries/crud", destination: "/orm/next/fundamentals/reading-data", permanent: false },
      // { source: "/orm/prisma-client/queries/select-fields", destination: "/orm/next/fundamentals/reading-data", permanent: false },
      // { source: "/orm/prisma-client/queries/filtering-and-sorting", destination: "/orm/next/fundamentals/reading-data", permanent: false },
      // { source: "/orm/prisma-client/queries/pagination", destination: "/orm/next/fundamentals/reading-data", permanent: false },
      // { source: "/orm/prisma-client/queries/aggregation-grouping-summarizing", destination: "/orm/next/fundamentals/reading-data", permanent: false },
      // { source: "/orm/prisma-client/queries/relation-queries", destination: "/orm/next/fundamentals/relations-and-joins", permanent: false },
      // { source: "/orm/prisma-client/queries/transactions", destination: "/orm/next/fundamentals/transactions", permanent: false },
      // { source: "/orm/prisma-client/using-raw-sql", destination: "/orm/next/fundamentals/advanced-queries", permanent: false },
      //
      // DR-8680 Contract authoring:
      // { source: "/orm/prisma-schema", destination: "/orm/next/contract-authoring/the-data-contract", permanent: false },
      // { source: "/orm/prisma-schema/overview", destination: "/orm/next/contract-authoring/psl-syntax", permanent: false },
      // { source: "/orm/prisma-schema/overview/data-sources", destination: "/orm/next/contract-authoring/psl-syntax", permanent: false },
      // { source: "/orm/prisma-schema/overview/location", destination: "/orm/next/contract-authoring/psl-syntax", permanent: false },
      // { source: "/orm/prisma-client/type-safety", destination: "/orm/next/contract-authoring/the-data-contract", permanent: false },
      //
      // No Prisma Next equivalent yet (stay on the Prisma 7 tree, flag to the
      // SEO owner at cutover): /orm/prisma-client/queries/full-text-search,
      // /orm/prisma-client/queries/advanced/query-optimization-performance,
      // /orm/prisma-client/queries/excluding-fields.
      //
      // DR-8679 Data modeling:
      // { source: "/orm/prisma-schema", destination: "/orm/next/data-modeling", permanent: false },
      // { source: "/orm/prisma-schema/data-model/models", destination: "/orm/next/data-modeling", permanent: false },
      // { source: "/orm/prisma-schema/data-model/relations", destination: "/orm/next/data-modeling/relational-databases", permanent: false },
      //
      // Migrations (PR #8025; the "Migrating from Prisma 7" guide is DR-8689):
      // { source: "/orm/prisma-migrate", destination: "/orm/next/migrations/how-migrations-work", permanent: false },
      // { source: "/orm/prisma-migrate/getting-started", destination: "/orm/next/migrations/how-migrations-work", permanent: false },
      // { source: "/orm/prisma-migrate/understanding-prisma-migrate/mental-model", destination: "/orm/next/migrations/the-migration-graph", permanent: false },
      // { source: "/orm/prisma-migrate/workflows/development-and-production", destination: "/orm/next/migrations/applying-a-migration", permanent: false },
      // { source: "/orm/prisma-migrate/workflows/customizing-migrations", destination: "/orm/next/migrations/editing-a-migration", permanent: false },
      //
      // No Prisma Next equivalent yet (stay on the Prisma 7 tree, flag to the
      // SEO owner at cutover): /orm/prisma-migrate/understanding-prisma-migrate/shadow-database,
      // .../migration-histories, .../limitations-and-known-issues, and the
      // /orm/prisma-migrate/workflows/ pages for seeding, baselining,
      // squashing-migrations, generating-down-migrations, patching-and-hotfixing,
      // native-database-functions, native-database-types, prototyping-your-schema,
      // troubleshooting — reassess as matching Prisma Next pages land.
      //
      // ── Guides URL cutover (DR-8689 / DR-8687) — DO NOT ENABLE YET ────────
      // Today: Prisma 7 guides live at /guides/* and Prisma Next guides at
      // /guides/next/* (the "Guides version" dropdown switches between them).
      // When Prisma Next becomes the default docs version ("/" becomes the
      // Prisma Next docs and Prisma 7 moves to v7), the guides flip the same
      // way: the Prisma 7 guide tree moves under /guides/v7, and the
      // /guides/next tree is promoted to /guides. The redirects to enable at
      // that cutover, kept here so the map builds up in one reviewable place:
      //
      // The /guides/next tree mirrors the Prisma 7 folder structure, so the
      // promotion is one wildcard:
      // { source: "/guides/next/:path*", destination: "/guides/:path*", permanent: false },
      //
      // Park the Prisma 7 versions under /guides/v7 (only for guides that
      // have a Prisma Next replacement; unconverted guides keep their URL):
      // { source: "/guides/runtimes/bun", destination: "/guides/v7/runtimes/bun", permanent: false },
      // { source: "/guides/runtimes/deno", destination: "/guides/v7/runtimes/deno", permanent: false },
      // { source: "/guides/frameworks/nextjs", destination: "/guides/v7/frameworks/nextjs", permanent: false },
      // { source: "/guides/frameworks/astro", destination: "/guides/v7/frameworks/astro", permanent: false },
      // { source: "/guides/frameworks/nuxt", destination: "/guides/v7/frameworks/nuxt", permanent: false },
      // { source: "/guides/frameworks/sveltekit", destination: "/guides/v7/frameworks/sveltekit", permanent: false },
      // { source: "/guides/frameworks/tanstack-start", destination: "/guides/v7/frameworks/tanstack-start", permanent: false },
      // { source: "/guides/frameworks/nestjs", destination: "/guides/v7/frameworks/nestjs", permanent: false },
      // { source: "/guides/frameworks/hono", destination: "/guides/v7/frameworks/hono", permanent: false },
      // { source: "/guides/frameworks/elysia", destination: "/guides/v7/frameworks/elysia", permanent: false },
      //
      // Each future guide conversion appends its pair here in the same PR.
      // ───────────────────────────────────────────────────────────────────────
    ];
  },
  async rewrites() {
    return [
      // {
      //   source: "/orm/:path((?!latest(?:/|$)|v6(?:/|$)).*)",
      //   destination: "/orm/latest/:path",
      // },
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
      },
      {
        source: "/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
      {
        source: "/:path*.md",
        destination: "/llms.mdx/:path*",
      },
    ];
  },
  basePath: "/docs",
  assetPrefix: "/docs-static",
  allowedDevOrigins,
  reactStrictMode: true,

  transpilePackages: ["@prisma/eclipse"],
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders, llmsTxtHeader],
      },
      {
        source: "/",
        headers: docsRootMarkdownHeaders,
      },
      {
        source:
          "/:path((?!api(?:/|$)|llms(?:\\.|/|$)|og(?:/|$)|rss\\.xml$|sitemap(?:\\.xml)?$|favicon\\.ico$|.*\\.[^/]+$).+)",
        headers: docsMarkdownHeaders,
      },
    ];
  },
};

export default withSentryConfig(withMDX(config), {
  org: "prisma-ch",
  project: "javascript-nextjs",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
