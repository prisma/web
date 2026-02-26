/**
 * Custom Node.js loader that stubs image file imports.
 * Prevents ERR_UNKNOWN_FILE_EXTENSION when fumadocs-mdx
 * resolves image references in MDX files.
 */

const imageExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.ico',
  '.bmp',
  '.avif',
]);

export function load(url, context, nextLoad) {
  const ext = new URL(url).pathname.match(/\.\w+$/)?.[0];
  if (ext && imageExtensions.has(ext)) {
    return {
      format: 'module',
      source: 'export default ""',
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
