import { searchPath } from "fumadocs-core/breadcrumb";
import { flattenTree } from "fumadocs-core/page-tree";
import type * as PageTree from "fumadocs-core/page-tree";
import { isActive } from "./urls";
import { getVersionedSidebarTree } from "./versioned-sidebar-tree";

export interface PageFooterItem {
  name: PageTree.Item["name"];
  description?: PageTree.Item["description"];
  url: string;
}

export interface PageFooterItems {
  previous?: PageFooterItem;
  next?: PageFooterItem;
}

/**
 * The `root` that `TreeContextProvider` would derive on the client for
 * `pathname`: the innermost `root: true` folder on the path to the page, or the
 * whole tree when the page is not inside one.
 *
 * Kept deliberately identical to `@fumadocs/base-ui`'s `TreeContextProvider`,
 * including the `fallback` lookup — the ORM v6 and v7 trees live in
 * `tree.fallback`, not in `tree.children`.
 */
function resolveTreeRoot(tree: PageTree.Root, pathname: string): PageTree.Root | PageTree.Folder {
  const path =
    searchPath(tree.children, pathname) ??
    (tree.fallback ? searchPath(tree.fallback.children, pathname) : null) ??
    [];

  return (
    (path.findLast((item) => item.type === "folder" && item.root) as PageTree.Folder | undefined) ??
    tree
  );
}

/**
 * Resolve the prev/next pages for `pathname` on the server.
 *
 * `PageFooter` used to do this on the client from the page tree in
 * `TreeContextProvider`, which is the only reason the tree had to carry a
 * `description` for all 686 pages (75 KB in the RSC payload of every page, to
 * render at most two subtitles). Doing it here keeps the subtitles and lets
 * `trimPageTreeForClient` drop the field.
 *
 * The ordering rules are the client's, unchanged: the version-scoped sidebar
 * tree for the active route, flattened, external links removed, neighbours of
 * the current page.
 */
export function getPageFooterItems(tree: PageTree.Root, pathname: string): PageFooterItems {
  const root = resolveTreeRoot(tree, pathname);
  const scoped = getVersionedSidebarTree(root as PageTree.Root, pathname);
  const list = flattenTree(scoped.children).filter((item) => !item.external);

  const index = list.findIndex((item) => isActive(item.url, pathname, false));
  if (index === -1) return {};

  const previous = list[index - 1];
  const next = list[index + 1];

  return {
    ...(previous && {
      previous: { name: previous.name, description: previous.description, url: previous.url },
    }),
    ...(next && { next: { name: next.name, description: next.description, url: next.url } }),
  };
}
