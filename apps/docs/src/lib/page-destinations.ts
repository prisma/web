/**
 * Prompt links that hand a docs page to an external tool (the "Open in…" menu
 * in `components/page-actions.tsx`). Each points the tool at the page's
 * Markdown rendition. The formats follow each product's prompt URL and match
 * Clerk's live docs; Lovable's `autosubmit` is deliberately left off so
 * nothing runs before the reader has looked at the prompt.
 *
 * Kept free of React and icons so the formats are unit-tested
 * (`page-destinations.test.ts`).
 */

export type DestinationTool =
  | "chatgpt"
  | "claude"
  | "perplexity"
  | "cursor"
  | "zed"
  | "v0"
  | "bolt"
  | "lovable";

/**
 * The prompt every tool receives. `absoluteMarkdownUrl` must be absolute: the
 * tool fetches it from outside the site, so a bare path would be useless. The
 * page resolves it on the server (`getBaseUrl()`), so the links are right from
 * the first render rather than only after hydration.
 */
export function destinationPrompt(absoluteMarkdownUrl: string): string {
  return `Read ${absoluteMarkdownUrl}, I want to ask questions about it.`;
}

/** The hand-off URL for each tool, for the page at `absoluteMarkdownUrl`. */
export function destinationHrefs(absoluteMarkdownUrl: string): Record<DestinationTool, string> {
  const q = destinationPrompt(absoluteMarkdownUrl);
  const query = (key: string) => new URLSearchParams({ [key]: q }).toString();

  return {
    chatgpt: `https://chatgpt.com/?${new URLSearchParams({ hints: "search", q })}`,
    claude: `https://claude.ai/new?${query("q")}`,
    perplexity: `https://www.perplexity.ai/?${query("q")}`,
    cursor: `https://cursor.com/link/prompt?${query("text")}`,
    zed: `zed://agent?${query("prompt")}`,
    v0: `https://v0.app/chat?${query("q")}`,
    bolt: `https://bolt.new/?${query("prompt")}`,
    lovable: `https://lovable.dev/#prompt=${encodeURIComponent(q)}`,
  };
}
