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
    https://www.googletagmanager.com
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
    https://raw.githubusercontent.com
    https://*.google-analytics.com
    https://stats.g.doubleclick.net;

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
    https://*.fontawesome.com
    https://*.analytics.google.com
    https://stats.g.doubleclick.net
    https://*.google-analytics.com;

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
      // Direct hits on the docs origin host (docs.prisma.io/robots.txt) get a
      // disallow-all robots.txt so the duplicate host is not crawled. Google
      // follows robots.txt redirects and treats the target as this host's
      // robots file. A basePath-free rewrite is not allowed for internal
      // destinations, hence the redirect. The canonical
      // www.prisma.io/robots.txt is served by apps/site and never reaches
      // this app.
      {
        source: "/robots.txt",
        destination: "/docs/robots-origin.txt",
        permanent: false,
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
      // CLI rc.8 command-surface rework: init and build logs removed, composer
      // dev/deploy promoted to root-level dev/deploy, migrate renamed db migrate.
      { source: "/cli/platform-init", destination: "/cli/project", permanent: true },
      { source: "/compute/configuration", destination: "/compute", permanent: true },
      { source: "/cli/build", destination: "/cli/service", permanent: true },
      { source: "/cli/composer", destination: "/cli/deploy", permanent: true },
      { source: "/cli/migration-apply", destination: "/cli/db-migrate", permanent: true },
      // CLI rc.9: the agent group is replaced by skills sync/list. No redirect
      // for the orm init page's move to /cli/orm-init: /cli/init is now the
      // top-level init command, so the source URL stays a page.
      { source: "/cli/agent", destination: "/cli/skills", permanent: true },
      // ── Prisma 8 is the default docs version ──────────────────────────────
      // The former /v8 (and older /next) version segments are now the
      // unversioned tree. Permanent: those URLs circulated during Early Access
      // and the Release Candidate and will not come back in that form.
      { source: "/v8", destination: "/prisma-orm", permanent: true },
      { source: "/v8/getting-started", destination: "/getting-started", permanent: true },
      { source: "/v8/create-prisma", destination: "/prisma-orm/create-prisma", permanent: true },
      {
        source: "/v8/quickstart",
        destination: "/prisma-orm/quickstart/postgresql",
        permanent: true,
      },
      {
        source: "/v8/quickstart/:path*",
        destination: "/prisma-orm/quickstart/:path*",
        permanent: true,
      },
      {
        source: "/v8/add-to-existing-project/:path*",
        destination: "/prisma-orm/add-to-existing-project/:path*",
        permanent: true,
      },
      {
        source: "/v8/prisma-postgres/quickstart",
        destination: "/prisma-postgres/quickstart/prisma-orm",
        permanent: true,
      },
      {
        source: "/v8/prisma-postgres/quickstart/prisma-next",
        destination: "/prisma-postgres/quickstart/prisma-orm",
        permanent: true,
      },
      {
        source: "/v8/prisma-postgres/:path*",
        destination: "/prisma-postgres/:path*",
        permanent: true,
      },
      { source: "/v8/:path*", destination: "/prisma-orm", permanent: true },
      {
        source: "/orm/v8/create-prisma",
        destination: "/prisma-orm/create-prisma",
        permanent: true,
      },
      {
        source: "/orm/v8/quickstart/:path*",
        destination: "/prisma-orm/quickstart/:path*",
        permanent: true,
      },
      {
        source: "/orm/v8/add-to-existing-project/:path*",
        destination: "/prisma-orm/add-to-existing-project/:path*",
        permanent: true,
      },
      { source: "/orm/v8", destination: "/orm", permanent: true },
      { source: "/orm/v8/:path*", destination: "/orm/:path*", permanent: true },
      { source: "/cli/v8", destination: "/cli", permanent: true },
      { source: "/cli/v8/:path*", destination: "/cli/:path*", permanent: true },
      { source: "/guides/v8", destination: "/guides", permanent: true },
      { source: "/guides/v8/:path*", destination: "/guides/:path*", permanent: true },
      { source: "/llms/v8.txt", destination: "/llms/orm.txt", permanent: true },
      { source: "/next", destination: "/prisma-orm", permanent: true },
      { source: "/next/getting-started", destination: "/getting-started", permanent: true },
      { source: "/next/create-prisma", destination: "/prisma-orm/create-prisma", permanent: true },
      {
        source: "/next/quickstart",
        destination: "/prisma-orm/quickstart/postgresql",
        permanent: true,
      },
      {
        source: "/next/quickstart/:path*",
        destination: "/prisma-orm/quickstart/:path*",
        permanent: true,
      },
      {
        source: "/next/add-to-existing-project/:path*",
        destination: "/prisma-orm/add-to-existing-project/:path*",
        permanent: true,
      },
      {
        source: "/next/prisma-postgres/quickstart",
        destination: "/prisma-postgres/quickstart/prisma-orm",
        permanent: true,
      },
      {
        source: "/next/prisma-postgres/quickstart/prisma-next",
        destination: "/prisma-postgres/quickstart/prisma-orm",
        permanent: true,
      },
      {
        source: "/next/prisma-postgres/:path*",
        destination: "/prisma-postgres/:path*",
        permanent: true,
      },
      { source: "/next/:path*", destination: "/prisma-orm", permanent: true },
      {
        source: "/orm/next/create-prisma",
        destination: "/prisma-orm/create-prisma",
        permanent: true,
      },
      {
        source: "/orm/next/quickstart/:path*",
        destination: "/prisma-orm/quickstart/:path*",
        permanent: true,
      },
      {
        source: "/orm/next/add-to-existing-project/:path*",
        destination: "/prisma-orm/add-to-existing-project/:path*",
        permanent: true,
      },
      { source: "/orm/next", destination: "/orm", permanent: true },
      { source: "/orm/next/:path*", destination: "/orm/:path*", permanent: true },
      { source: "/cli/next", destination: "/cli", permanent: true },
      { source: "/cli/next/:path*", destination: "/cli/:path*", permanent: true },
      { source: "/guides/next", destination: "/guides", permanent: true },
      { source: "/guides/next/:path*", destination: "/guides/:path*", permanent: true },
      { source: "/llms/next.txt", destination: "/llms/orm.txt", permanent: true },
      // The CLI engine composes structured-error docsUrls as
      // <docsBaseUrl>/<CODE> (path form); the pages anchor codes as #<CODE>.
      {
        source: "/cli/error-reference/:code",
        destination: "/cli/error-reference#:code",
        permanent: false,
      },
      {
        source: "/orm/reference/error-reference/:code",
        destination: "/orm/reference/error-reference#:code",
        permanent: false,
      },
      {
        source: "/prisma-postgres/quickstart/prisma-next",
        destination: "/prisma-postgres/quickstart/prisma-orm",
        permanent: true,
      },
      // Renamed sections still linked from older blog posts and changelog entries.
      { source: "/management-api", destination: "/rest-api", permanent: true },
      { source: "/management-api/:path*", destination: "/rest-api/:path*", permanent: true },
      { source: "/compute/cli-reference", destination: "/cli", permanent: true },
      // ── Prisma 7 URL cutover (DR-8687) ────────────────────────────────────
      // The Prisma 7 tree moved to /orm/v7 (and /v7, /cli/v7, /guides/v7).
      // Pages with a Prisma 8 equivalent redirect to it (section owners'
      // maps: DR-8681 Fundamentals, DR-8680 Contract authoring, DR-8679 Data
      // modeling, PR #8025 Migrations, DR-8689 Guides). Every other page
      // redirects page-to-page to its /v7 twin. Pages that exist in both trees
      // (/orm, /orm/reference/error-reference, /cli, /cli/init, /getting-started,
      // /prisma-orm/quickstart/{postgresql,mongodb}, the converted framework
      // and runtime guides) keep their URL and now serve Prisma 8.
      {
        source: "/orm/prisma-client",
        destination: "/orm/fundamentals/reading-data",
        permanent: false,
      },
      {
        source: "/orm/prisma-client/queries/crud",
        destination: "/orm/fundamentals/reading-data",
        permanent: false,
      },
      {
        source: "/orm/prisma-client/queries/select-fields",
        destination: "/orm/fundamentals/reading-data",
        permanent: false,
      },
      {
        source: "/orm/prisma-client/queries/filtering-and-sorting",
        destination: "/orm/fundamentals/reading-data",
        permanent: false,
      },
      {
        source: "/orm/prisma-client/queries/pagination",
        destination: "/orm/fundamentals/reading-data",
        permanent: false,
      },
      {
        source: "/orm/prisma-client/queries/aggregation-grouping-summarizing",
        destination: "/orm/fundamentals/reading-data",
        permanent: false,
      },
      {
        source: "/orm/prisma-client/queries/relation-queries",
        destination: "/orm/fundamentals/relations-and-joins",
        permanent: false,
      },
      {
        source: "/orm/prisma-client/queries/transactions",
        destination: "/orm/fundamentals/transactions",
        permanent: false,
      },
      {
        source: "/orm/prisma-client/using-raw-sql",
        destination: "/orm/fundamentals/advanced-queries",
        permanent: false,
      },
      {
        source: "/orm/prisma-client/type-safety",
        destination: "/orm/contract-authoring/the-data-contract",
        permanent: false,
      },
      {
        source: "/orm/prisma-schema",
        destination: "/orm/contract-authoring/the-data-contract",
        permanent: false,
      },
      {
        source: "/orm/prisma-schema/overview",
        destination: "/orm/contract-authoring/psl-syntax",
        permanent: false,
      },
      {
        source: "/orm/prisma-schema/overview/data-sources",
        destination: "/orm/contract-authoring/psl-syntax",
        permanent: false,
      },
      {
        source: "/orm/prisma-schema/overview/location",
        destination: "/orm/contract-authoring/psl-syntax",
        permanent: false,
      },
      {
        source: "/orm/prisma-schema/data-model/models",
        destination: "/orm/data-modeling",
        permanent: false,
      },
      {
        source: "/orm/prisma-schema/data-model/relations",
        destination: "/orm/data-modeling/relational-databases",
        permanent: false,
      },
      {
        source: "/orm/prisma-migrate",
        destination: "/orm/migrations/how-migrations-work",
        permanent: false,
      },
      {
        source: "/orm/prisma-migrate/getting-started",
        destination: "/orm/migrations/how-migrations-work",
        permanent: false,
      },
      {
        source: "/orm/prisma-migrate/understanding-prisma-migrate/mental-model",
        destination: "/orm/migrations/the-migration-graph",
        permanent: false,
      },
      {
        source: "/orm/prisma-migrate/workflows/development-and-production",
        destination: "/orm/migrations/applying-a-migration",
        permanent: false,
      },
      {
        source: "/orm/prisma-migrate/workflows/customizing-migrations",
        destination: "/orm/migrations/editing-a-migration",
        permanent: false,
      },
      {
        source: "/prisma-orm/quickstart/prisma-postgres",
        destination: "/prisma-postgres/quickstart/prisma-orm",
        permanent: false,
      },
      {
        source: "/prisma-orm/add-to-existing-project/prisma-postgres",
        destination: "/prisma-orm/add-to-existing-project/postgresql",
        permanent: false,
      },
      // Page-to-page: the rest of the Prisma 7 ORM tree.
      {
        source: "/orm/prisma-client/:path*",
        destination: "/orm/v7/prisma-client/:path*",
        permanent: false,
      },
      {
        source: "/orm/prisma-schema/:path*",
        destination: "/orm/v7/prisma-schema/:path*",
        permanent: false,
      },
      {
        source: "/orm/prisma-migrate/:path*",
        destination: "/orm/v7/prisma-migrate/:path*",
        permanent: false,
      },
      // Nested Prisma 7 core-concepts pages only. `:path*` also matched the
      // Prisma 8 hub at /orm/core-concepts (core-concepts.mdx) and sent it to
      // /orm/v7/core-concepts/, which has no index and 404s (prisma/prisma#30136).
      {
        source: "/orm/core-concepts/:path+",
        destination: "/orm/v7/core-concepts/:path+",
        permanent: false,
      },
      { source: "/orm/more/:path*", destination: "/orm/v7/more/:path*", permanent: false },
      // Prisma 7 folders that never had an index page. Their bare URLs 404, so
      // send them to the first page in each folder's meta.json.
      {
        source: "/orm/v7/core-concepts",
        destination: "/orm/v7/core-concepts/data-modeling",
        permanent: false,
      },
      {
        source: "/orm/v7/prisma-schema",
        destination: "/orm/v7/prisma-schema/overview",
        permanent: false,
      },
      { source: "/orm/v7/more", destination: "/orm/v7/more/releases", permanent: false },
      {
        source: "/orm/v7/reference/preview-features",
        destination: "/orm/v7/reference/preview-features/client-preview-features",
        permanent: false,
      },
      {
        source: "/orm/reference/prisma-cli-reference",
        destination: "/orm/v7/reference/prisma-cli-reference",
        permanent: false,
      },
      {
        source: "/orm/reference/prisma-client-reference",
        destination: "/orm/v7/reference/prisma-client-reference",
        permanent: false,
      },
      {
        source: "/orm/reference/prisma-schema-reference",
        destination: "/orm/v7/reference/prisma-schema-reference",
        permanent: false,
      },
      {
        source: "/orm/reference/prisma-config-reference",
        destination: "/orm/v7/reference/prisma-config-reference",
        permanent: false,
      },
      {
        source: "/orm/reference/connection-urls",
        destination: "/orm/v7/reference/connection-urls",
        permanent: false,
      },
      {
        source: "/orm/reference/environment-variables-reference",
        destination: "/orm/v7/reference/environment-variables-reference",
        permanent: false,
      },
      {
        source: "/orm/reference/database-features",
        destination: "/orm/v7/reference/database-features",
        permanent: false,
      },
      {
        source: "/orm/reference/supported-databases",
        destination: "/orm/v7/reference/supported-databases",
        permanent: false,
      },
      {
        source: "/orm/reference/system-requirements",
        destination: "/orm/v7/reference/system-requirements",
        permanent: false,
      },
      {
        source: "/orm/reference/errors/:path*",
        destination: "/orm/v7/reference/errors/:path*",
        permanent: false,
      },
      {
        source: "/orm/reference/preview-features/:path*",
        destination: "/orm/v7/reference/preview-features/:path*",
        permanent: false,
      },
      // Page-to-page: Prisma 7 getting-started pages with no Prisma 8 equivalent.
      {
        source: "/prisma-orm/quickstart/cockroachdb",
        destination: "/v7/prisma-orm/quickstart/cockroachdb",
        permanent: false,
      },
      {
        source: "/prisma-orm/quickstart/mysql",
        destination: "/v7/prisma-orm/quickstart/mysql",
        permanent: false,
      },
      {
        source: "/prisma-orm/quickstart/planetscale",
        destination: "/v7/prisma-orm/quickstart/planetscale",
        permanent: false,
      },
      {
        source: "/prisma-orm/quickstart/sql-server",
        destination: "/v7/prisma-orm/quickstart/sql-server",
        permanent: false,
      },
      {
        source: "/prisma-orm/quickstart/sqlite",
        destination: "/v7/prisma-orm/quickstart/sqlite",
        permanent: false,
      },
      {
        source: "/prisma-orm/add-to-existing-project/cockroachdb",
        destination: "/v7/prisma-orm/add-to-existing-project/cockroachdb",
        permanent: false,
      },
      {
        source: "/prisma-orm/add-to-existing-project/mysql",
        destination: "/v7/prisma-orm/add-to-existing-project/mysql",
        permanent: false,
      },
      {
        source: "/prisma-orm/add-to-existing-project/planetscale",
        destination: "/v7/prisma-orm/add-to-existing-project/planetscale",
        permanent: false,
      },
      {
        source: "/prisma-orm/add-to-existing-project/sql-server",
        destination: "/v7/prisma-orm/add-to-existing-project/sql-server",
        permanent: false,
      },
      {
        source: "/prisma-orm/add-to-existing-project/sqlite",
        destination: "/v7/prisma-orm/add-to-existing-project/sqlite",
        permanent: false,
      },
      // Page-to-page: the classic prisma CLI (Prisma 7).
      { source: "/cli/generate", destination: "/cli/v7/generate", permanent: false },
      { source: "/cli/validate", destination: "/cli/v7/validate", permanent: false },
      { source: "/cli/format", destination: "/cli/v7/format", permanent: false },
      { source: "/cli/studio", destination: "/cli/v7/studio", permanent: false },
      { source: "/cli/debug", destination: "/cli/v7/debug", permanent: false },
      { source: "/cli/version", destination: "/cli/v7/version", permanent: false },
      { source: "/cli/migrate/:path*", destination: "/cli/v7/migrate/:path*", permanent: false },
      { source: "/cli/dev/:path*", destination: "/cli/v7/dev/:path*", permanent: false },
      { source: "/cli/db/:path*", destination: "/cli/v7/db/:path*", permanent: false },
      { source: "/cli/console/:path*", destination: "/cli/v7/console/:path*", permanent: false },
      // ───────────────────────────────────────────────────────────────────────
    ];
  },
  async rewrites() {
    return [
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
