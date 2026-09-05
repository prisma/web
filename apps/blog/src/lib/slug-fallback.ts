/**
 * Case-insensitive slug recovery for blog posts.
 *
 * Some legacy post slugs carry a mixed-case suffix (for example
 * `nestjs-prisma-authentication-7D056s1s0k3l`). Old links and search results
 * still arrive all-lowercase, and the content loader is case-sensitive, so
 * those requests would 404.
 *
 * This cannot be solved with a `redirects()` entry in `next.config.mjs`:
 * Next.js compiles redirect sources with a case-INsensitive matcher, so a rule
 * whose source and destination differ only in case also matches its own
 * destination and 308-redirects to itself forever (audit finding 1.1).
 *
 * Instead the route resolves the canonical slug at request time and issues a
 * single permanent redirect. Kept as a pure function so it can be unit tested
 * without booting Next.js.
 */
export function findCanonicalSlug(
  requestedSlug: string,
  knownSlugs: readonly string[],
): string | undefined {
  // An exact match is served directly; never redirect a slug that exists.
  if (knownSlugs.includes(requestedSlug)) return undefined;

  const lowered = requestedSlug.toLowerCase();
  const match = knownSlugs.find((slug) => slug.toLowerCase() === lowered);

  // Guard against a no-op redirect (which would be a loop).
  if (!match || match === requestedSlug) return undefined;
  return match;
}
