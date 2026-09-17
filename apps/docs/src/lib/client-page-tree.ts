import type * as PageTree from "fumadocs-core/page-tree";

/**
 * The page tree the client actually needs.
 *
 * `source.pageTree` describes all 686 docs pages in every version, and the
 * whole thing crosses the server/client boundary once per page: `DocsLayout`
 * hands it to the client `TreeContextProvider`, so React serialises it into the
 * RSC flight payload of every prerendered docs document. Measured on
 * production (2026-09-14) that was 270 KB of JSON — 296 KB once escaped into
 * the `self.__next_f.push` strings — identical on all 686 pages, and roughly
 * half of the fixed overhead on a small page like `/docs/postgres/overview`.
 *
 * Most of it is never read on the client:
 *
 * - `$ref` (48.7 KB) is the source file/meta path. Only `findProjection` and
 *   `getFolderProjection` in `fumadocs-core` read it, via `useTabsGroups`,
 *   which this app does not use (the sidebar has its own drill-in nav).
 * - `description` (75.4 KB) had exactly one reader: the subtitle of the
 *   prev/next cards in `PageFooter`. Those two items are now resolved on the
 *   server (`getPageFooterItems`) and passed in as `footer.items`, with their
 *   descriptions intact, so nothing on screen changes.
 * - `"$undefined"` placeholders (29.5 KB) are what React emits for a key whose
 *   value is `undefined` (`description`, `icon`, `collapsible`, `defaultOpen`,
 *   `root`, `external`). Omitting the key reads back as `undefined` all the
 *   same.
 * - `$id` (46.2 KB) is a content path used purely as a React key
 *   (`sidebar.tsx`, `sidebar/page-tree.tsx`) and as the memo key in
 *   `TreeContextProvider`. Short sequential ids satisfy both.
 *
 * Everything else is copied through as-is — including fields added by
 * `loader` plugins and `icon`, which is a React element by the time it gets
 * here and must not be walked into. So this is a denylist, not an allowlist:
 * a future plugin field survives the trip.
 *
 * Result: 270,332 B → 84,036 B (-69%).
 *
 * Scoping the tree to the current section/version instead (option (a) of the
 * task) would get it to 1.6–46 KB, but the tree is passed from a shared server
 * layout that has no access to the pathname. Getting one would mean moving the
 * whole docs chrome down into `[[...slug]]`, which re-renders and re-sends that
 * chrome on every soft navigation and every link prefetch. That trade belongs
 * to a human; see the pull request for the numbers.
 */

/** Read on the client, dropped here, restored where it is actually used. */
const DROPPED_KEYS = new Set(["$ref", "description"]);

/** Walked into rather than copied by reference. */
const CHILD_KEYS = new Set(["children", "index", "fallback"]);

type UnknownRecord = Record<string, unknown>;

function trimNode(node: UnknownRecord, nextId: () => string): UnknownRecord {
  const out: UnknownRecord = {};

  for (const [key, value] of Object.entries(node)) {
    if (DROPPED_KEYS.has(key)) continue;
    // React serialises an explicitly-undefined prop as the 12-byte string
    // "$undefined"; an absent key costs nothing and reads back the same.
    if (value === undefined) continue;

    if (key === "$id") {
      out.$id = nextId();
      continue;
    }

    if (!CHILD_KEYS.has(key)) {
      out[key] = value;
      continue;
    }

    if (Array.isArray(value)) {
      out[key] = value.map((child) => trimNode(child as UnknownRecord, nextId));
    } else if (value !== null && typeof value === "object") {
      out[key] = trimNode(value as UnknownRecord, nextId);
    } else {
      out[key] = value;
    }
  }

  return out;
}

/**
 * Deep-copy `tree` without the fields no client component reads. Pure: the
 * input is not mutated.
 */
export function trimPageTreeForClient(tree: PageTree.Root): PageTree.Root {
  let counter = 0;
  // Base 36 keeps the ids to 1–2 characters for a tree this size. They are
  // only ever React keys and a memo key, so uniqueness in document order is
  // the whole contract.
  const nextId = () => (counter++).toString(36);

  return trimNode(tree as unknown as UnknownRecord, nextId) as unknown as PageTree.Root;
}

const cache = new WeakMap<PageTree.Root, PageTree.Root>();

/**
 * The trimmed tree, memoised per source tree.
 *
 * Identity matters: the docs layout and the global `not-found` boundary both
 * render a `DocsLayout`, and React's flight serialiser only deduplicates
 * objects it sees by the same reference. Handing each of them a fresh copy
 * would put two trees in the payload instead of one.
 */
export function getClientPageTree(tree: PageTree.Root): PageTree.Root {
  let trimmed = cache.get(tree);
  if (!trimmed) {
    trimmed = trimPageTreeForClient(tree);
    cache.set(tree, trimmed);
  }
  return trimmed;
}
