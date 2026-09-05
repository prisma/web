/**
 * Loads the repository's redirect tables and states the invariants they must
 * hold. Shared by `scripts/redirect-tables.test.ts`.
 *
 * The tables live in five files across three apps, in two formats, and they
 * compose at runtime: Vercel applies `vercel.json` at the edge, then the
 * Next.js app applies its own `redirects()`. Reasoning about them one file at a
 * time is what let a loop (audit 1.1) and a set of chains (audit 1.2) through,
 * so everything here is normalised to a full www.prisma.io path first.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// @ts-expect-error Node's TypeScript runner requires the explicit extension.
import { parseNextRedirects } from "./fix-internal-links.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export interface RedirectRule {
  /** Path as served on www.prisma.io, i.e. with the app's basePath applied. */
  source: string;
  destination: string;
  /** Destination exactly as written in the config, without any basePath. */
  rawDestination: string;
  file: string;
}

/** Vercel `redirects` arrays. Their sources already carry any basePath. */
const VERCEL_TABLES = ["apps/site/vercel.json", "apps/docs/vercel.json"];

/** `redirects()` in a Next config; paths are relative to the app's basePath. */
const NEXT_TABLES: Array<[file: string, basePath: string]> = [
  ["apps/site/next.config.mjs", ""],
  ["apps/docs/next.config.mjs", "/docs"],
  ["apps/blog/next.config.mjs", "/blog"],
];

export function loadRedirectRules(): RedirectRule[] {
  const rules: RedirectRule[] = [];

  for (const file of VERCEL_TABLES) {
    const json = JSON.parse(readFileSync(path.join(repoRoot, file), "utf8")) as {
      redirects?: Array<{ source?: string; destination?: string }>;
    };
    for (const rule of json.redirects ?? []) {
      if (rule.source && rule.destination) {
        rules.push({
          source: rule.source,
          destination: rule.destination,
          rawDestination: rule.destination,
          file,
        });
      }
    }
  }

  for (const [file, basePath] of NEXT_TABLES) {
    for (const rule of parseNextRedirects(readFileSync(path.join(repoRoot, file), "utf8"))) {
      rules.push({
        source: `${basePath}${rule.source}`,
        destination: rule.destination.startsWith("http")
          ? rule.destination
          : `${basePath}${rule.destination}`,
        rawDestination: rule.destination,
        file,
      });
    }
  }

  return rules;
}

export function isPattern(value: string): boolean {
  return value.includes(":") && !value.startsWith("http");
}

/**
 * The www.prisma.io path a source or destination denotes, or `null` when it
 * points at another host and is therefore outside these tables.
 */
export function toSitePath(value: string): string | null {
  let url: URL;
  try {
    url = value.startsWith("http") ? new URL(value) : new URL(`https://www.prisma.io${value}`);
  } catch {
    return null;
  }
  if (url.hostname !== "www.prisma.io" && url.hostname !== "prisma.io") return null;

  const { pathname } = url;
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

/** True when a destination is written with a trailing slash. */
export function hasTrailingSlashDestination(destination: string): boolean {
  const withoutQuery = destination.split(/[?#]/, 1)[0];
  return withoutQuery.length > 1 && withoutQuery.endsWith("/");
}
