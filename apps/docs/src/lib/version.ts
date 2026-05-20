import type * as PageTree from "fumadocs-core/page-tree";

export const LATEST_VERSION = "latest";
const NAMED_VERSIONS = ["next", 'v6'] as const;
export type Version = string;

type TreeNode = {
  type?: string;
  name?: string;
  root?: boolean;
  index?: {
    url?: string;
  };
  children?: TreeNode[];
};

const VERSION_SEGMENT_REGEX = /^v\d+$/i;
const LEGACY_ORM_VERSION_REGEX = /^\/(?<version>[a-z0-9-]+)\/orm(?:\/|$)/i;

function isOrmNode(node: TreeNode) {
  return (
    node.type === "folder" &&
    (node.root === true || node.name === "ORM" || node.index?.url === "/orm")
  );
}

function findOrmNode(node: TreeNode): TreeNode | null {
  if (isOrmNode(node)) {
    return node;
  }

  for (const child of node.children ?? []) {
    const ormNode = findOrmNode(child);
    if (ormNode) {
      return ormNode;
    }
  }

  return null;
}

function compareVersionsDescending(a: Version, b: Version) {
  const aNamedIndex = NAMED_VERSIONS.indexOf(a as (typeof NAMED_VERSIONS)[number]);
  const bNamedIndex = NAMED_VERSIONS.indexOf(b as (typeof NAMED_VERSIONS)[number]);

  if (aNamedIndex !== -1 || bNamedIndex !== -1) {
    if (aNamedIndex === -1) return 1;
    if (bNamedIndex === -1) return -1;
    return aNamedIndex - bNamedIndex;
  }

  const aNumber = Number.parseInt(a.slice(1), 10);
  const bNumber = Number.parseInt(b.slice(1), 10);

  if (Number.isNaN(aNumber) || Number.isNaN(bNumber) || aNumber === bNumber) {
    return b.localeCompare(a);
  }

  return bNumber - aNumber;
}

function getVersionFromNode(node: TreeNode): Version | null {
  if (node.type !== "folder") {
    return null;
  }

  const name = String(node.name ?? "").toLowerCase();
  if (isVersionSegment(name)) {
    return name;
  }

  const url = node.index?.url;
  if (!url) {
    return null;
  }

  const ormMatch = url.match(/^\/orm\/(?<version>[a-z0-9-]+)(?:\/|$)/i);
  if (ormMatch?.groups?.version && isVersionSegment(ormMatch.groups.version)) {
    return ormMatch.groups.version.toLowerCase();
  }

  const legacyMatch = url.match(LEGACY_ORM_VERSION_REGEX);
  if (legacyMatch?.groups?.version && isVersionSegment(legacyMatch.groups.version)) {
    return legacyMatch.groups.version.toLowerCase();
  }

  return null;
}

export function isVersionSegment(segment?: string | null): segment is Version {
  if (typeof segment !== "string") {
    return false;
  }

  const normalizedSegment = segment.toLowerCase();
  return (
    VERSION_SEGMENT_REGEX.test(normalizedSegment) ||
    NAMED_VERSIONS.includes(normalizedSegment as (typeof NAMED_VERSIONS)[number])
  );
}

export function getVersionLabel(version: Version) {
  if (version === LATEST_VERSION) {
    return "Latest";
  }

  if (version === "next") {
    return "Next";
  }
  if (version === "v6") {
    return "v6";
  }

  return version;
}

export function getVersionRoot(version: Version) {
  return version === LATEST_VERSION ? "/orm" : `/orm/${version}`;
}

export function getOrmVersionFromPathname(pathname: string): Version | null {
  const legacyMatch = pathname.match(LEGACY_ORM_VERSION_REGEX);
  if (legacyMatch?.groups?.version) {
    return legacyMatch.groups.version.toLowerCase();
  }

  if (pathname !== "/orm" && !pathname.startsWith("/orm/")) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const version = segments[1];

  return isVersionSegment(version) ? version.toLowerCase() : LATEST_VERSION;
}

export function getOrmVersionFromRoute(route?: string | string[]): Version | null {
  if (Array.isArray(route)) {
    if (route[0] !== "orm") {
      return null;
    }

    return isVersionSegment(route[1]) ? route[1].toLowerCase() : LATEST_VERSION;
  }

  if (typeof route === "string") {
    return getOrmVersionFromPathname(route);
  }

  return null;
}

export function getOrmVersions(tree: PageTree.Root): Version[] {
  const ormNode = findOrmNode(tree as TreeNode);
  const versions = new Set<Version>();

  for (const child of ormNode?.children ?? []) {
    const version = getVersionFromNode(child);
    if (version) {
      versions.add(version);
    }
  }

  return [LATEST_VERSION, "v6", ...Array.from(versions).sort(compareVersionsDescending)];
}
