import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { findCanonicalSlug } from "./slug-fallback.ts";

const SLUGS = [
  "nestjs-prisma-authentication-7D056s1s0k3l",
  "announcing-prisma-2-n0v98rzc8br1",
  "agents-md-for-databases",
];

test("recovers the canonical slug for an all-lowercase legacy link", () => {
  assert.equal(
    findCanonicalSlug("nestjs-prisma-authentication-7d056s1s0k3l", SLUGS),
    "nestjs-prisma-authentication-7D056s1s0k3l",
  );
});

test("recovers the canonical slug for an arbitrarily mis-cased link", () => {
  assert.equal(
    findCanonicalSlug("NestJS-Prisma-Authentication-7D056S1S0K3L", SLUGS),
    "nestjs-prisma-authentication-7D056s1s0k3l",
  );
});

test("never redirects a slug that exists verbatim (this is what looped)", () => {
  assert.equal(findCanonicalSlug("nestjs-prisma-authentication-7D056s1s0k3l", SLUGS), undefined);
  assert.equal(findCanonicalSlug("agents-md-for-databases", SLUGS), undefined);
});

test("returns undefined for a slug that does not exist in any casing", () => {
  assert.equal(findCanonicalSlug("no-such-post", SLUGS), undefined);
});

test("is a no-op on an empty corpus", () => {
  assert.equal(findCanonicalSlug("anything", []), undefined);
});

test("the recovered slug is never equal to the requested slug", () => {
  for (const requested of ["nestjs-prisma-authentication-7d056s1s0k3l", "AGENTS-MD-FOR-DATABASES"]) {
    const canonical = findCanonicalSlug(requested, SLUGS);
    assert.ok(canonical !== undefined, `expected a match for ${requested}`);
    assert.notEqual(canonical, requested);
  }
});
