/**
 * The Prisma Postgres Management API publishes its OpenAPI spec at
 * `https://api.prisma.io/v1/doc`. Scanners, agents, and API tooling look for it
 * at the conventional root filenames `/openapi.json` and `/swagger.json`, so we
 * re-serve the same document at those paths on www.prisma.io.
 *
 * The upstream document omits a top-level `servers` entry; we inject
 * `https://api.prisma.io` so a tool that reads the served copy knows where the
 * API actually lives (this mirrors what apps/docs does in src/lib/openapi.ts).
 */

/** Where the Management API publishes its own OpenAPI document. */
const SPEC_URL = "https://api.prisma.io/v1/doc";

/** Base URL injected as the spec's `servers[0].url`, which upstream omits. */
const API_SERVER = "https://api.prisma.io";

/**
 * Upper bound on the upstream call, so a hung api.prisma.io surfaces as the
 * 502 below instead of running into the platform's function timeout. apps/docs
 * uses 30s for the same fetch at build time; a request-path fetch gets less.
 */
const UPSTREAM_TIMEOUT_MS = 15_000;

/**
 * How long a fetched spec is reused before it is refetched, in seconds. Daily
 * is plenty: the document only changes when the Management API ships a change.
 * The `revalidate` export in each route handler must match this value (Next.js
 * requires that export to be a literal, so it cannot import this constant).
 */
export const SPEC_REVALIDATE_SECONDS = 86_400;

/**
 * Fetches the upstream OpenAPI document and injects the `servers` entry.
 * Throws when the upstream call fails, times out, or answers with a non-2xx
 * status; `openApiSpecResponse` turns that into a 502.
 */
export async function getOpenApiSpec(): Promise<Record<string, unknown>> {
  const res = await fetch(SPEC_URL, {
    headers: { "User-Agent": "prisma-www" },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    next: { revalidate: SPEC_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: HTTP ${res.status}`);
  }

  const doc = (await res.json()) as Record<string, unknown>;
  doc.servers = [{ url: API_SERVER }];
  return doc;
}

/**
 * Shared response builder for the /openapi.json and /swagger.json route
 * handlers: returns the spec as JSON, or a 502 if the upstream API is
 * unreachable (rather than a confusing 500 or an empty body).
 */
export async function openApiSpecResponse(): Promise<Response> {
  try {
    const spec = await getOpenApiSpec();
    return new Response(JSON.stringify(spec), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=${SPEC_REVALIDATE_SECONDS}, s-maxage=${SPEC_REVALIDATE_SECONDS}, stale-while-revalidate=${SPEC_REVALIDATE_SECONDS}`,
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "OpenAPI spec temporarily unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
