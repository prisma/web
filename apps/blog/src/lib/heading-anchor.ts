import React from "react";

/** Flattened text of a React node — used to derive heading ids and labels. */
export function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node))
    return extractText((node.props as { children?: React.ReactNode }).children);
  return "";
}

/** The slug a heading gets when its MDX did not provide an explicit id. */
export function headingAnchorId(children: React.ReactNode): string {
  return extractText(children)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Does this heading's content already contain a link?
 *
 * Headings are wrapped in a permalink anchor, which would nest an `<a>` inside
 * an `<a>` when the MDX heading itself contains a link — invalid HTML that
 * browsers recover from by splitting the anchors. MDX links do not always render
 * as a literal `a` element (the blog overrides `a` with fumadocs'
 * `createRelativeLink`), so anything carrying an `href` counts.
 */
export function containsLink(node: React.ReactNode): boolean {
  if (Array.isArray(node)) return node.some(containsLink);
  if (!React.isValidElement(node)) return false;

  const props = node.props as { href?: unknown; children?: React.ReactNode };
  if (node.type === "a" || typeof props.href === "string") return true;

  return containsLink(props.children);
}
