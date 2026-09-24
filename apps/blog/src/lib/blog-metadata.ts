import { formatTag } from "./format";

export const BLOG_HOME_TITLE = "Prisma Blog | Articles & Updates | Prisma, ORMs, Databases";

export const BLOG_HOME_DESCRIPTION =
  "Stay up to date with the latest from Prisma. Guides, announcements, and articles about Prisma, ORMs, databases, and the data access layer.";

/**
 * Title for a paginated listing page.
 *
 * `<label> — <BLOG_HOME_TITLE>` is the convention every other listing route in
 * this app already uses (author, series, series index), so the archive reads
 * consistently in a result list.
 */
export function blogPageTitle(page: number): string {
  return `Page ${page} — ${BLOG_HOME_TITLE}`;
}

/** Title for a tag listing, optionally a page of one. */
export function blogTagTitle(tag: string, page = 1): string {
  const label = `${formatTag(tag)} posts`;
  return page > 1 ? `${label}, page ${page} — ${BLOG_HOME_TITLE}` : `${label} — ${BLOG_HOME_TITLE}`;
}

/** Description for a tag listing. */
export function blogTagDescription(tag: string): string {
  return `Articles tagged ${formatTag(tag)} on the Prisma blog: guides, announcements, and updates from the team building Prisma ORM and Prisma Postgres.`;
}
