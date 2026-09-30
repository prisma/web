import type * as PageTree from "fumadocs-core/page-tree";
import type { LoaderPlugin } from "fumadocs-core/source";

/**
 * Adds the pages a meta.json names in `hiddenPages` to that folder, flagged
 * `hidden`. They are in the folder's section, so they keep its sidebar, but
 * `withoutHiddenPages` drops them from what the sidebar lists.
 */
export function hiddenPagesPlugin(): LoaderPlugin {
  let hiddenFiles = new Set<string>();

  return {
    name: "docs:hidden-pages",
    transformStorage({ storage }) {
      hiddenFiles = new Set();
      const files = storage.getFiles();

      for (const metaPath of files) {
        const meta = storage.read(metaPath);
        if (meta?.format !== "meta") continue;

        const { pages = ["..."], hiddenPages } = meta.data as {
          pages?: string[];
          hiddenPages?: string[];
        };
        if (!hiddenPages?.length) continue;

        const folder = metaPath.split("/").slice(0, -1).join("/");
        for (const item of hiddenPages) {
          const target = joinPath(folder, item);
          const file = files.find(
            (path) => storage.read(path)?.format === "page" && withoutExtension(path) === target,
          );
          if (!file) throw new Error(`${metaPath}: hiddenPages entry "${item}" is not a page`);
          hiddenFiles.add(file);
        }

        storage.write(metaPath, {
          ...meta,
          data: { ...meta.data, pages: [...pages, ...hiddenPages] },
        });
      }
    },
    transformPageTree: {
      file(node, file) {
        if (file && hiddenFiles.has(file)) Object.assign(node, { hidden: true });
        return node;
      },
    },
  };
}

export function withoutHiddenPages<T extends PageTree.Root | PageTree.Folder>(node: T): T {
  let changed = false;
  const children: PageTree.Node[] = [];

  for (const child of node.children) {
    if (child.type === "page" && isHidden(child)) {
      changed = true;
      continue;
    }

    const visible = child.type === "folder" ? withoutHiddenPages(child) : child;
    if (visible !== child) changed = true;
    children.push(visible);
  }

  return changed ? { ...node, children } : node;
}

function isHidden(node: PageTree.Item) {
  return (node as { hidden?: boolean }).hidden === true;
}

function joinPath(folder: string, item: string) {
  const segments = folder ? folder.split("/") : [];
  for (const segment of item.split("/")) {
    if (segment === "..") segments.pop();
    else if (segment && segment !== ".") segments.push(segment);
  }
  return segments.join("/");
}

function withoutExtension(path: string) {
  return path.replace(/\.[^/.]+$/, "");
}
