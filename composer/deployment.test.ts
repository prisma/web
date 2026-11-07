import assert from "node:assert/strict";
import { test } from "node:test";
import { cloudflareConfiguration, deploymentPreflight, purgeCloudflare } from "./deployment.ts";

test("production cannot silently ship without search and analytics configuration", () => {
  assert.doesNotThrow(() => deploymentPreflight({}));
  assert.throws(() => deploymentPreflight({ WEB_REQUIRE_INTEGRATIONS: "1" }), /mixedbread/);
  assert.throws(
    () =>
      deploymentPreflight({ WEB_REQUIRE_INTEGRATIONS: "1", COMPOSER_INTEGRATIONS: "mixedbread" }),
    /POSTHOG/,
  );
  assert.doesNotThrow(() =>
    deploymentPreflight({
      WEB_REQUIRE_INTEGRATIONS: "1",
      COMPOSER_INTEGRATIONS: " mixedbread,brevo",
      NEXT_PUBLIC_POSTHOG_KEY: "public-test-key",
    }),
  );
});

test("purges require complete explicit host configuration and never purge everything", async () => {
  assert.equal(cloudflareConfiguration({}), undefined);
  for (const hosts of [
    "*",
    "https://www.prisma.io",
    "www.prisma.io/path",
    "www.prisma.io:443",
    "www.prisma.io,",
    "-invalid.example",
  ])
    assert.throws(() =>
      cloudflareConfiguration({
        CLOUDFLARE_ZONE_ID: "a".repeat(32),
        CLOUDFLARE_API_TOKEN: "test",
        WEB_CLOUDFLARE_HOSTS: hosts,
      }),
    );
  assert.throws(() => cloudflareConfiguration({ WEB_CLOUDFLARE_HOSTS: "www.prisma.io" }));
  const env = {
    CLOUDFLARE_ZONE_ID: "a".repeat(32),
    CLOUDFLARE_API_TOKEN: "test",
    WEB_CLOUDFLARE_HOSTS: "www.prisma.io,docs.prisma.io,www.prisma.io",
  };
  await purgeCloudflare(env, async (url, init) => {
    assert.match(String(url), /\/zones\/a{32}\/purge_cache$/);
    assert.deepEqual(JSON.parse(init!.body as string), {
      hosts: ["www.prisma.io", "docs.prisma.io"],
    });
    return Response.json({ success: true });
  });
  await assert.rejects(
    () => purgeCloudflare(env, async () => Response.json({ success: false })),
    /purge failed/,
  );
});
