import type * as PageTree from "fumadocs-core/page-tree";

export const LATEST_VERSION = "latest";
const NAMED_VERSIONS = ["v8", "v6"] as const;
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
const V8_GETTING_STARTED_ROOT = "/v8";
const LATEST_CLI_ROOT = "/cli";
const V8_CLI_ROOT = "/cli/v8";
const LATEST_GUIDES_ROOT = "/guides";
const V8_GUIDES_ROOT = "/guides/v8";
const V8_GETTING_STARTED_PATHS_BY_LATEST_PATH = new Map<string, string>([
  ["/", V8_GETTING_STARTED_ROOT],
  ["/getting-started", "/v8/getting-started"],
  ["/prisma-orm", V8_GETTING_STARTED_ROOT],
  ["/prisma-orm/quickstart/postgresql", "/v8/quickstart/postgresql"],
  ["/prisma-orm/quickstart/mongodb", "/v8/quickstart/mongodb"],
  ["/prisma-orm/add-to-existing-project/postgresql", "/v8/add-to-existing-project/postgresql"],
  ["/prisma-orm/add-to-existing-project/mongodb", "/v8/add-to-existing-project/mongodb"],
  ["/prisma-postgres", "/v8/prisma-postgres/quickstart/prisma-next"],
  ["/prisma-postgres/quickstart/prisma-orm", "/v8/prisma-postgres/quickstart/prisma-next"],
  [
    "/prisma-postgres/import-from-existing-database-postgresql",
    "/v8/prisma-postgres/import-from-existing-database-postgresql",
  ],
  [
    "/prisma-postgres/import-from-existing-database-mysql",
    "/v8/prisma-postgres/import-from-existing-database-mysql",
  ],
  ["/prisma-postgres/from-the-cli", "/v8/prisma-postgres/from-the-cli"],
]);
const LATEST_GETTING_STARTED_PATHS_BY_V8_PATH = new Map<string, string>([
  // Bare "/" redirects to /v8, so the Latest getting-started anchor is /getting-started.
  [V8_GETTING_STARTED_ROOT, "/getting-started"],
  ["/v8/getting-started", "/getting-started"],
  ["/v8/quickstart/postgresql", "/prisma-orm/quickstart/postgresql"],
  ["/v8/quickstart/mongodb", "/prisma-orm/quickstart/mongodb"],
  ["/v8/add-to-existing-project/postgresql", "/prisma-orm/add-to-existing-project/postgresql"],
  ["/v8/add-to-existing-project/mongodb", "/prisma-orm/add-to-existing-project/mongodb"],
  ["/v8/prisma-postgres/quickstart/prisma-next", "/prisma-postgres/quickstart/prisma-orm"],
  [
    "/v8/prisma-postgres/import-from-existing-database-postgresql",
    "/prisma-postgres/import-from-existing-database-postgresql",
  ],
  [
    "/v8/prisma-postgres/import-from-existing-database-mysql",
    "/prisma-postgres/import-from-existing-database-mysql",
  ],
  ["/v8/prisma-postgres/from-the-cli", "/prisma-postgres/from-the-cli"],
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

  if (version === "v8") {
    return "v8 (RC)";
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

function isV8GettingStartedPathname(pathname: string) {
  return pathname === V8_GETTING_STARTED_ROOT || pathname.startsWith(`${V8_GETTING_STARTED_ROOT}/`);
}

function getGettingStartedSwitchPathname(docsPathname: string, targetVersion: Version) {
  if (targetVersion === "v8") {
    return V8_GETTING_STARTED_PATHS_BY_LATEST_PATH.get(docsPathname) ?? V8_GETTING_STARTED_ROOT;
  }

  if (targetVersion === LATEST_VERSION) {
    return LATEST_GETTING_STARTED_PATHS_BY_V8_PATH.get(docsPathname) ?? "/getting-started";
  }

  return getVersionRoot(targetVersion);
}

function isLatestCliPathname(pathname: string) {
  return (
    pathname === LATEST_CLI_ROOT ||
    (pathname.startsWith(`${LATEST_CLI_ROOT}/`) && !isV8CliPathname(pathname))
  );
}

function isV8CliPathname(pathname: string) {
  return pathname === V8_CLI_ROOT || pathname.startsWith(`${V8_CLI_ROOT}/`);
}

function isLatestGuidesPathname(pathname: string) {
  return (
    pathname === LATEST_GUIDES_ROOT ||
    (pathname.startsWith(`${LATEST_GUIDES_ROOT}/`) && !isV8GuidesPathname(pathname))
  );
}

function isV8GuidesPathname(pathname: string) {
  return pathname === V8_GUIDES_ROOT || pathname.startsWith(`${V8_GUIDES_ROOT}/`);
}

function getGuidesSwitchPathname(
  docsPathname: string,
  targetVersion: Version,
  availablePathnames: Iterable<string>,
) {
  if (targetVersion !== LATEST_VERSION && targetVersion !== "v8") {
    return getVersionRoot(targetVersion);
  }

  const targetRoot = targetVersion === "v8" ? V8_GUIDES_ROOT : LATEST_GUIDES_ROOT;
  const currentRoot = isV8GuidesPathname(docsPathname) ? V8_GUIDES_ROOT : LATEST_GUIDES_ROOT;
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

  if (isV8GuidesPathname(docsPathname)) {
    return "v8";
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
  // The classic `prisma` CLI serves every pre-v8 version, so any non-v8 target
  // (Latest, v6, ...) stays in the CLI section on the latest tree instead of
  // jumping to that version's ORM docs.
  const targetRoot = targetVersion === "v8" ? V8_CLI_ROOT : LATEST_CLI_ROOT;
  const currentRoot = isV8CliPathname(docsPathname) ? V8_CLI_ROOT : LATEST_CLI_ROOT;
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

  if (isV8GettingStartedPathname(docsPathname)) {
    return "v8";
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

  if (isV8CliPathname(docsPathname)) {
    return "v8";
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
  const isV8DocsPathname =
    getGettingStartedVersionFromPathname(currentPathname) === "v8" ||
    getOrmVersionFromPathname(currentPathname) === "v8" ||
    getCliVersionFromPathname(currentPathname) === "v8" ||
    getGuidesVersionFromPathname(currentPathname) === "v8";

  // Bare "/" redirects to /v8, so route the Getting Started tab to the reachable
  // landing for the active version instead of the redirecting root.
  if (targetDocsPathname === "/") {
    return isV8DocsPathname ? V8_GETTING_STARTED_ROOT : "/getting-started";
  }

  if (!isV8DocsPathname) {
    return targetPathname;
  }

  if (targetDocsPathname === "/orm") {
    return "/orm/v8";
  }

  if (targetDocsPathname === LATEST_CLI_ROOT) {
    return V8_CLI_ROOT;
  }

  if (targetDocsPathname === LATEST_GUIDES_ROOT) {
    return V8_GUIDES_ROOT;
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
