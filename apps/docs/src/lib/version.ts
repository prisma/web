import type * as PageTree from "fumadocs-core/page-tree";

export const LATEST_VERSION = "latest";
// Prisma 8 is the unversioned "Latest" tree. Prisma 7 and Prisma 6 live under
// explicit version segments (/orm/v7, /orm/v6, /v7, /cli/v7, /guides/v7).
const NAMED_VERSIONS = ["v7", "v6"] as const;
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
const DOCS_PREFIX = "/docs";
const V7_GETTING_STARTED_ROOT = "/v7";
const LATEST_GETTING_STARTED_ROOT = "/getting-started";
const V7_GETTING_STARTED_PAGE = "/v7/getting-started";
const LATEST_CLI_ROOT = "/cli";
const V7_CLI_ROOT = "/cli/v7";
const LATEST_GUIDES_ROOT = "/guides";
const V7_GUIDES_ROOT = "/guides/v7";

function normalizePathname(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0] || "/";
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

function withoutDocsPrefix(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === DOCS_PREFIX) {
    return "/";
  }

  if (normalizedPathname.startsWith(`${DOCS_PREFIX}/`)) {
    return normalizedPathname.slice(DOCS_PREFIX.length) || "/";
  }

  return normalizedPathname;
}

function isOrmNode(node: TreeNode) {
  return (
    node.type === "folder" &&
    (node.name === "ORM" || node.index?.url === "/orm" || node.index?.url?.startsWith("/orm/"))
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

  return version;
}

export function getVersionRoot(version: Version) {
  return version === LATEST_VERSION ? "/orm" : `/orm/${version}`;
}

function getAvailablePathnameSet(availablePathnames: Iterable<string>) {
  const available = new Set<string>();

  for (const pathname of availablePathnames) {
    available.add(withoutDocsPrefix(pathname));
  }

  return available;
}

function isLatestGettingStartedPathname(pathname: string) {
  return (
    pathname === "/" ||
    pathname === LATEST_GETTING_STARTED_ROOT ||
    pathname === "/prisma-orm" ||
    pathname.startsWith("/prisma-orm/") ||
    pathname === "/prisma-postgres" ||
    pathname.startsWith("/prisma-postgres/")
  );
}

function isV7GettingStartedPathname(pathname: string) {
  return pathname === V7_GETTING_STARTED_ROOT || pathname.startsWith(`${V7_GETTING_STARTED_ROOT}/`);
}

// The Prisma 7 getting-started tree mirrors the Latest one under /v7, so the
// switch is a prefix change, checked against the pages that actually exist.
function getGettingStartedSwitchPathname(
  docsPathname: string,
  targetVersion: Version,
  availablePathnames: Iterable<string>,
) {
  const available = getAvailablePathnameSet(availablePathnames);

  if (targetVersion === "v7") {
    if (isV7GettingStartedPathname(docsPathname)) {
      return docsPathname;
    }

    const candidate =
      docsPathname === "/" ? V7_GETTING_STARTED_PAGE : `${V7_GETTING_STARTED_ROOT}${docsPathname}`;

    return available.size === 0 || available.has(candidate) ? candidate : V7_GETTING_STARTED_PAGE;
  }

  if (targetVersion === LATEST_VERSION) {
    if (!isV7GettingStartedPathname(docsPathname)) {
      return docsPathname;
    }

    const candidate =
      docsPathname === V7_GETTING_STARTED_ROOT
        ? LATEST_GETTING_STARTED_ROOT
        : docsPathname.slice(V7_GETTING_STARTED_ROOT.length);

    return available.size === 0 || available.has(candidate)
      ? candidate
      : LATEST_GETTING_STARTED_ROOT;
  }

  return getVersionRoot(targetVersion);
}

function isLatestCliPathname(pathname: string) {
  return (
    pathname === LATEST_CLI_ROOT ||
    (pathname.startsWith(`${LATEST_CLI_ROOT}/`) && !isV7CliPathname(pathname))
  );
}

function isV7CliPathname(pathname: string) {
  return pathname === V7_CLI_ROOT || pathname.startsWith(`${V7_CLI_ROOT}/`);
}

function isLatestGuidesPathname(pathname: string) {
  return (
    pathname === LATEST_GUIDES_ROOT ||
    (pathname.startsWith(`${LATEST_GUIDES_ROOT}/`) && !isV7GuidesPathname(pathname))
  );
}

function isV7GuidesPathname(pathname: string) {
  return pathname === V7_GUIDES_ROOT || pathname.startsWith(`${V7_GUIDES_ROOT}/`);
}

function getSectionSwitchPathname(
  docsPathname: string,
  targetVersion: Version,
  latestRoot: string,
  v7Root: string,
  isV7: (pathname: string) => boolean,
  availablePathnames: Iterable<string>,
) {
  if (targetVersion !== LATEST_VERSION && targetVersion !== "v7") {
    return getVersionRoot(targetVersion);
  }

  const targetRoot = targetVersion === "v7" ? v7Root : latestRoot;
  const currentRoot = isV7(docsPathname) ? v7Root : latestRoot;
  const suffix =
    docsPathname === currentRoot
      ? ""
      : docsPathname.startsWith(`${currentRoot}/`)
        ? docsPathname.slice(currentRoot.length)
        : "";
  const candidate = `${targetRoot}${suffix}`;
  const available = getAvailablePathnameSet(availablePathnames);

  if (available.size === 0 || available.has(candidate)) {
    return candidate;
  }

  return targetRoot;
}

export function getGettingStartedVersionFromPathname(pathname: string): Version | null {
  const docsPathname = withoutDocsPrefix(pathname);

  if (isV7GettingStartedPathname(docsPathname)) {
    return "v7";
  }

  if (isLatestGettingStartedPathname(docsPathname)) {
    return LATEST_VERSION;
  }

  return null;
}

export function isGettingStartedVersionPathname(pathname: string) {
  return getGettingStartedVersionFromPathname(pathname) !== null;
}

export function getCliVersionFromPathname(pathname: string): Version | null {
  const docsPathname = withoutDocsPrefix(pathname);

  if (isV7CliPathname(docsPathname)) {
    return "v7";
  }

  if (isLatestCliPathname(docsPathname)) {
    return LATEST_VERSION;
  }

  return null;
}

export function isCliVersionPathname(pathname: string) {
  return getCliVersionFromPathname(pathname) !== null;
}

export function getGuidesVersionFromPathname(pathname: string): Version | null {
  const docsPathname = withoutDocsPrefix(pathname);

  if (isV7GuidesPathname(docsPathname)) {
    return "v7";
  }

  if (isLatestGuidesPathname(docsPathname)) {
    return LATEST_VERSION;
  }

  return null;
}

export function isGuidesVersionPathname(pathname: string) {
  return getGuidesVersionFromPathname(pathname) !== null;
}

export function getOrmVersionFromPathname(pathname: string): Version | null {
  const docsPathname = withoutDocsPrefix(pathname);
  const legacyMatch = docsPathname.match(LEGACY_ORM_VERSION_REGEX);
  if (legacyMatch?.groups?.version) {
    return legacyMatch.groups.version.toLowerCase();
  }

  if (docsPathname !== "/orm" && !docsPathname.startsWith("/orm/")) {
    return null;
  }

  const segments = docsPathname.split("/").filter(Boolean);
  const version = segments[1];

  return isVersionSegment(version) ? version.toLowerCase() : LATEST_VERSION;
}

export function getVersionSwitchPathname(
  pathname: string,
  targetVersion: Version,
  availablePathnames: Iterable<string> = [],
) {
  const docsPathname = withoutDocsPrefix(pathname);
  const gettingStartedVersion = getGettingStartedVersionFromPathname(docsPathname);

  if (gettingStartedVersion) {
    return getGettingStartedSwitchPathname(docsPathname, targetVersion, availablePathnames);
  }

  const cliVersion = getCliVersionFromPathname(docsPathname);

  if (cliVersion) {
    return getSectionSwitchPathname(
      docsPathname,
      targetVersion,
      LATEST_CLI_ROOT,
      V7_CLI_ROOT,
      isV7CliPathname,
      availablePathnames,
    );
  }

  const guidesVersion = getGuidesVersionFromPathname(docsPathname);

  if (guidesVersion) {
    return getSectionSwitchPathname(
      docsPathname,
      targetVersion,
      LATEST_GUIDES_ROOT,
      V7_GUIDES_ROOT,
      isV7GuidesPathname,
      availablePathnames,
    );
  }

  const currentVersion = getOrmVersionFromPathname(docsPathname);
  const targetRoot = getVersionRoot(targetVersion);

  if (!currentVersion) {
    return targetRoot;
  }

  const currentRoot = getVersionRoot(currentVersion);
  const suffix =
    docsPathname === currentRoot
      ? ""
      : docsPathname.startsWith(`${currentRoot}/`)
        ? docsPathname.slice(currentRoot.length)
        : "";
  const candidate = `${targetRoot}${suffix}`;
  const available = getAvailablePathnameSet(availablePathnames);

  if (available.size === 0 || available.has(candidate)) {
    return candidate;
  }

  return targetRoot;
}

export function getVersionedNavPathname(targetPathname: string, currentPathname: string) {
  const targetDocsPathname = withoutDocsPrefix(targetPathname);
  const isV7DocsPathname =
    getGettingStartedVersionFromPathname(currentPathname) === "v7" ||
    getOrmVersionFromPathname(currentPathname) === "v7" ||
    getCliVersionFromPathname(currentPathname) === "v7" ||
    getGuidesVersionFromPathname(currentPathname) === "v7";

  // Route the Getting Started tab to the reachable landing for the active
  // version rather than the docs home, which is the product overview.
  if (targetDocsPathname === "/") {
    return isV7DocsPathname ? V7_GETTING_STARTED_PAGE : LATEST_GETTING_STARTED_ROOT;
  }

  if (!isV7DocsPathname) {
    return targetPathname;
  }

  if (targetDocsPathname === "/orm") {
    return "/orm/v7";
  }

  if (targetDocsPathname === LATEST_CLI_ROOT) {
    return V7_CLI_ROOT;
  }

  if (targetDocsPathname === LATEST_GUIDES_ROOT) {
    return V7_GUIDES_ROOT;
  }

  return targetPathname;
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
  const versions = new Set<Version>(NAMED_VERSIONS);

  for (const child of ormNode?.children ?? []) {
    const version = getVersionFromNode(child);
    if (version) {
      versions.add(version);
    }
  }

  return [LATEST_VERSION, ...Array.from(versions).sort(compareVersionsDescending)];
}
