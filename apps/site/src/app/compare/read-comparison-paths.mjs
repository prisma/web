/**
 * Read comparison URLs from the comparisons registry source.
 *
 * next.config.mjs is plain JavaScript and cannot import that TypeScript
 * module. Slugs stay in the registry; agent-markdown.test.ts asserts this
 * reading matches COMPARISON_PATHS.
 */
export function readComparisonPaths(source) {
  const indexPath = source.match(
    /export const COMPARISON_INDEX = \{[\s\S]*?\bpath:\s*"([^"]+)"/,
  )?.[1];
  const comparisons = source.match(/export const COMPARISONS = \[([\s\S]*?)\n\] as const/)?.[1];
  const slugs = comparisons
    ? [...comparisons.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1])
    : [];

  if (!indexPath || slugs.length === 0) {
    throw new Error(
      "Could not read comparison paths from apps/site/src/app/compare/comparisons.ts",
    );
  }

  return [indexPath, ...slugs.map((slug) => `${indexPath}/${slug}`)];
}
