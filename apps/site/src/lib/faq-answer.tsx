import Link from "next/link";
import * as React from "react";

/**
 * Tiny inline-markup parser for FAQ answers.
 *
 * The product-page FAQ (ProductPageContent.faq) stores answers as plain
 * strings so one source feeds both the visible accordion and the FAQPage
 * JSON-LD on /postgres (see app/postgres/page.tsx and lib/structured-data.ts).
 * Richer syntax would mean JSX in a .ts content file plus a second plain-text
 * copy for the structured data, which is the drift the string shape avoids.
 *
 * Two forms are recognised, both deliberately minimal:
 *
 *   `code`                   -> inline code chip
 *   [text](/path or https://...) -> link (`text` may itself contain `code`)
 *
 * Both forms are escaped from the surrounding paragraph so the renderer is a
 * no-op for answers that do not use them (every page other than /postgres
 * today). An answer with no `[` and no backtick returns a single string node.
 *
 * Markup choices match the preview the VP approved (see changes.diff):
 *   - links are internal `next/link` for site-relative paths, raw `<a>` for
 *     absolute URLs, same hover/underline treatment as other content links;
 *   - inline code uses the same `bg-muted` chip as other sections.
 */

const LINK_PATTERN = /\[((?:[^[\]\\`]|`[^`]*`)+)\]\((\/[^\s)]*|https?:\/\/[^\s)]+)\)/g;
const CODE_PATTERN = /`([^`]+)`/g;

function renderCode(label: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let index = 0;

  for (const match of label.matchAll(CODE_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(label.slice(lastIndex, start));
    }
    nodes.push(
      <code
        key={`${keyPrefix}-code-${index++}`}
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
      >
        {match[1]}
      </code>,
    );
    lastIndex = start + match[0].length;
  }

  if (lastIndex < label.length) {
    nodes.push(label.slice(lastIndex));
  }
  return nodes;
}

const LINK_CLASS =
  "font-medium text-foreground underline underline-offset-4 decoration-black/20 transition-colors hover:decoration-black/60";

function isInternalHref(href: string): boolean {
  return href.startsWith("/");
}

export function renderFaqAnswer(answer: string): React.ReactNode {
  if (!answer.includes("[") && !answer.includes("`")) {
    return answer;
  }

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let index = 0;

  for (const match of answer.matchAll(LINK_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(...renderCode(answer.slice(lastIndex, start), `t-${index}`));
    }

    const [, label, href] = match;
    const children = renderCode(label, `l-${index}`);

    nodes.push(
      isInternalHref(href) ? (
        <Link key={`link-${index}`} href={href} className={LINK_CLASS}>
          {children}
        </Link>
      ) : (
        <a key={`link-${index}`} href={href} className={LINK_CLASS}>
          {children}
        </a>
      ),
    );

    index++;
    lastIndex = start + match[0].length;
  }

  if (lastIndex < answer.length) {
    nodes.push(...renderCode(answer.slice(lastIndex), `t-${index}`));
  }

  return <>{nodes}</>;
}

/**
 * Strip the inline markup to plain text for structured data and anywhere else
 * that needs a flat string. Mirrors `renderFaqAnswer` but keeps the link words
 * and the code content.
 */
export function stripFaqAnswerMarkup(answer: string): string {
  return answer
    .replace(LINK_PATTERN, (_match, label: string) => label.replace(CODE_PATTERN, "$1"))
    .replace(CODE_PATTERN, "$1");
}
