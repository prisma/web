// This public endpoint is part of our CSP and infrastructure configuration,
// not a deploy credential. An unset or stale build secret must not send the
// browser to the SDK default (us.i.posthog.com), which our CSP blocks.
export const POSTHOG_API_HOST = "https://proxyhog.prisma-data.net";
