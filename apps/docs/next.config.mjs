import { withSentryConfig } from "@sentry/nextjs";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

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
    https://kit.fontawesome.com
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
    https://ka-f.fontawesome.com;

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
    https://*.hcaptcha.com;

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

  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: false,
        basePath: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ]
  },
  basePath: "/docs",
  assetPrefix: "/docs-static",
  allowedDevOrigins,
  reactStrictMode: true,
  images: { unoptimized: true },
  transpilePackages: ["@prisma-docs/eclipse"],
  experimental: {
    globalNotFound: true,
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

export default withSentryConfig(withMDX(config), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "prisma-ch",

  project: "javascript-nextjs",

  authToken: process.env.SENTRY_AUTH_TOKEN,
  tunnelRoute: "/monitoring",

  // Only print logs for uploading source maps in CI\
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
