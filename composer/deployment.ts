import { pathToFileURL } from "node:url";

type Environment = Record<string, string | undefined>;

/** Validate names/settings only. Runtime integration values live in Console. */
export function deploymentPreflight(env: Environment) {
  if (env.WEB_REQUIRE_INTEGRATIONS === "1") {
    if (!env.COMPOSER_INTEGRATIONS?.split(",").some((name) => name.trim() === "mixedbread"))
      throw new Error(
        "Production requires COMPOSER_INTEGRATIONS=mixedbread (plus any other enabled integrations); provision MIXEDBREAD_API_KEY in Console first.",
      );
    if (!env.NEXT_PUBLIC_POSTHOG_KEY?.trim())
      throw new Error("Production requires NEXT_PUBLIC_POSTHOG_KEY at build time.");
  }
  if (env.WEB_PUBLIC_ORIGIN) {
    const url = new URL(env.WEB_PUBLIC_ORIGIN);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      throw new Error(
        "WEB_PUBLIC_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.",
      );
  }
  return cloudflareConfiguration(env);
}

export function cloudflareConfiguration(env: Environment) {
  const zone = env.CLOUDFLARE_ZONE_ID?.trim();
  const token = env.CLOUDFLARE_API_TOKEN?.trim();
  const configuredHosts = env.WEB_CLOUDFLARE_HOSTS?.trim();
  if (!zone && !token && !configuredHosts) return;
  if (!zone || !token || !configuredHosts || !/^[a-f0-9]{32}$/i.test(zone))
    throw new Error(
      "Configure CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN and WEB_CLOUDFLARE_HOSTS together, or leave all unset.",
    );
  const hosts = [...new Set(configuredHosts.split(",").map((host) => host.trim().toLowerCase()))];
  if (
    hosts.length > 100 ||
    hosts.some(
      (host) =>
        host.length > 253 ||
        !host.includes(".") ||
        host.split(".").some((part) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(part)),
    )
  )
    throw new Error(
      "WEB_CLOUDFLARE_HOSTS must contain explicit comma-separated DNS hostnames, without URLs, wildcards, ports or paths.",
    );
  return { zone, token, hosts };
}

/** Opt-in, hostname-scoped invalidation; never purge unrelated zone content. */
export async function purgeCloudflare(
  env: Environment,
  request: (url: string, init?: RequestInit) => Promise<Response> = fetch,
) {
  const config = cloudflareConfiguration(env);
  if (!config) return;
  const response = await request(
    `https://api.cloudflare.com/client/v4/zones/${config.zone}/purge_cache`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${config.token}`, "content-type": "application/json" },
      body: JSON.stringify({ hosts: config.hosts }),
      signal: AbortSignal.timeout(30_000),
    },
  );
  // Do not print response bodies or credentials in CI logs.
  if (!response.ok || !((await response.json()) as { success?: boolean }).success)
    throw new Error(
      `Cloudflare hostname purge failed (HTTP ${response.status}). Check token permissions and zone configuration.`,
    );
  console.log(`Cloudflare purge accepted for ${config.hosts.join(", ")}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] === "purge") await purgeCloudflare(process.env);
  else deploymentPreflight(process.env);
}
