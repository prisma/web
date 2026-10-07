/**
 * Cleans a post's processed Markdown so an agent can read it on its own. The
 * `.md` rendition of a post and `llms-full.txt` both go through
 * `normalizePostMarkdown`.
 *
 * The processed Markdown from fumadocs-mdx has two problems once it leaves
 * the post page:
 *
 * - MDX components survive as JSX (`<CalloutContainer>`, `<Accordion
 *   title="…">`, `<CodeBlockTabs>`). Their children are indented, so with the
 *   tags simply dropped an FAQ answer would read as an indented code block.
 *   The components posts use become plain Markdown, and any other component is
 *   unwrapped with its children dedented.
 * - Links are written relative to the blog (`/some-post`), and the post page's
 *   `next/link` resolves them under `/blog`. An agent that fetched
 *   `/blog/some-post.md` resolves them against the site root instead and gets
 *   a 404, so root-relative links and images become absolute URLs.
 *
 * Fenced code and inline code are set aside before either step, so code
 * samples that show JSX or Markdown link syntax come out unchanged. The
 * protectors, the tag scanner and the callout format are adapted from
 * apps/docs/src/lib/llm-markdown.ts, which does the same for the docs.
 */
import { withBlogBasePath, withBlogBasePathForImageSrc } from "./url";

export type PostMarkdownContext = {
  /** The site origin, for example `https://www.prisma.io`. */
  baseUrl: string;
  /**
   * Every post slug. A root-relative link whose first segment is a post slug
   * points into the blog; any other unknown first segment is another part of
   * the site, such as `/docs` or `/pricing`.
   */
  postSlugs: ReadonlySet<string>;
};

/**
 * First path segments of the blog's own pages other than posts (see
 * `src/app`). A root-relative link that starts with one of these is a blog
 * link.
 */
const BLOG_ROUTE_SEGMENTS = new Set([
  "author",
  "llms",
  "llms-full.txt",
  "llms.txt",
  "page",
  "rss.xml",
  "series",
  "tag",
]);

function siteRoot(baseUrl: string) {
  return baseUrl.replace(/\/$/, "");
}

/**
 * The post slug a link segment names, in its canonical case and with any
 * `.md`/`.mdx` suffix kept, or undefined when no post has that slug. Matching
 * ignores case, like the post route's legacy-slug recovery.
 */
function findPostSegment(segment: string, postSlugs: ReadonlySet<string>) {
  const [, name = segment, extension = ""] = /^(.+?)(\.mdx?)?$/.exec(segment) ?? [];
  if (postSlugs.has(name)) return segment;

  const lowered = name.toLowerCase();
  for (const slug of postSlugs) {
    if (slug.toLowerCase() === lowered) return `${slug}${extension}`;
  }
  return undefined;
}

/**
 * The absolute URL for a link in a post. Root-relative links to posts and to
 * the blog's own pages get the `/blog` base path, as on the post page. Other
 * root-relative links (`/docs/...`, `/pricing`) belong to the rest of the site
 * and only get the origin. Absolute, protocol-relative, relative and
 * anchor-only links are returned as they are.
 */
export function resolvePostLink(href: string, context: PostMarkdownContext): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;

  const root = siteRoot(context.baseUrl);
  // An entity ends the path too: the processed Markdown sometimes encodes a
  // link's closing parenthesis as `&#x29;`.
  const splitAt = href.search(/[?#&]/);
  const pathname = splitAt === -1 ? href : href.slice(0, splitAt);
  const suffix = splitAt === -1 ? "" : href.slice(splitAt);
  const [first] = pathname.split("/").filter(Boolean);

  if (!first || first === "blog" || BLOG_ROUTE_SEGMENTS.has(first)) {
    return `${root}${withBlogBasePath(pathname)}${suffix}`;
  }

  const postSegment = findPostSegment(first, context.postSlugs);
  if (postSegment) {
    const rest = pathname.slice(first.length + 1);
    return `${root}${withBlogBasePath(`/${postSegment}${rest}`)}${suffix}`;
  }

  return `${root}${href}`;
}

/**
 * The absolute URL for an image in a post. Post images live under the blog
 * (`/<slug>/imgs/...`), and the post page prefixes every root-relative image
 * with `/blog`, so this does the same.
 */
export function resolvePostImage(src: string, context: PostMarkdownContext): string {
  if (!src.startsWith("/") || src.startsWith("//")) return src;
  return `${siteRoot(context.baseUrl)}${withBlogBasePathForImageSrc(src)}`;
}

// ---------------------------------------------------------------------------
// Protecting code
// ---------------------------------------------------------------------------

// Placeholder delimiter built from Unicode Private Use Area characters, which
// do not occur in post source, so a placeholder cannot collide with content.
const SENTINEL_DELIMITER = "\uE000\uE001";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createProtector(input: string, label: string) {
  let delimiter = SENTINEL_DELIMITER;
  while (input.includes(delimiter)) delimiter += "\uE000";

  const boundary = escapeRegExp(delimiter);
  const pattern = new RegExp(`${boundary}${label}_(\\d+)${boundary}`, "g");

  return {
    token: (index: number) => `${delimiter}${label}_${index}${delimiter}`,
    restore(value: string, blocks: readonly string[]) {
      return value.replace(pattern, (match, index: string) => blocks[Number(index)] ?? match);
    },
    restoreLines(value: string, replace: (index: number, linePrefix: string) => string) {
      const linePattern = new RegExp(`^(.*?)${boundary}${label}_(\\d+)${boundary}`, "gm");
      return value.replace(linePattern, (_match, prefix: string, index: string) =>
        replace(Number(index), prefix),
      );
    },
  };
}

/**
 * Replaces each fenced code block with a one-line placeholder that keeps the
 * fence's indentation. Line transforms applied to the placeholder (a dedent,
 * a `> ` prefix) are replayed on every line of the fence when it is restored.
 */
function protectFencedCode(markdown: string) {
  const blocks: { text: string; indent: string }[] = [];
  const protector = createProtector(markdown, "POST_FENCED_CODE");
  const protectedMarkdown = markdown.replace(
    /^([ \t]*)([`~]{3,})[^\n]*\n[\s\S]*?^\1\2\s*$/gm,
    (match, indent: string) => {
      const token = protector.token(blocks.length);
      blocks.push({ text: match, indent });
      return indent + token;
    },
  );

  return {
    markdown: protectedMarkdown,
    restore(value: string) {
      const restored = protector.restoreLines(value, (index, linePrefix) => {
        const block = blocks[index];
        if (!block) return linePrefix;
        // Only whitespace shifts and blockquote markers can be replayed; any
        // other prefix gets the block verbatim.
        if (!/^[>\s]*$/.test(linePrefix)) return linePrefix + block.text.slice(block.indent.length);
        const removable = Math.min(
          linePrefix.match(/[ \t]*$/)?.[0].length ?? 0,
          block.indent.length,
        );
        const removed = block.indent.length - removable;
        const prefix = linePrefix.slice(0, linePrefix.length - removable);
        return block.text
          .split("\n")
          .map((line) => {
            const leading = line.match(/^[ \t]*/)?.[0].length ?? 0;
            return prefix + line.slice(Math.min(removed, leading));
          })
          .join("\n");
      });
      return protector.restore(
        restored,
        blocks.map((block) => block.text),
      );
    },
  };
}

/** Replaces each single-line inline code span with a placeholder. */
function protectInlineCode(markdown: string) {
  const spans: string[] = [];
  const protector = createProtector(markdown, "POST_INLINE_CODE");
  const protectedMarkdown = markdown.replace(/(`+)[^\n]+?\1/g, (match) => {
    const token = protector.token(spans.length);
    spans.push(match);
    return token;
  });

  return {
    markdown: protectedMarkdown,
    restore: (value: string) => protector.restore(value, spans),
  };
}

/** Runs `transform` with fenced and inline code replaced by placeholders. */
function withCodeProtected(markdown: string, transform: (value: string) => string) {
  const fences = protectFencedCode(markdown);
  const inline = protectInlineCode(fences.markdown);
  return fences.restore(inline.restore(transform(inline.markdown)));
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function getAttribute(attrs: string, name: string) {
  const pattern = new RegExp(
    `(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{\\s*"([^"]*)"\\s*\\}|\\{\\s*'([^']*)'\\s*\\})`,
  );
  return attrs
    .match(pattern)
    ?.slice(1)
    .find((value) => value !== undefined);
}

function singleLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/** Drops leading and trailing blank lines and the indentation all lines share. */
function dedent(value: string) {
  const lines = value.replace(/^(?:[ \t]*\n)+|(?:\n[ \t]*)+$/g, "").split("\n");
  const indent = lines
    .filter((line) => line.trim().length > 0)
    .reduce((minimum, line) => Math.min(minimum, line.match(/^[ \t]*/)?.[0].length ?? 0), Infinity);

  return lines
    .map((line) => (Number.isFinite(indent) ? line.slice(indent) : line))
    .join("\n")
    .trimEnd();
}

function blockquote(text: string) {
  return text
    .split("\n")
    .map((line) => (line.trim() ? `> ${line}` : ">"))
    .join("\n");
}

/** Index of the `>` that closes the tag opened at `start`, skipping quoted and braced values. */
function findOpeningTagEnd(value: string, start: number) {
  let quote: string | undefined;
  let braceDepth = 0;

  for (let index = start; index < value.length; index++) {
    const char = value[index];
    if (quote) {
      if (char === quote && value[index - 1] !== "\\") quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === "{") braceDepth++;
    else if (char === "}" && braceDepth > 0) braceDepth--;
    else if (char === ">" && braceDepth === 0) return index;
  }

  return -1;
}

/**
 * Replaces every `<name …>…</name>` and `<name … />` with `format(attrs,
 * content)`. Content is `undefined` for a self-closing tag. An opening tag
 * without a closing tag is left alone. When the tag starts its line, the
 * replacement's later lines get the same indentation, so an enclosing
 * component still dedents its children evenly.
 */
function replaceComponent(
  markdown: string,
  name: string,
  format: (attrs: string, content: string | undefined) => string,
) {
  const opening = new RegExp(`<${name}(?![A-Za-z0-9])`, "g");
  const closingTag = `</${name}>`;
  let result = "";
  let cursor = 0;

  for (let match = opening.exec(markdown); match; match = opening.exec(markdown)) {
    const start = match.index;
    if (start < cursor) continue;

    const openingEnd = findOpeningTagEnd(markdown, start);
    if (openingEnd === -1) break;

    const openingTag = markdown.slice(start, openingEnd + 1);
    const attrs = openingTag
      .slice(name.length + 1)
      .replace(/\/?>$/, "")
      .trim();
    const selfClosing = openingTag.endsWith("/>");

    let content: string | undefined;
    let end = openingEnd + 1;
    if (!selfClosing) {
      const closingStart = markdown.indexOf(closingTag, end);
      if (closingStart === -1) continue;
      content = markdown.slice(end, closingStart);
      end = closingStart + closingTag.length;
    }

    const lineStart = markdown.lastIndexOf("\n", start - 1) + 1;
    const lineIndent = markdown.slice(lineStart, start);
    const indent = /^[ \t]*$/.test(lineIndent) ? lineIndent : "";
    const replacement = format(attrs, content)
      .split("\n")
      .map((line, index) => (index === 0 || !line ? line : indent + line))
      .join("\n");

    result += markdown.slice(cursor, start) + replacement;
    cursor = end;
    opening.lastIndex = end;
  }

  return result + markdown.slice(cursor);
}

const CALLOUT_LABELS: Record<string, string> = {
  danger: "CAUTION",
  error: "CAUTION",
  info: "NOTE",
  note: "NOTE",
  ppg: "NOTE",
  success: "TIP",
  tip: "TIP",
  warn: "WARNING",
  warning: "WARNING",
};

function formatCallout(attrs: string, content = "") {
  const label = CALLOUT_LABELS[(getAttribute(attrs, "type") ?? "").toLowerCase()] ?? "NOTE";
  const text = dedent(
    dedent(content)
      .replace(
        /<CalloutTitle>([\s\S]*?)<\/CalloutTitle>/g,
        (_match, title: string) => `**${singleLine(title)}**`,
      )
      .replace(/<CalloutDescription>([\s\S]*?)<\/CalloutDescription>/g, (_match, body: string) =>
        dedent(body),
      ),
  );
  return text ? blockquote(`[!${label}]\n${text}`) : "";
}

/** A titled section such as an FAQ entry: the title as a heading, then the body. */
function formatTitledSection(level: number, title: string | undefined, content = "") {
  const body = dedent(content);
  if (!title) return body;
  const heading = `${"#".repeat(level)} ${singleLine(title)}`;
  return body ? `${heading}\n\n${body}` : heading;
}

function formatQuote(attrs: string, content = "") {
  const speaker = getAttribute(attrs, "speakerName");
  const position = getAttribute(attrs, "position");
  const company = getAttribute(attrs, "companyName");
  const role = [position, company].filter(Boolean).join(" at ");
  const attribution = [speaker, role].filter(Boolean).join(", ");
  const quote = dedent(content);
  return blockquote(attribution ? `${quote}\n\n${attribution}` : quote);
}

function formatImage(attrs: string) {
  const src = getAttribute(attrs, "src");
  if (!src) return "";
  const alt = getAttribute(attrs, "alt") ?? getAttribute(attrs, "caption") ?? "";
  return `![${singleLine(alt)}](${src})`;
}

function formatYoutube(attrs: string) {
  const videoId = getAttribute(attrs, "videoId");
  if (!videoId) return "";
  const title = getAttribute(attrs, "title") ?? "Watch the video on YouTube";
  return `[${singleLine(title)}](https://www.youtube.com/watch?v=${videoId})`;
}

/** The same URL the post page links to when a tweet cannot be embedded. */
function tweetLink(tweetId: string) {
  return `[Post on X](https://x.com/i/status/${tweetId})`;
}

function formatTweets(attrs: string) {
  const ids = (getAttribute(attrs, "tweets") ?? "").match(/\d{6,}/g) ?? [];
  if (ids.length === 1) return tweetLink(ids[0]);
  return ids.map((id) => `- ${tweetLink(id)}`).join("\n");
}

function formatTweetColumns(attrs: string, content = "") {
  const tweetId = getAttribute(attrs, "tweetId");
  const body = dedent(content);
  if (!tweetId || !/^\d+$/.test(tweetId)) return body;
  return body ? `${body}\n\n${tweetLink(tweetId)}` : tweetLink(tweetId);
}

/** Turns `<a href="…">label</a>` into a Markdown link. */
function convertAnchors(value: string) {
  return value.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g, (_match, attrs: string, label: string) => {
    const href = getAttribute(attrs, "href");
    return href ? `[${singleLine(label)}](${href})` : singleLine(label);
  });
}

function formatLinkComponent(attrs: string, content = "") {
  const href = getAttribute(attrs, "href");
  const label = singleLine(dedent(content));
  return href ? `[${label || href}](${href})` : label;
}

function formatAgentPrompt(attrs: string) {
  const prompt = getAttribute(attrs, "prompt");
  const skill = getAttribute(attrs, "skill");
  const command = getAttribute(attrs, "terminalCommand");
  const parts: string[] = [];
  if (prompt) {
    const label = skill
      ? `Prompt for your coding agent (skill: ${skill})`
      : "Prompt for your coding agent";
    parts.push(blockquote(`${label}: ${singleLine(prompt)}`));
  }
  if (command) parts.push(`\`\`\`bash\n${command}\n\`\`\``);
  return parts.join("\n\n");
}

function formatMermaid(attrs: string) {
  const chart = getAttribute(attrs, "chart");
  return chart ? `\`\`\`mermaid\n${dedent(chart)}\n\`\`\`` : "";
}

function formatMeetup(attrs: string) {
  const title = getAttribute(attrs, "title");
  if (!title) return "";
  const link = getAttribute(attrs, "meetupLink");
  return `- ${link ? `[${singleLine(title)}](${link})` : singleLine(title)}`;
}

function formatEmployee(attrs: string) {
  const name = getAttribute(attrs, "name");
  if (!name) return "";
  const title = getAttribute(attrs, "title");
  return `- **${singleLine(name)}**${title ? `, ${singleLine(title)}` : ""}`;
}

/** Unwraps any component without its own format: keeps the children, drops the tags. */
function unwrapRemainingComponents(markdown: string) {
  const names = new Set(
    Array.from(markdown.matchAll(/<([A-Z][A-Za-z0-9]*)/g), (match) => match[1]),
  );
  let result = markdown;
  for (const name of names) {
    result = replaceComponent(result, name, (_attrs, content) =>
      content === undefined ? "" : dedent(content),
    );
  }
  return result;
}

function flattenComponents(markdown: string) {
  let result = markdown.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // Tab lists only repeat the labels that each tab's heading carries.
  result = result.replace(/<(CodeBlockTabsList|TabsList)>[\s\S]*?<\/\1>/g, "");

  const formats: Array<[string, (attrs: string, content: string | undefined) => string]> = [
    ["CalloutContainer", formatCallout],
    [
      "Accordion",
      (attrs, content) => formatTitledSection(3, getAttribute(attrs, "title"), content),
    ],
    [
      "CodeBlockTab",
      (attrs, content) => formatTitledSection(4, getAttribute(attrs, "value"), content),
    ],
    ["Tab", (attrs, content) => formatTitledSection(4, getAttribute(attrs, "value"), content)],
    [
      "TabsContent",
      (attrs, content) => formatTitledSection(4, getAttribute(attrs, "value"), content),
    ],
    ["Step", (attrs, content) => formatTitledSection(3, getAttribute(attrs, "title"), content)],
    ["Quotes", formatQuote],
    ["Image", formatImage],
    ["img", formatImage],
    ["Youtube", formatYoutube],
    ["AutoplayYoutubeEmbed", formatYoutube],
    ["TweetEmbedComp", formatTweets],
    ["TweetColumns", formatTweetColumns],
    ["Button", (_attrs, content = "") => singleLine(convertAnchors(dedent(content)))],
    ["Link", formatLinkComponent],
    ["Hex", (attrs) => getAttribute(attrs, "label") ?? ""],
    ["AgentPrompt", formatAgentPrompt],
    ["Mermaid", formatMermaid],
    ["Meetup", formatMeetup],
    ["Employee", formatEmployee],
  ];

  for (const [name, format] of formats) {
    result = replaceComponent(result, name, format);
  }

  return unwrapRemainingComponents(result)
    .replace(/<\/[A-Z][A-Za-z0-9]*>/g, "")
    .replace(/^[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n");
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

function absolutizeLinks(markdown: string, context: PostMarkdownContext) {
  return (
    markdown
      // Images first: `![alt](/x)`, with one level of brackets allowed in the alt text.
      .replace(
        /(!\[(?:[^[\]\n]|\[[^[\]\n]*\])*\]\()(\/[^)\s]*)/g,
        (_match, head: string, src: string) => `${head}${resolvePostImage(src, context)}`,
      )
      // Inline links: `[text](/x)` and `[text](/x "title")`.
      .replace(
        /(\]\()(\/[^)\s]*)/g,
        (_match, head: string, href: string) => `${head}${resolvePostLink(href, context)}`,
      )
      // Reference definitions: `[id]: /x`.
      .replace(
        /^([ \t]*\[[^\]\n]+\]:[ \t]*)(\/\S*)/gm,
        (_match, head: string, href: string) => `${head}${resolvePostLink(href, context)}`,
      )
      // HTML left in the Markdown: `<a href="/x">`, `<video src="/x">`.
      .replace(
        /\b(href|src)=(["'])(\/[^"'\s]*)\2/g,
        (_match, name: string, quote: string, target: string) =>
          `${name}=${quote}${
            name === "src" ? resolvePostImage(target, context) : resolvePostLink(target, context)
          }${quote}`,
      )
  );
}

/**
 * A post's processed Markdown, with MDX components turned into Markdown and
 * root-relative links and images made absolute.
 */
export function normalizePostMarkdown(markdown: string, context: PostMarkdownContext): string {
  const flattened = withCodeProtected(markdown, flattenComponents);
  return withCodeProtected(flattened, (value) => absolutizeLinks(value, context)).trim();
}
