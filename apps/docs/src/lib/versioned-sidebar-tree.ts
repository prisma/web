import type * as PageTree from "fumadocs-core/page-tree";
import {
  LATEST_VERSION,
  getCliVersionFromPathname,
  getGettingStartedVersionFromPathname,
  getGuidesVersionFromPathname,
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
    (node.name === "ORM" || node.index?.url === "/orm" || node.index?.url?.startsWith("/orm/"))
  );
}

function isGettingStartedNode(node: TreeNode) {
  return node.type === "folder" && (node.name === "Getting Started" || node.index?.url === "/");
}

function isCliNode(node: TreeNode) {
  return node.type === "folder" && (node.name === "CLI" || node.index?.url === "/cli");
}

function isGuidesNode(node: TreeNode) {
  return node.type === "folder" && (node.name === "Guides" || node.index?.url === "/guides");
}

function isGettingStartedVersionNode(node: TreeNode, version: Version) {
  if (node.type !== "folder") {
    return false;
  }

  const name = String(node.name ?? "").toLowerCase();

  if (version === "next") {
    return (
      name === "next" ||
      name === "prisma 8" ||
      name === "v8 (early access)" ||
      node.url === "/next" ||
      node.index?.url === "/next"
    );
  }

  return false;
}

function isCliVersionNode(node: TreeNode, version: Version) {
  if (node.type !== "folder") {
    return false;
  }

  const name = String(node.name ?? "").toLowerCase();

  if (version === "next") {
    return name === "next" || name === "v8 (early access)" || node.index?.url === "/cli/next";
  }

  return false;
}

function isGuidesVersionNode(node: TreeNode, version: Version) {
  if (node.type !== "folder") {
    return false;
  }

  const name = String(node.name ?? "").toLowerCase();

  if (version === "next") {
    return name === "next" || name === "v8 (early access)" || node.index?.url === "/guides/next";
  }

  return false;
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
    (version === "next" && name === "v8 (early access)") ||
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

function filterGettingStartedSidebarTree(node: TreeNode, version: Version): TreeNode {
  const children = node.children?.map((child) => filterGettingStartedSidebarTree(child, version));

  if (!children) {
    return node;
  }

  if (isGettingStartedNode(node)) {
    const versionChildren = children.filter((child) => isGettingStartedVersionNode(child, "next"));

    if (version === "next") {
      const selectedVersion = versionChildren.find((child) =>
        isGettingStartedVersionNode(child, version),
      );

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
      children: children.filter((child) => !versionChildren.includes(child)),
    };
  }

  return {
    ...node,
    children,
  };
}

function filterCliSidebarTree(node: TreeNode, version: Version): TreeNode {
  const children = node.children?.map((child) => filterCliSidebarTree(child, version));

  if (!children) {
    return node;
  }

  if (isCliNode(node)) {
    const versionChildren = children.filter((child) => isCliVersionNode(child, "next"));

    if (version === "next") {
      const selectedVersion = versionChildren.find((child) => isCliVersionNode(child, version));

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
      children: children.filter((child) => !versionChildren.includes(child)),
    };
  }

  return {
    ...node,
    children,
  };
}

function filterGuidesSidebarTree(node: TreeNode, version: Version): TreeNode {
  const children = node.children?.map((child) => filterGuidesSidebarTree(child, version));

  if (!children) {
    return node;
  }

  if (isGuidesNode(node)) {
    const versionChildren = children.filter((child) => isGuidesVersionNode(child, "next"));

    if (version === "next") {
      const selectedVersion = versionChildren.find((child) => isGuidesVersionNode(child, version));

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
      children: children.filter((child) => !versionChildren.includes(child)),
    };
  }

  return {
    ...node,
    children,
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

function findGettingStartedNode(node: TreeNode): TreeNode | null {
  if (isGettingStartedNode(node)) {
    return node;
  }

  for (const child of node.children ?? []) {
    const gettingStartedNode = findGettingStartedNode(child);
    if (gettingStartedNode) {
      return gettingStartedNode;
    }
  }

  return null;
}

function findCliNode(node: TreeNode): TreeNode | null {
  if (isCliNode(node)) {
    return node;
  }

  for (const child of node.children ?? []) {
    const cliNode = findCliNode(child);
    if (cliNode) {
      return cliNode;
    }
  }

  return null;
}

function getGettingStartedSidebarTree(tree: TreeRootNode, version: Version): TreeRootNode {
  const filteredTree = filterGettingStartedSidebarTree(tree, version) as TreeRootNode;

  if (isGettingStartedNode(filteredTree)) {
    return filteredTree;
  }

  const gettingStartedNode = findGettingStartedNode(filteredTree);

  if (!gettingStartedNode) {
    return filteredTree;
  }

  return {
    ...filteredTree,
    children: [gettingStartedNode],
  };
}

function findGuidesNode(node: TreeNode): TreeNode | null {
  if (isGuidesNode(node)) {
    return node;
  }

  for (const child of node.children ?? []) {
    const guidesNode = findGuidesNode(child);
    if (guidesNode) {
      return guidesNode;
    }
  }

  return null;
}

function getGuidesSidebarTree(tree: TreeRootNode, version: Version): TreeRootNode {
  const filteredTree = filterGuidesSidebarTree(tree, version) as TreeRootNode;

  if (isGuidesNode(filteredTree)) {
    return filteredTree;
  }

  const guidesNode = findGuidesNode(filteredTree);

  if (!guidesNode) {
    return filteredTree;
  }

  return {
    ...filteredTree,
    children: [guidesNode],
  };
}

function getCliSidebarTree(tree: TreeRootNode, version: Version): TreeRootNode {
  const filteredTree = filterCliSidebarTree(tree, version) as TreeRootNode;

  if (isCliNode(filteredTree)) {
    return filteredTree;
  }

  const cliNode = findCliNode(filteredTree);

  if (!cliNode) {
    return filteredTree;
  }

  return {
    ...filteredTree,
    children: [cliNode],
  };
}

export function getVersionedSidebarTree(tree: PageTree.Root, route?: string | string[]) {
  const gettingStartedVersion =
    typeof route === "string" ? getGettingStartedVersionFromPathname(route) : null;

  if (gettingStartedVersion) {
    return getGettingStartedSidebarTree(
      tree as TreeRootNode,
      gettingStartedVersion,
    ) as PageTree.Root;
  }

  const cliVersion = typeof route === "string" ? getCliVersionFromPathname(route) : null;

  if (cliVersion) {
    return getCliSidebarTree(tree as TreeRootNode, cliVersion) as PageTree.Root;
  }

  const guidesVersion = typeof route === "string" ? getGuidesVersionFromPathname(route) : null;

  if (guidesVersion) {
    return getGuidesSidebarTree(tree as TreeRootNode, guidesVersion) as PageTree.Root;
  }

  const versions = getOrmVersions(tree);
  const explicitVersions = versions.filter((version) => version !== LATEST_VERSION);
  const version = getOrmVersionFromRoute(route);

  if (!version || !versions.includes(version)) {
    return tree;
  }

  const rootTree = filterOrmSidebarTree(tree as TreeNode, version) as TreeRootNode;

  return collapseVersionChildren(rootTree, version, explicitVersions) as PageTree.Root;
}
