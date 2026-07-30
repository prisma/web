import type * as PageTree from "fumadocs-core/page-tree";

export const LATEST_VERSION = "latest";
const NAMED_VERSIONS = ["next", "v6"] as const;
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
const NEXT_GETTING_STARTED_ROOT = "/next";
const LATEST_CLI_ROOT = "/cli";
const NEXT_CLI_ROOT = "/cli/next";
const LATEST_GUIDES_ROOT = "/guides";
const NEXT_GUIDES_ROOT = "/guides/next";
const NEXT_GETTING_STARTED_PATHS_BY_LATEST_PATH = new Map<string, string>([
  ["/", NEXT_GETTING_STARTED_ROOT],
  ["/getting-started", "/next/getting-started"],
  ["/prisma-orm", NEXT_GETTING_STARTED_ROOT],
  ["/prisma-orm/quickstart/postgresql", "/next/quickstart/postgresql"],
  ["/prisma-orm/quickstart/mongodb", "/next/quickstart/mongodb"],
  ["/prisma-orm/add-to-existing-project/postgresql", "/next/add-to-existing-project/postgresql"],
  ["/prisma-orm/add-to-existing-project/mongodb", "/next/add-to-existing-project/mongodb"],
  ["/prisma-postgres", "/next/prisma-postgres/quickstart/prisma-next"],
  ["/prisma-postgres/quickstart/prisma-orm", "/next/prisma-postgres/quickstart/prisma-next"],
  [
    "/prisma-postgres/import-from-existing-database-postgresql",
    "/next/prisma-postgres/import-from-existing-database-postgresql",
  ],
  [
    "/prisma-postgres/import-from-existing-database-mysql",
    "/next/prisma-postgres/import-from-existing-database-mysql",
  ],
  ["/prisma-postgres/from-the-cli", "/next/prisma-postgres/from-the-cli"],
]);
const LATEST_GETTING_STARTED_PATHS_BY_NEXT_PATH = new Map<string, string>([
  // Bare "/" redirects to /next, so the Latest getting-started anchor is /getting-started.
  [NEXT_GETTING_STARTED_ROOT, "/getting-started"],
  ["/next/getting-started", "/getting-started"],
  ["/next/quickstart/postgresql", "/prisma-orm/quickstart/postgresql"],
  ["/next/quickstart/mongodb", "/prisma-orm/quickstart/mongodb"],
  ["/next/add-to-existing-project/postgresql", "/prisma-orm/add-to-existing-project/postgresql"],
  ["/next/add-to-existing-project/mongodb", "/prisma-orm/add-to-existing-project/mongodb"],
  ["/next/prisma-postgres/quickstart/prisma-next", "/prisma-postgres/quickstart/prisma-orm"],
  [
    "/next/prisma-postgres/import-from-existing-database-postgresql",
    "/prisma-postgres/import-from-existing-database-postgresql",
  ],
  [
    "/next/prisma-postgres/import-from-existing-database-mysql",
    "/prisma-postgres/import-from-existing-database-mysql",
  ],
  ["/next/prisma-postgres/from-the-cli", "/prisma-postgres/from-the-cli"],
]);

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

  if (version === "next") {
    return "v8 (Early Access)";
  }
  if (version === "v6") {
    return "v6";
  }

  return version;
}

export function getVersionRoot(version: Version) {
  return version === LATEST_VERSION ? "/orm" : `/orm/${version}`;
}

function isLatestGettingStartedPathname(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/getting-started" ||
    pathname === "/prisma-orm" ||
    pathname.startsWith("/prisma-orm/") ||
    pathname === "/prisma-postgres" ||
    pathname.startsWith("/prisma-postgres/")
  );
}

function isNextGettingStartedPathname(pathname: string) {
  return (
    pathname === NEXT_GETTING_STARTED_ROOT || pathname.startsWith(`${NEXT_GETTING_STARTED_ROOT}/`)
  );
}

function getGettingStartedSwitchPathname(docsPathname: string, targetVersion: Version) {
  if (targetVersion === "next") {
    return NEXT_GETTING_STARTED_PATHS_BY_LATEST_PATH.get(docsPathname) ?? NEXT_GETTING_STARTED_ROOT;
  }

  if (targetVersion === LATEST_VERSION) {
    return LATEST_GETTING_STARTED_PATHS_BY_NEXT_PATH.get(docsPathname) ?? "/getting-started";
  }

  return getVersionRoot(targetVersion);
}

function isLatestCliPathname(pathname: string) {
  return (
    pathname === LATEST_CLI_ROOT ||
    (pathname.startsWith(`${LATEST_CLI_ROOT}/`) && !isNextCliPathname(pathname))
  );
}

function isNextCliPathname(pathname: string) {
  return pathname === NEXT_CLI_ROOT || pathname.startsWith(`${NEXT_CLI_ROOT}/`);
}

function isLatestGuidesPathname(pathname: string) {
  return (
    pathname === LATEST_GUIDES_ROOT ||
    (pathname.startsWith(`${LATEST_GUIDES_ROOT}/`) && !isNextGuidesPathname(pathname))
  );
}

function isNextGuidesPathname(pathname: string) {
  return pathname === NEXT_GUIDES_ROOT || pathname.startsWith(`${NEXT_GUIDES_ROOT}/`);
}

function getGuidesSwitchPathname(
  docsPathname: string,
  targetVersion: Version,
  availablePathnames: Iterable<string>,
) {
  if (targetVersion !== LATEST_VERSION && targetVersion !== "next") {
    return getVersionRoot(targetVersion);
  }

  const targetRoot = targetVersion === "next" ? NEXT_GUIDES_ROOT : LATEST_GUIDES_ROOT;
  const currentRoot = isNextGuidesPathname(docsPathname) ? NEXT_GUIDES_ROOT : LATEST_GUIDES_ROOT;
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

export function getGuidesVersionFromPathname(pathname: string): Version | null {
  const docsPathname = withoutDocsPrefix(pathname);

  if (isNextGuidesPathname(docsPathname)) {
    return "next";
  }

  if (isLatestGuidesPathname(docsPathname)) {
    return LATEST_VERSION;
  }

  return null;
}

export function isGuidesVersionPathname(pathname: string) {
  return getGuidesVersionFromPathname(pathname) !== null;
}

function getAvailablePathnameSet(availablePathnames: Iterable<string>) {
  return new Set(
    Array.from(availablePathnames, (availablePathname) => withoutDocsPrefix(availablePathname)),
  );
}

function getCliSwitchPathname(
  docsPathname: string,
  targetVersion: Version,
  availablePathnames: Iterable<string>,
) {
  if (targetVersion !== LATEST_VERSION && targetVersion !== "next") {
    return getVersionRoot(targetVersion);
  }

  const targetRoot = targetVersion === "next" ? NEXT_CLI_ROOT : LATEST_CLI_ROOT;
  const currentRoot = isNextCliPathname(docsPathname) ? NEXT_CLI_ROOT : LATEST_CLI_ROOT;
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

  if (isNextGettingStartedPathname(docsPathname)) {
    return "next";
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

  if (isNextCliPathname(docsPathname)) {
    return "next";
  }

  if (isLatestCliPathname(docsPathname)) {
    return LATEST_VERSION;
  }

  return null;
}

export function isCliVersionPathname(pathname: string) {
  return getCliVersionFromPathname(pathname) !== null;
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
    return getGettingStartedSwitchPathname(docsPathname, targetVersion);
  }

  const cliVersion = getCliVersionFromPathname(docsPathname);

  if (cliVersion) {
    return getCliSwitchPathname(docsPathname, targetVersion, availablePathnames);
  }

  const guidesVersion = getGuidesVersionFromPathname(docsPathname);

  if (guidesVersion) {
    return getGuidesSwitchPathname(docsPathname, targetVersion, availablePathnames);
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
  const isNextDocsPathname =
    getGettingStartedVersionFromPathname(currentPathname) === "next" ||
    getOrmVersionFromPathname(currentPathname) === "next" ||
    getCliVersionFromPathname(currentPathname) === "next" ||
    getGuidesVersionFromPathname(currentPathname) === "next";

  // Bare "/" redirects to /next, so route the Getting Started tab to the reachable
  // landing for the active version instead of the redirecting root.
  if (targetDocsPathname === "/") {
    return isNextDocsPathname ? NEXT_GETTING_STARTED_ROOT : "/getting-started";
  }

  if (!isNextDocsPathname) {
    return targetPathname;
  }

  if (targetDocsPathname === "/orm") {
    return "/orm/next";
  }

  if (targetDocsPathname === LATEST_CLI_ROOT) {
    return NEXT_CLI_ROOT;
  }

  if (targetDocsPathname === LATEST_GUIDES_ROOT) {
    return NEXT_GUIDES_ROOT;
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
