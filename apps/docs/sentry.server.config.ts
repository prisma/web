// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e83ce4699e59051fdeaa330bf4a0dfb9@o4510879743737856.ingest.us.sentry.io/4510879744000000",

  // Sample 10% of server/edge transactions. Tracing every docs request added
  // measurable per-request work to a zone that serves prerendered HTML, and the
  // September 2026 SEO audit flagged 660 URLs over the crawler's TTFB
  // threshold. 0.1 keeps the volume statistically useful; raise it temporarily
  // (or switch to `tracesSampler`) when chasing a specific regression.
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
