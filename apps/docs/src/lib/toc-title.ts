import { Children, isValidElement, type ReactNode } from "react";

/**
 * Flattens a TOC entry's title to its text content.
 *
 * Fumadocs copies a heading's React children verbatim into `page.data.toc`.
 * When a heading contains a markdown link the title therefore contains a real
 * `<a>` element, and rendering it inside the TOC's own anchor produced two
 * bugs (audit finding 1.4):
 *
 * 1. Nested anchors, which is invalid HTML — the browser closes the outer `<a>`
 *    early, so the TOC entry stops linking to its heading.
 * 2. The inner href is written for the docs app's own router (`/orm/v7/...`),
 *    but a raw `<a>` is resolved by the browser against www.prisma.io, where it
 *    is missing the `/docs` basePath and 404s.
 *
 * Rendering the title as plain text removes both. Headings should also not
 * contain links in the first place, but this makes the component safe
 * regardless of what content ships.
 */
export function flattenTocTitle(title: ReactNode): string {
  if (title === null || title === undefined || typeof title === "boolean") return "";
  if (typeof title === "string") return title;
  if (typeof title === "number") return String(title);

  if (Array.isArray(title)) {
    return Children.toArray(title).map(flattenTocTitle).join("");
  }

  if (isValidElement(title)) {
    const { children } = title.props as { children?: ReactNode };
    return flattenTocTitle(children);
  }

  return "";
}
