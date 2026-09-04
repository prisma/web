// Loads the redirect tables that ship in this repo so tooling and tests can
// reason about them without duplicating the file layout.
//
// Two layers serve redirects for a zone, in this order:
//   1. `vercel.json` — applied by the platform, before the app is reached.
//      Sources and destinations are written as full site paths (`/docs/...`).
//   2. `next.config.mjs` `redirects()` — applied by the app. Sources and
//      destinations are relative to the app's `basePath`.
// Normalising layer 2 onto layer 1's full-path form lets both be checked as
// one table, which is what a visitor actually experiences.

import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

async function loadVercelRedirects(relPath) {
  const raw = await readFile(path.join(ROOT, relPath), "utf8");
  return JSON.parse(raw).redirects ?? [];
}

async function loadNextRedirects(relPath) {
  const mod = await import(pathToFileURL(path.join(ROOT, relPath)).href);
  const config = mod.default;
  if (typeof config?.redirects !== "function") return [];
  return await config.redirects();
}

function withBasePath(basePath, value) {
  if (typeof value !== "string" || !value.startsWith("/")) return value;
  if (!basePath) return value;
  return value === "/" ? basePath : `${basePath}${value}`;
}

/**
 * @returns {Promise<{zone: string, entries: Array<{source: string, destination: string, permanent: boolean|undefined, layer: string, hasConditions: boolean}>}>}
 */
export async function loadZone(zone) {
  const zones = {
    site: { basePath: "", vercel: "apps/site/vercel.json", next: "apps/site/next.config.mjs" },
    docs: { basePath: "/docs", vercel: "apps/docs/vercel.json", next: "apps/docs/next.config.mjs" },
    blog: { basePath: "/blog", vercel: null, next: "apps/blog/next.config.mjs" },
  };
  const spec = zones[zone];
  if (!spec) throw new Error(`unknown zone: ${zone}`);

  const entries = [];

  if (spec.vercel) {
    for (const entry of await loadVercelRedirects(spec.vercel)) {
      entries.push({
        source: entry.source,
        destination: entry.destination,
        permanent: entry.permanent,
        layer: spec.vercel,
        hasConditions: Boolean(entry.has || entry.missing),
      });
    }
  }

  for (const entry of await loadNextRedirects(spec.next)) {
    // `basePath: false` opts an entry out of the app prefix entirely.
    const basePath = entry.basePath === false ? "" : spec.basePath;
    entries.push({
      source: withBasePath(basePath, entry.source),
      destination: withBasePath(basePath, entry.destination),
      permanent: entry.permanent,
      layer: spec.next,
      // `has`/`missing` gate an entry on host, header, cookie or query, so it
      // does not apply to every request for that path.
      hasConditions: Boolean(entry.has || entry.missing),
    });
  }

  return { zone, entries };
}

/** Strips a path of its query string and fragment. */
export function pathOnly(value) {
  return String(value).split("#")[0].split("?")[0];
}

/** True when `value` targets somewhere on www.prisma.io (or is already a path). */
export function toSitePath(value) {
  if (typeof value !== "string") return null;
  if (value.startsWith("/")) return pathOnly(value);
  const match = /^https?:\/\/(?:www\.)?prisma\.io(\/[^\s]*)?$/i.exec(value);
  if (match) return pathOnly(match[1] ?? "/");
  return null;
}

/** Turns a Next.js/Vercel redirect source pattern into a matcher. */
export function sourceMatcher(source) {
  const escaped = String(source)
    .split("/")
    .map((segment) => {
      if (/^:[A-Za-z0-9_]+\*$/.test(segment)) return "(?:.*)";
      if (/^:[A-Za-z0-9_]+\+$/.test(segment)) return "(?:.+)";
      if (/^:[A-Za-z0-9_]+$/.test(segment)) return "(?:[^/]+)";
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  // `/a/:path*` must also match `/a` — the wildcard can consume the slash.
  const withOptionalTail = escaped.replace(/\/\(\?:\.\*\)$/, "(?:/.*)?");
  return new RegExp(`^${withOptionalTail}$`);
}
