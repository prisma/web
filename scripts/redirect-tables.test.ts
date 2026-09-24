/**
 * Invariants for the repository's redirect tables (audit findings 1.1 and 1.2).
 *
 * These are cheap properties that a human reading one file at a time cannot
 * check, because the tables compose across five files and two products: Vercel
 * applies `vercel.json` at the edge, then the Next.js app applies its own
 * `redirects()` on top, and a destination written in one file is frequently a
 * source in another.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  hasTrailingSlashDestination,
  isPattern,
  loadRedirectRules,
  toSitePath,
  // @ts-expect-error Node's TypeScript test runner requires the explicit extension.
} from "./redirect-tables.ts";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { parseNextRedirects } from "./fix-internal-links.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rules = loadRedirectRules();

/** Every literal (non-pattern) source, as a www.prisma.io path. */
function literalSources() {
  const map = new Map<string, (typeof rules)[number]>();
  for (const rule of rules) {
    if (isPattern(rule.source)) continue;
    const source = toSitePath(rule.source);
    if (source && !map.has(source)) map.set(source, rule);
  }
  return map;
}

test("the tables were actually loaded", () => {
  // Guards against a parser change silently reducing this suite to a no-op.
  assert.ok(rules.length > 1000, `expected the full tables, got ${rules.length} rules`);
});

test("no redirect points at its own source (no loops)", () => {
  const loops = rules
    .filter((rule) => {
      const source = toSitePath(rule.source);
      const destination = toSitePath(rule.destination);
      return source !== null && destination !== null && source.toLowerCase() === destination.toLowerCase();
    })
    .map((rule) => `${rule.file}: ${rule.source} -> ${rule.rawDestination}`);

  assert.deepEqual(
    loops,
    [],
    `Next.js matches redirect sources case-insensitively, so a rule that differs from its own destination only in case redirects forever:\n${loops.join("\n")}`,
  );
});

test("no destination is itself the source of another redirect (no chains)", () => {
  const sources = literalSources();

  const chains = rules
    .filter((rule) => {
      if (isPattern(rule.destination)) return false;
      const source = toSitePath(rule.source);
      const destination = toSitePath(rule.destination);
      if (destination === null) return false; // another host: terminal here
      if (source !== null && source.toLowerCase() === destination.toLowerCase()) return false;

      const next = sources.get(destination);
      if (!next) return false;
      // A rule whose source equals its destination is a no-op, not a hop.
      return toSitePath(next.source) !== toSitePath(next.destination);
    })
    .map((rule) => {
      const next = sources.get(toSitePath(rule.destination)!)!;
      return `${rule.file}: ${rule.source} -> ${rule.rawDestination} -> (${next.file}) ${next.rawDestination}`;
    });

  assert.deepEqual(
    chains,
    [],
    `each of these costs the crawler an extra round trip; point them at the final destination:\n${chains.join("\n")}`,
  );
});

test("no same-site destination ends in a slash", () => {
  // A trailing slash earns a second 308 from Next.js' own normalisation.
  // External destinations are left alone: the slash is part of their canonical
  // URL and we do not control the other host's normalisation.
  const offenders = rules
    .filter((rule) => toSitePath(rule.destination) !== null && hasTrailingSlashDestination(rule.rawDestination))
    .map((rule) => `${rule.file}: ${rule.source} -> ${rule.rawDestination}`);

  assert.deepEqual(offenders, [], offenders.join("\n"));
});

test("every /cli/* wildcard has an exact entry for its bare prefix", () => {
  // `:path*` matches the empty string, so `/cli/dev` used to land on
  // `/cli/v7/dev/` and pick up a trailing-slash redirect. `:path+` fixes that
  // but stops answering the bare prefix, so an exact entry must cover it.
  const docsConfig = readFileSync(path.join(repoRoot, "apps/docs/next.config.mjs"), "utf8");
  const docsRules = parseNextRedirects(docsConfig) as Array<{ source: string; destination: string }>;
  const exact = new Set(docsRules.filter((rule) => !isPattern(rule.source)).map((rule) => rule.source));

  const wildcards = docsRules.filter((rule) => /^\/cli\/[^:]+\/:path[*+]$/.test(rule.source));
  assert.ok(wildcards.length >= 4, `expected the /cli/* wildcards, found ${wildcards.length}`);

  const missing = wildcards
    .map((rule) => rule.source.replace(/\/:path[*+]$/, ""))
    .filter((prefix) => !exact.has(prefix));

  assert.deepEqual(missing, [], `no exact redirect answers these bare prefixes: ${missing.join(", ")}`);
});

test("the /cli/* wildcards require at least one segment", () => {
  const docsConfig = readFileSync(path.join(repoRoot, "apps/docs/next.config.mjs"), "utf8");
  const docsRules = parseNextRedirects(docsConfig) as Array<{ source: string; destination: string }>;

  const greedy = docsRules
    .filter((rule) => /^\/cli\/[^:]+\/:path\*$/.test(rule.source))
    .map((rule) => rule.source);

  assert.deepEqual(
    greedy,
    [],
    `:path* also matches the empty string and appends a trailing slash; use :path+ with an exact entry alongside it: ${greedy.join(", ")}`,
  );
});
