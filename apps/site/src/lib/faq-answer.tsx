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
 * Forms recognised:
 *
 *   `code`                   -> inline code chip
 *   [text](/path or https://...) -> link (`text` may itself contain `code`)
 *   ```lang fences           -> a `<pre data-language>` block (comparison FAQs)
 *
 * Both inline forms are escaped from the surrounding paragraph so the
 * renderer is a no-op for answers that do not use them. An answer with no
 * `[`, backtick, or fence returns a single string node.
 *
 * Markup choices match the preview the VP approved (see changes.diff):
 *   - links are internal `next/link` for site-relative paths, raw `<a>` for
 *     absolute URLs, same hover/underline treatment as other content links;
 *   - third-party (non-prisma.io) absolute URLs also get `target="_blank"`
 *     and `rel="nofollow noopener"`;
 *   - inline code uses the same `bg-muted` chip as other sections.
 */

const LINK_PATTERN = /\[((?:[^[\]\\`]|`[^`]*`)+)\]\((\/[^\s)]*|#[^\s)]+|https?:\/\/[^\s)]+)\)/g;
const CODE_PATTERN = /`([^`]+)`/g;
const FENCE_PATTERN = /```(\w*)\n([\s\S]*?)```/g;

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

function isPrismaHostedHref(href: string): boolean {
  try {
    const { hostname } = new URL(href);
    return hostname === "prisma.io" || hostname.endsWith(".prisma.io");
  } catch {
    return false;
  }
}

function renderInline(answer: string, keyPrefix: string): React.ReactNode {
  if (!answer.includes("[") && !answer.includes("`")) {
    return answer;
  }

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let index = 0;

  for (const match of answer.matchAll(LINK_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(...renderCode(answer.slice(lastIndex, start), `${keyPrefix}-t-${index}`));
    }

    const [, label, href] = match;
    const children = renderCode(label, `${keyPrefix}-l-${index}`);

    nodes.push(
      isInternalHref(href) ? (
        <Link key={`${keyPrefix}-link-${index}`} href={href} className={LINK_CLASS}>
          {children}
        </Link>
      ) : (
        <a
          key={`${keyPrefix}-link-${index}`}
          href={href}
          className={LINK_CLASS}
          {...(!isPrismaHostedHref(href) ? { target: "_blank", rel: "nofollow noopener" } : {})}
        >
          {children}
        </a>
      ),
    );

    index++;
    lastIndex = start + match[0].length;
  }

  if (lastIndex < answer.length) {
    nodes.push(...renderCode(answer.slice(lastIndex), `${keyPrefix}-t-${index}`));
  }

  return nodes.length === 1 ? nodes[0] : <>{nodes}</>;
}

function renderParagraphs(text: string, keyPrefix: string): React.ReactNode[] {
  return text
    .trim()
    .split(/\n\n+/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph, index) => (
      <p key={`${keyPrefix}-p-${index}`}>
        {renderInline(paragraph.trim(), `${keyPrefix}-${index}`)}
      </p>
    ));
}

export function renderFaqAnswer(answer: string): React.ReactNode {
  if (!answer.includes("```") && !answer.includes("\n\n")) {
    return renderInline(answer, "faq");
  }

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let index = 0;

  for (const match of answer.matchAll(FENCE_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(...renderParagraphs(answer.slice(lastIndex, start), `faq-${index}`));
    }
    const language = match[1] ?? "";
    const code = match[2].replace(/\n$/, "");
    nodes.push(
      <pre
        key={`faq-pre-${index}`}
        data-language={language}
        className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-[0.8125rem] leading-6"
      >
        <code>{code}</code>
      </pre>,
    );
    index++;
    lastIndex = start + match[0].length;
  }

  if (lastIndex < answer.length) {
    nodes.push(...renderParagraphs(answer.slice(lastIndex), `faq-${index}`));
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
    .replace(FENCE_PATTERN, (_match, lang: string, code: string) => ` ${lang} ${code} `)
    .replace(LINK_PATTERN, (_match, label: string) => label.replace(CODE_PATTERN, "$1"))
    .replace(CODE_PATTERN, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
