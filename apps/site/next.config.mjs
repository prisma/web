import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const DOCS_ORIGIN = process.env.NEXT_DOCS_ORIGIN || "https://docs.prisma.io";
const DOCS_ORIGIN_HOST = (() => {
  try {
    return new URL(DOCS_ORIGIN).hostname;
  } catch {
    return "docs.prisma.io";
  }
})();

const BLOG_ORIGIN = process.env.NEXT_BLOG_ORIGIN || "https://blog.prisma.io";
const BLOG_ORIGIN_HOST = (() => {
  try {
    return new URL(BLOG_ORIGIN).hostname;
  } catch {
    return "blog.prisma.io";
  }
})();

const imageRemoteHostnames = [
  "cdn.sanity.io",
  "prisma.io",
  "www.prisma.io",
  DOCS_ORIGIN_HOST,
  BLOG_ORIGIN_HOST,
];

if (
  process.env.NODE_ENV === "production" &&
  (!process.env.NEXT_DOCS_ORIGIN || !process.env.NEXT_BLOG_ORIGIN)
) {
  throw new Error(
    [
      !process.env.NEXT_DOCS_ORIGIN && "DOCS_ORIGIN is required in production",
      !process.env.NEXT_BLOG_ORIGIN && "BLOG_ORIGIN is required in production",
    ]
      .filter(Boolean)
      .join("; "),
  );
}

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
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
    https://*.fontawesome.com
    https://raw.githubusercontent.com
    https://hcaptcha.com
    https://*.hcaptcha.com;

  style-src 'self' 'unsafe-inline'
    https://fonts.googleapis.com
    https://cdn.tolt.io
    https://vercel.live
    https://proxyhog.prisma-data.net
    https://hcaptcha.com
    https://*.hcaptcha.com;

  font-src 'self' data:
    https://fonts.gstatic.com
    https://vercel.live https://assets.vercel.com
    https://*.fontawesome.com;

  img-src 'self' data:
    http://localhost:3002 http://127.0.0.1:3002
    https://www.prisma.io https://prisma.io
    https://cdn.sanity.io
    https://prisma.io
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
    https://*.meetupstatic.com
    https://www.prisma.io;

  connect-src 'self'
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
    https://ka-p.fontawesome.com;

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
];

const allowedDevOrigins = (
  process.env.ALLOWED_DEV_ORIGINS ?? "localhost,127.0.0.1,192.168.1.48"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const config = {
  reactCompiler: true,
  assetPrefix: "/site-static",
  allowedDevOrigins,
  reactStrictMode: true,
  images: {
    unoptimized: false,
    remotePatterns: imageRemoteHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
  transpilePackages: ["@prisma/eclipse"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "prisma.studio",
          },
        ],
        destination: "https://www.prisma.io/studio",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "prismagraphql.com",
          },
        ],
        destination: "https://www.prisma.io/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "prisma.sh",
          },
        ],
        destination: "https://www.prisma.io/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "jobs.prisma.io",
          },
        ],
        destination: "https://www.prisma.io/careers",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "careers.prisma.io",
          },
        ],
        destination: "https://www.prisma.io/careers",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "dataguide.prisma.io",
          },
        ],
        destination: "https://www.prisma.io/dataguide",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "slack.prisma.io",
          },
        ],
        destination: "https://pris.ly/discord",
        permanent: true,
      },
      {
        permanent: true,
        source: "/blog/introducing-graphql-playground-f1e0a018f05d",
        destination: "/blog/prisma-and-graphql-mfl5y2r7t49c",
      },
      {
        permanent: true,
        source: "/blog/introduction-to-databases-jmt9jwidtc2a",
        destination: "https://www.prisma.io/dataguide/intro/what-are-databases",
      },
      {
        permanent: true,
        source: "/blog/comparison-of-database-models-1iz9u29nwn37",
        destination:
          "https://www.prisma.io/dataguide/intro/comparing-database-types",
      },
      {
        permanent: true,
        source: "/blog/comparing-sql-query-builders-and-orms-dkuixe3aa5a2",
        destination:
          "https://www.prisma.io/dataguide/types/relational/comparing-sql-query-builders-and-orms",
      },
      {
        permanent: true,
        source: "/tutorials/postgres-why-choose-postgres-db08",
        destination:
          "https://www.prisma.io/dataguide/postgresql/benefits-of-postgresql",
      },
      {
        permanent: true,
        source: "/blog/ways-to-host-postgresql-w0xrhqqgp4zp",
        destination:
          "https://www.prisma.io/dataguide/postgresql/5-ways-to-host-postgresql",
      },
      {
        permanent: true,
        source: "/tutorials/postgres-connecting-to-databases-db05",
        destination:
          "https://www.prisma.io/dataguide/postgresql/connecting-to-postgresql-databases",
      },
      {
        permanent: true,
        source: "/tutorials/postgres-configuring-user-authentication-db06",
        destination:
          "https://www.prisma.io/dataguide/postgresql/configuring-user-authentication",
      },
      {
        permanent: true,
        source: "/tutorials/postgres-create-databases-and-tables-db01",
        destination:
          "https://www.prisma.io/dataguide/postgresql/create-and-delete-databases-and-tables",
      },
      {
        permanent: true,
        source: "/tutorials/postgres-introduction-to-data-types-db02",
        destination:
          "https://www.prisma.io/dataguide/postgresql/introduction-to-data-types",
      },
      {
        permanent: true,
        source:
          "/tutorials/postgres-introduction-to-column-and-table-constraints-db03",
        destination:
          "https://www.prisma.io/dataguide/postgresql/column-and-table-constraints",
      },
      {
        permanent: true,
        source: "/blog/modern-backend-1-tsjs1ps7kip1",
        destination:
          "/blog/backend-prisma-typescript-orm-with-postgresql-data-modeling-tsjs1ps7kip1",
      },
      {
        permanent: true,
        source: "/blog/modern-backend-2-dcba1ps7kip3",
        destination:
          "/blog/backend-prisma-typescript-orm-with-postgresql-rest-api-validation-dcba1ps7kip3",
      },
      {
        permanent: false,
        source: "/blog/prisma-the-complete-orm-inw24qjeawmb",
        destination:
          "https://www.prisma.io/docs/orm/overview/introduction/why-prisma",
      },
      {
        permanent: true,
        source: "/forum/:any*",
        destination: "https://v1.prisma.io/forum/:any*",
      },
      {
        permanent: true,
        source: "/tutorials/:any*",
        destination: "https://v1.prisma.io/tutorials/:any*",
      },
      {
        permanent: true,
        source: "/docs/1.:any*/:any2*",
        destination: "https://v1.prisma.io/docs/1.:any*/:any2*",
      },
      {
        permanent: true,
        source: "/admin",
        destination: "https://github.com/prisma/studio",
      },
      {
        permanent: true,
        source: "/with-db-microservices",
        destination: "https://www.prisma.io",
      },
      {
        permanent: true,
        source: "/with-graphql",
        destination: "/docs/understand-prisma/prisma-in-your-stack/graphql",
      },
      {
        permanent: true,
        source: "/with-rest",
        destination: "/docs/understand-prisma/prisma-in-your-stack/rest",
      },
      {
        permanent: true,
        source: "/client/client-javascript",
        destination: "/docs/reference/tools-and-interfaces/prisma-client/api",
      },
      {
        permanent: true,
        source: "/client/client-typescript",
        destination: "/docs/reference/tools-and-interfaces/prisma-client/api",
      },
      {
        permanent: true,
        source: "/client/client-go",
        destination: "https://github.com/prisma/prisma-client-go",
      },
      {
        permanent: true,
        source: "/features/bindings",
        destination: "/docs/understand-prisma/prisma-in-your-stack/graphql",
      },
      {
        permanent: true,
        source: "/features/data-modeling",
        destination: "/docs/understand-prisma/data-modeling",
      },
      {
        permanent: true,
        source: "/features/databases",
        destination: "/docs/more/supported-databases",
      },
      {
        permanent: true,
        source: "/features/graphql-api",
        destination: "/docs/understand-prisma/prisma-in-your-stack/graphql",
      },
      {
        permanent: true,
        source: "/features/query-engine",
        destination: "/docs/understand-prisma/prisma-in-your-stack/graphql",
      },
      {
        permanent: true,
        source: "/blog/prisma-admin-beta-pai5lah43soe",
        destination: "https://github.com/prisma/studio",
      },
      {
        permanent: true,
        source: "/blog/mongodb-preview-ow4wahkekaep",
        destination: "https://github.com/prisma/prisma/issues/1277",
      },
      {
        permanent: true,
        source: "/blog/heroku-integration-homihof6eifi",
        destination:
          "https://www.prisma.io/docs/orm/prisma-client/deployment/traditional/deploy-to-heroku",
      },
      {
        permanent: true,
        source: "/blog/prisma-now-supports-postgres-aad74ba479cb",
        destination:
          "https://www.prisma.io/docs/orm/overview/databases/postgresql",
      },
      {
        permanent: true,
        source:
          "/blog/introducing-prisma-cloud-a-graphql-database-platform-ed591baa8737",
        destination: "https://www.prisma.io/cloud",
      },
      {
        permanent: true,
        source: "/blog/introducing-prisma-1ff423fd629e",
        destination:
          "https://www.prisma.io/blog/announcing-prisma-2-n0v98rzc8br1",
      },
      {
        permanent: true,
        source: "/dataguide/postgresql/configuring-user-authentication",
        destination:
          "/dataguide/postgresql/authentication-and-authorization/configuring-user-authentication",
      },
      {
        permanent: true,
        source:
          "/dataguide/database-tools/top-nodejs-orms-query-builders-and-database-libraries-in-2020",
        destination:
          "/dataguide/database-tools/top-nodejs-orms-query-builders-and-database-libraries",
      },
      {
        source: "/dataplatform/:any*",
        destination: "/data-platform/:any*",
        permanent: true,
      },
      {
        source: "/data-platform/accelerate",
        destination: "/accelerate",
        permanent: true,
      },
      {
        source: "/data-platform/pulse",
        destination: "/pulse",
        permanent: true,
      },
      {
        source: "/data-platform/optimize",
        destination: "/optimize",
        permanent: true,
      },
      {
        source: "/data-platform",
        destination: "https://console.prisma.io",
        permanent: true,
      },
      {
        source: "/optimise",
        destination: "/optimize",
        permanent: true,
      },
      {
        source: "/prisma-enterprise",
        destination: "/enterprise",
        permanent: true,
      },
      {
        source: "/prisma-in-your-ecosystem",
        destination: "/stack",
        permanent: true,
      },
      {
        source: "/prisma-in-your-stack",
        destination: "/stack",
        permanent: true,
      },
      {
        source: "/jobs",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/cloud",
        destination: "https://app.prisma.io",
        permanent: true,
      },
      {
        source: "/mongodblaunch",
        destination: "/mongodb",
        permanent: true,
      },
      {
        source: "/mongodb-launch",
        destination: "/mongodb",
        permanent: true,
      },
      {
        source: "/turso",
        destination: "https://pris.ly/turso",
        permanent: false,
      },
      {
        source: "/ambassador",
        destination: "/partners",
        permanent: true,
      },
      {
        source: "/changelogs",
        destination: "/changelog",
        permanent: true,
      },
      {
        source: "/login",
        destination: "https://console.prisma.io/login",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "https://console.prisma.io/sign-up",
        permanent: true,
      },
      {
        source: "/pulse",
        destination: "/postgres",
        permanent: true,
      },
      {
        source: "/blog/prisma-studio-3rtf78dg99fe",
        destination: "/docs/orm/tools/prisma-studio",
        permanent: true,
      },
      {
        source: "/blog/fullstack-remix-prisma-mongodb-1-7D0BfTXBmB6r",
        destination: "/docs/guides/react-router-7",
        permanent: true,
      },
      {
        source: "/blog/series/fullstack-nextjs-and-graphql-md1tczpfz1",
        destination: "/docs/guides/nextjs",
        permanent: true,
      },
      {
        source: "/blog/performance-engineering-aeduv0rei0jk",
        destination: "/blog/optimize-now-generally-available",
        permanent: true,
      },
      {
        source: "/learn",
        destination: "/docs/guides",
        permanent: false,
      },
      {
        source: "/:path*", // Match all routes under playground.prisma.io
        has: [
          {
            type: "host",
            value: "playground.prisma.io",
          },
        ],
        destination: "https://prisma.io/playground", // Redirect everything to this URL
        permanent: false, // Use true for a 301 permanent redirect
      },
      {
        permanent: true,
        source: "/blog/build-a-video-processing-pipeline",
        destination: "https://www.prisma.io/docs/postgres",
      },
      {
        permanent: true,
        source:
          "/blog/build-real-time-durable-workflows-with-pulse-and-inngest",
        destination: "https://www.prisma.io/docs/postgres",
      },
      {
        permanent: true,
        source: "/blog/increased-security-static-ip-support-prisma-pulse",
        destination: "https://www.prisma.io/docs/postgres",
      },
      {
        permanent: true,
        source: "/blog/increased-security-static-ip-support-prisma-pulse",
        destination: "https://www.prisma.io/docs/postgres",
      },
      {
        permanent: true,
        source:
          "/blog/prisma-pulse-introducing-delivery-guarantees-for-database-change-events",
        destination: "https://www.prisma.io/docs/postgres",
      },
      {
        permanent: true,
        source: "/blog/introducing-pulse-jtu4UPC8ujy4",
        destination: "https://www.prisma.io/docs/postgres",
      },
      {
        permanent: true,
        source:
          "/blog/build-a-real-time-app-with-nextjs-socketio-and-prisma-postgres",
        destination: "https://www.prisma.io/docs/postgres",
      },
      {
        permanent: true,
        source: "/blog/prisma-pulse-in-general-availability",
        destination: "https://www.prisma.io/docs/postgres",
      },
      {
        permanent: false,
        source: "/affiliates",
        destination: "/",
      },
      {
        permanent: true,
        source: "/react-server-components",
        destination: "/react",
      },
      {
        permanent: false,
        source: "/partners/affiliates",
        destination: "/",
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sitemap",
          destination: "/sitemap-site.xml",
        },
        {
          source: "/sitemap-site",
          destination: "/sitemap-site.xml",
        },
        {
          source: "/:path*.mdx",
          destination: "/llms.mdx/:path*",
        },
        // subdomains
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "accelerate-speed-test.prisma.io",
            },
          ],
          destination: "https://accelerate-speed-test.vercel.app/:path*",
        },

        // Proxy canonical docs path to docs infrastructure
        {
          source: "/docs",
          destination: `${DOCS_ORIGIN}/docs`,
          missing: [{ type: "host", value: DOCS_ORIGIN_HOST }],
        },
        {
          source: "/docs/:any*",
          destination: `${DOCS_ORIGIN}/docs/:any*`,
          missing: [{ type: "host", value: DOCS_ORIGIN_HOST }],
        },
        {
          source: "/docs-static/:path*",
          destination: `${DOCS_ORIGIN}/docs-static/:path*`,
          missing: [{ type: "host", value: DOCS_ORIGIN_HOST }],
        },

        // Proxy canonical blog path to blog infrastructure
        {
          source: "/blog",
          destination: `${BLOG_ORIGIN}/blog`,
          missing: [{ type: "host", value: BLOG_ORIGIN_HOST }],
        },
        {
          source: "/blog/:any*",
          destination: `${BLOG_ORIGIN}/blog/:any*`,
          missing: [{ type: "host", value: BLOG_ORIGIN_HOST }],
        },
        {
          source: "/blog-static/:path*",
          destination: `${BLOG_ORIGIN}/blog-static/:path*`,
          missing: [{ type: "host", value: BLOG_ORIGIN_HOST }],
        },
      ],
      fallback: [
        // Files
        {
          source: "/ga.js",
          destination: "https://www.google-analytics.com/analytics.js",
        },
        {
          source: "/gastats.js",
          destination: "https://www.google-analytics.com/analytics.js",
        },

        // Pages
        // TODO We have a redirect for this above to /careers, so should probably be removed here?

        {
          source: "/dataguide/:any*",
          destination: "https://dataguide.vercel.app/dataguide/:any*",
        },
        // {
        //   source: "/rss.xml",
        //   destination: "https://prismablog.vercel.app/blog/rss.xml",
        // }
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withMDX(config);
