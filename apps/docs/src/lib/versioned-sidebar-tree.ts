import type * as PageTree from "fumadocs-core/page-tree";
import {
  LATEST_VERSION,
  getOrmVersionFromRoute,
  getOrmVersions,
  getVersionRoot,
  type Version,
} from "./version";

type TreeNode = {
  type?: string;
  name?: string;
  root?: boolean;
  index?: TreeNode;
  children?: TreeNode[];
  url?: string;
};

type TreeRootNode = TreeNode & {
  children: TreeNode[];
};

function isOrmNode(node: TreeNode) {
  return (
    node.type === "folder" &&
    (node.root === true || node.name === "ORM" || node.index?.url === "/orm")
  );
}

function isVersionNode(node: TreeNode, version: Version) {
  if (node.type !== "folder") {
    return false;
  }

  const name = String(node.name ?? "").toLowerCase();

  if (version === LATEST_VERSION) {
    return (
      name === LATEST_VERSION ||
      node.index?.url === `${getVersionRoot(LATEST_VERSION)}/latest` ||
      node.index?.url === getVersionRoot(LATEST_VERSION)
    );
  }

  return (
    name === version ||
    node.index?.url === getVersionRoot(version) ||
    node.index?.url === `/${version}/orm`
  );
}

function collapseVersionChildren(
  node: TreeRootNode,
  version: Version,
  explicitVersions: Version[],
): TreeRootNode {
  const selectedVersion = node.children.find((child) => isVersionNode(child, version));
  const hasVersionChildren = node.children.some((child) =>
    explicitVersions.some((explicitVersion) => isVersionNode(child, explicitVersion)),
  );

  if (!hasVersionChildren || !selectedVersion?.children) {
    return node;
  }

  return {
    ...node,
    index: selectedVersion.index ?? node.index,
    children: selectedVersion.children,
  };
}

function filterOrmSidebarTree(node: TreeNode, version: Version): TreeNode {
  const children = node.children?.map((child) => filterOrmSidebarTree(child, version));

  if (!children) {
    return node;
  }

  if (isOrmNode(node)) {
    const selectedVersion = children.find((child) => isVersionNode(child, version));

    if (selectedVersion?.children) {
      return {
        ...node,
        index: selectedVersion.index ?? node.index,
        children: selectedVersion.children,
      };
    }
  }

  return {
    ...node,
    children,
  };
}

export function getVersionedSidebarTree(tree: PageTree.Root, route?: string | string[]) {
  const versions = getOrmVersions(tree);
  const explicitVersions = versions.filter((version) => version !== LATEST_VERSION);
  const version = getOrmVersionFromRoute(route);

  if (!version || !versions.includes(version)) {
    return tree;
  }

  const rootTree = filterOrmSidebarTree(tree as TreeNode, version) as TreeRootNode;

  return collapseVersionChildren(rootTree, version, explicitVersions) as PageTree.Root;
}
