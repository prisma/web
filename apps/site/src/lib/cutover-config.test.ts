import assert from "node:assert/strict";
import { test } from "node:test";
import { securityHeaders } from "../../../../packages/ui/security-headers.mjs";
import { POSTHOG_API_HOST } from "@prisma-docs/ui/lib/posthog-config";
type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
  has?: { type: string; value: string }[];
};
const config = (await import(new URL("../../next.config.mjs", import.meta.url).href)).default as {
  poweredByHeader: boolean;
  headers(): Promise<{ source: string; headers: { key: string; value: string }[] }[]>;
  redirects(): Promise<Redirect[]>;
};

test("the shared policy permits the pinned analytics host and observed consented collection endpoints", async () => {
  const headers = await config.headers();
  const policy = headers
    .find((rule) => rule.source === "/:path*")!
    .headers.find(({ key }) => key === "Content-Security-Policy")!.value;
  assert.equal(policy, securityHeaders.find(({ key }) => key === "Content-Security-Policy")!.value);
  const connect = policy.match(/connect-src[^;]+;/)![0];
  for (const host of [
    POSTHOG_API_HOST,
    "https://analytics.google.com",
    "https://ad.doubleclick.net",
    "https://ka-p.fontawesome.com",
  ])
    assert.ok(connect.includes(host), host);
  assert.equal(config.poweredByHeader, false);
});

test("dashboard-only canonical-host redirects are exported with their original statuses", async () => {
  const redirects = await config.redirects();
  for (const [host, source, destination, permanent] of [
    ["prisma.io", "/:path*", "https://www.prisma.io/:path*", true],
    ["docs.prisma.io", "/", "https://www.prisma.io/docs", true],
    ["blog.prisma.io", "/", "https://www.prisma.io/blog", false],
  ] as const) {
    const rule = redirects.find(
      (rule) =>
        rule.source === source &&
        rule.has?.some((condition) => condition.type === "host" && condition.value === host),
    );
    assert.equal(rule?.destination, destination);
    assert.equal(rule?.permanent, permanent);
  }
});
