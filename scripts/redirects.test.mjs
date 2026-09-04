// Structural invariants for the redirect tables that ship in this repo.
//
// Two failure modes cost real crawl budget and, in one case, took a live URL
// down entirely:
//
//   * A loop. Next.js matches redirect sources case-insensitively, so an entry
//     whose source and destination differ only in case 308s to itself forever.
//     That is exactly what happened to
//     /blog/nestjs-prisma-authentication-7D056s1s0k3l.
//   * A chain. When a destination is itself the source of another redirect,
//     every visitor and crawler pays an extra hop. Each source should point at
//     the URL that answers.
//
// Run with `pnpm test:redirects`.

import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const ZONES = [
  { name: "site", dir: path.join(ROOT, "apps/site"), prefix: "" },
  { name: "docs", dir: path.join(ROOT, "apps/docs"), prefix: "/docs" },
  // The blog is here because the loop this test exists for lived in its table.
  { name: "blog", dir: path.join(ROOT, "apps/blog"), prefix: "/blog" },
];

/**
 * Loads a zone's table in a child process, from that app's own directory:
 * importing `next.config.mjs` runs `createMDX()`, which resolves
 * `source.config.ts` relative to the working directory.
 */
function loadZone(zone) {
  const stdout = execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts/load-redirects.mjs"), zone.name],
    { cwd: zone.dir, maxBuffer: 64 * 1024 * 1024 },
  ).toString();
  return JSON.parse(stdout).filter(
    (entry) =>
      // `has`/`missing` entries are gated on host, header or cookie, so they do
      // not apply to a plain request for that path and cannot form a chain
      // with an unconditional one.
      !entry.hasConditions &&
      typeof entry.source === "string" &&
      typeof entry.destination === "string" &&
      // A zone only governs paths under the prefix it serves on www.
      (zone.prefix === "" || entry.source.startsWith(zone.prefix)),
  );
}

/** Strips the query string and fragment; only the path takes part in matching. */
function pathOnly(value) {
  return String(value).split("#")[0].split("?")[0];
}

/** Same-site destinations become a path; anything off-site returns null. */
function toSitePath(destination) {
  if (destination.startsWith("/")) return pathOnly(destination);
  const match = /^https?:\/\/(?:www\.)?prisma\.io(\/[^\s]*)?$/i.exec(destination);
  return match ? pathOnly(match[1] ?? "/") : null;
}

/** Compiles a Next.js/Vercel source pattern into a matcher. */
function sourceMatcher(source) {
  const body = source
    .split("/")
    .map((segment) => {
      if (/^:[A-Za-z0-9_]+\*$/.test(segment)) return "(?:.*)";
      if (/^:[A-Za-z0-9_]+\+$/.test(segment)) return "(?:.+)";
      if (/^:[A-Za-z0-9_]+$/.test(segment)) return "(?:[^/]+)";
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  // `/a/:path*` also matches a bare `/a`.
  return new RegExp(`^${body.replace(/\/\(\?:\.\*\)$/, "(?:/.*)?")}$`);
}

for (const zone of ZONES) {
  const entries = loadZone(zone);

  test(`${zone.name}: redirect table is not empty`, () => {
    assert.ok(entries.length > 0, `no redirects loaded for ${zone.name}`);
  });

  test(`${zone.name}: no redirect points at itself`, () => {
    const loops = entries
      .filter((entry) => {
        const destination = toSitePath(entry.destination);
        if (destination === null) return false;
        // Next.js matches sources case-insensitively, so a case-only
        // difference is a loop, not a canonicalisation.
        return pathOnly(entry.source).toLowerCase() === destination.toLowerCase();
      })
      .map((entry) => `${entry.source} -> ${entry.destination} (${entry.layer})`);

    assert.deepEqual(loops, [], `redirect(s) that resolve to themselves:\n  ${loops.join("\n  ")}`);
  });

  test(`${zone.name}: no destination is the source of another redirect`, () => {
    const matchers = entries.map((entry) => ({ entry, regex: sourceMatcher(entry.source) }));

    const chains = [];
    for (const entry of entries) {
      const destination = toSitePath(entry.destination);
      if (destination === null) continue;

      const hit = matchers.find(
        (candidate) =>
          candidate.entry !== entry &&
          // A wildcard source that also matches its own destination prefix is
          // not a chain with itself.
          candidate.entry.source !== entry.source &&
          candidate.regex.test(destination),
      );
      if (hit) {
        chains.push(
          `${entry.source} -> ${entry.destination}, which is then matched by ${hit.entry.source} -> ${hit.entry.destination}`,
        );
      }
    }

    assert.deepEqual(chains, [], `redirect chain(s):\n  ${chains.join("\n  ")}`);
  });
}
