import {
  getCliVersionFromPathname,
  getGettingStartedVersionFromPathname,
  getGuidesVersionFromPathname,
  getOrmVersionFromPathname,
  LATEST_VERSION,
  type Version,
} from "./version";

/**
 * The version a docs page belongs to, plus the human label used in metadata.
 *
 * Versions are content folders rather than a route segment (`/orm/v6/...`,
 * `/cli/v7/...`, `/guides/v7/...`, `/v7/...`), and the unversioned tree is the
 * latest release. Pages in a non-latest tree carry a label so their `<title>`,
 * meta description, markdown rendition, and H1 area say which version they
 * document — without that, a v6 page and its v7 twin are indistinguishable to
 * a search engine.
 */
export interface PageVersion {
  /** The version segment as it appears in the URL, e.g. `v6`. */
  version: Version;
  /** Human label, e.g. `Prisma ORM v6`. */
  label: string;
}

function isNamedVersion(version: Version | null): version is Version {
  return typeof version === "string" && version !== LATEST_VERSION;
}

/**
 * Returns the version of a docs page URL, or `null` for latest/unversioned
 * pages. Accepts URLs with or without the `/docs` base path.
 */
export function getPageVersion(pageUrl: string): PageVersion | null {
  const ormVersion = getOrmVersionFromPathname(pageUrl);
  if (isNamedVersion(ormVersion)) {
    return { version: ormVersion, label: `Prisma ORM ${ormVersion}` };
  }

  const cliVersion = getCliVersionFromPathname(pageUrl);
  if (isNamedVersion(cliVersion)) {
    return { version: cliVersion, label: `Prisma CLI ${cliVersion}` };
  }

  const guidesVersion = getGuidesVersionFromPathname(pageUrl);
  if (isNamedVersion(guidesVersion)) {
    return { version: guidesVersion, label: `Prisma ${guidesVersion.replace(/^v/i, "")}` };
  }

  const gettingStartedVersion = getGettingStartedVersionFromPathname(pageUrl);
  if (isNamedVersion(gettingStartedVersion)) {
    return {
      version: gettingStartedVersion,
      label: `Prisma ${gettingStartedVersion.replace(/^v/i, "")}`,
    };
  }

  return null;
}

/**
 * Convenience wrapper: the label only, or `null` on latest/unversioned pages.
 */
export function getPageVersionLabel(pageUrl: string): string | null {
  return getPageVersion(pageUrl)?.label ?? null;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * True when the text already names the version, so we do not append a label
 * that would read as a stutter ("Upgrade to Prisma ORM v7 (Prisma ORM v7)").
 * Three spellings count: the full label, the bare `v7` token, and the product
 * form without the `v` ("What is Prisma 7?", "Prisma ORM 6 overview").
 */
export function mentionsVersion(text: string, pageVersion: PageVersion): boolean {
  if (text.toLowerCase().includes(pageVersion.label.toLowerCase())) return true;
  const token = escapeRegExp(pageVersion.version);
  if (new RegExp(`(?<![a-z0-9])${token}(?![a-z0-9])`, "i").test(text)) return true;
  const number = escapeRegExp(pageVersion.version.replace(/^v/i, ""));
  // `Prisma 6.16` still names the 6 line; `Prisma 60` does not.
  return new RegExp(`\\bprisma(?:\\s+(?:orm|cli))?\\s+${number}(?![0-9])`, "i").test(text);
}

/**
 * `Supported databases` → `Supported databases (Prisma ORM v6)`.
 * Left untouched on latest pages and on titles that already say the version.
 */
export function withVersionTitle(title: string, pageVersion: PageVersion | null): string {
  if (!pageVersion) return title;
  const trimmed = title.trim();
  if (!trimmed || mentionsVersion(trimmed, pageVersion)) return title;
  return `${trimmed} (${pageVersion.label})`;
}

/**
 * Appends `Applies to <label>.` to a meta description. Left untouched on latest
 * pages and on descriptions that already say the version.
 */
export function withVersionDescription(
  description: string | undefined,
  pageVersion: PageVersion | null,
): string | undefined {
  if (!pageVersion || !description) return description;
  const trimmed = description.trim();
  if (!trimmed || mentionsVersion(trimmed, pageVersion)) return description;
  const separator = /[.!?]$/.test(trimmed) ? "" : ".";
  return `${trimmed}${separator} Applies to ${pageVersion.label}.`;
}
