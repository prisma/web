import { isValidElement, type ReactNode } from "react";

/**
 * Flattens a TOC item title to its text content.
 *
 * `page.data.toc` copies a heading's React children verbatim, so a heading that
 * contains a markdown link (`## Foo ([Bar](/orm/v7/...))`) hands the TOC an
 * `<a>` element. Rendering it inside `Primitive.TOCItem` — itself an `<a>` —
 * produces nested anchors, and the inner href bypasses the app's `/docs`
 * basePath, so it 404s on www.prisma.io. The TOC only ever needs the words.
 */
export function toPlainTitle(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toPlainTitle).join("");
  if (isValidElement(node)) {
    return toPlainTitle((node.props as { children?: ReactNode }).children);
  }
  return "";
}
