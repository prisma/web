import {
  Children,
  cloneElement,
  createElement,
  Fragment,
  isValidElement,
  type ReactNode,
} from "react";

/**
 * Removes anchor elements from a TOC entry's title, keeping everything else.
 *
 * Fumadocs' `rehypeToc` copies a heading's rendered children verbatim into
 * `page.data.toc`, so a heading that contains a markdown link puts a real
 * `<a>` into the title. Rendering that inside the TOC's own anchor produced
 * two bugs (audit finding 1.4):
 *
 * 1. Nested anchors, which is invalid HTML — the browser closes the outer `<a>`
 *    early, so the TOC entry stops linking to its heading.
 * 2. The inner href is written for the docs app's own router (`/orm/v7/...`),
 *    but a raw `<a>` is resolved by the browser against www.prisma.io, where it
 *    is missing the `/docs` basePath and 404s.
 *
 * Only the `<a>` is unwrapped (its children stay). Other inline elements are
 * kept as they are: well over a thousand docs headings contain inline code,
 * and flattening the title to text would strip the `<code>` styling from every
 * one of their TOC entries. Headings should not contain links in the first
 * place, but this makes the components safe regardless of what content ships.
 */
export function stripTocLinks(title: ReactNode): ReactNode {
  if (title === null || title === undefined || typeof title === "boolean") return null;
  if (typeof title === "string" || typeof title === "number") return title;

  if (Array.isArray(title)) {
    return Children.map(title, stripTocLinks);
  }

  if (isValidElement<{ children?: ReactNode }>(title)) {
    const children = stripTocLinks(title.props.children);
    if (title.type === "a") {
      // Kept as a plain .ts file so Node's test runner can strip the types: no JSX.
      return createElement(Fragment, { key: title.key }, children);
    }
    if (title.props.children === undefined) return title;
    return cloneElement(title, undefined, children);
  }

  return null;
}
