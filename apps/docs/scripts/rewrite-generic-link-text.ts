/**
 * Rewrites non-descriptive link text in the docs content (SEO audit item 3.3).
 *
 * "Learn more [here](/orm/v7/...)" tells neither a reader scanning the page nor
 * a crawler what sits at the other end of the link. This script finds anchors
 * whose text is exactly one of the generic phrases below and rewrites them so
 * the anchor names its destination, taking the name from the target page's
 * frontmatter `title` (or the target heading, when the link carries a
 * `#fragment`). Hrefs are never changed.
 *
 * External destinations have no frontmatter to read from, so each one needs an
 * entry in `EXTERNAL_NAMES`. Links whose destination cannot be named are
 * reported and left untouched — the script never guesses.
 *
 *   pnpm tsx ./scripts/rewrite-generic-link-text.ts [--check]
 *
 * `--check` reports what would change and exits non-zero if anything would.
 */
import { globSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { collectPageAnchors, maskCodeRegions } from "./lib/markdown-regions";

const CONTENT_ROOT = "content/docs";

/** Anchor text (case-insensitive, formatting stripped) that names no destination. */
const GENERIC_TEXTS = new Set([
  "here",
  "this",
  "this page",
  "this guide",
  "this link",
  "link",
  "docs",
  "documentation",
  "learn more",
  "read more",
  "click here",
  "more",
  "see here",
  "see more",
]);

/** Generic anchors that are a call to action rather than a placeholder noun. */
const CALL_TO_ACTION = new Set(["learn more", "read more", "see more", "more", "click here"]);

/**
 * Names for external destinations, keyed by URL or by URL prefix. Taken from
 * the destination page's own title or the site's name for the section linked.
 */
const EXTERNAL_NAMES: Record<string, string> = {
  "https://www.better-auth.com/docs/authentication/email-password":
    "email and password documentation",
  "https://pnpm.io/catalogs": "the pnpm catalogs documentation",
  "https://docs.solidjs.com/reference/basic-reactivity/create-resource#createresource":
    "SolidJS `createResource`",
  "https://docs.solidjs.com/reference/components/for": "SolidJS `<For>`",
  "https://docs.solidjs.com/reference/components/show": "SolidJS `<Show>`",
  "https://www.permit.io/blog/prisma-orm-data-filtering-with-rebac":
    "Permit.io's ReBAC filtering walkthrough",
  "https://github.com/prisma/prisma-examples/tree/latest/orm/nest": "the NestJS example on GitHub",
  "https://www.prisma.io/blog/prisma-schema-language-the-best-way-to-define-your-data":
    "the Prisma Schema Language blog post",
  "https://neon.tech/docs/introduction": "Neon's introduction docs",
  "https://neon.tech/docs/introduction/compute-lifecycle": "compute lifecycle",
  "https://planetscale.com/docs/tutorials/planetscale-serverless-driver#add-and-use-the-planetscale-serverless-driver-for-javascript-to-your-project":
    "the PlanetScale serverless driver tutorial",
  "https://www.sqlite.org/datatype3.html#boolean": "SQLite's boolean handling",
  "https://supabase.com/docs/guides/getting-started/architecture":
    "the Supabase architecture guide",
  "https://supabase.com/docs/guides/getting-started/features": "the Supabase feature overview",
  "https://supabase.com/partners/integrations/prisma": "Supabase's Prisma integration guide",
  "https://developers.cloudflare.com/pages/framework-guides/nextjs/ssr/get-started/":
    "Cloudflare Pages Next.js guide",
  "https://github.com/cloudflare/next-on-pages/issues/605": "`next-on-pages` issue #605",
  "https://github.com/cloudflare/workers-sdk/pull/2541#issuecomment-1954209855":
    "`workers-sdk` pull request #2541",
  "https://docs.deno.com/runtime/#install-deno": "installing Deno",
  "https://docs.deno.com/runtime/reference/vscode/": "the Deno VS Code extension",
  "https://medium.com/bip-xtech/a-practical-guide-to-surviving-aws-sam-d8ab141b3d25":
    "practical guide to surviving AWS SAM",
  "https://no-color.org/": "the NO_COLOR specification",
  "https://github.com/prisma/extension-read-replicas/issues/new":
    "the `prisma/extension-read-replicas` repository",
  "https://github.com/prisma/orm/blob/6.5.0/packages/client/src/generation/generateClient.ts#L556-L605":
    "the Prisma Client generator source",
  "https://github.com/prisma/prisma-engines/blob/main/psl/parser-database/src/names/reserved_model_names.rs#L44":
    "the Prisma engines source",
  "https://www.prisma.io/blog/why-prisma-orm-generates-code-into-node-modules-and-why-it-ll-change":
    "the blog post on generating into `node_modules`",
  "https://www.npmjs.com/package/@prisma/studio-core": "`@prisma/studio-core` on npm",
};

/** Words that already introduce the destination, so no connective is inserted. */
const PREPOSITIONS = new Set([
  "about",
  "across",
  "at",
  "by",
  "check",
  "explore",
  "for",
  "from",
  "in",
  "into",
  "of",
  "on",
  "read",
  "see",
  "through",
  "to",
  "under",
  "via",
  "visit",
  "with",
  "within",
]);

/** Determiners that already introduce the destination noun phrase. */
const DETERMINERS = new Set(["a", "an", "the", "their", "its", "our", "your", "his", "her"]);

/** Headings that read as instructions, so a call to action says "how to". */
const IMPERATIVE_HEADING =
  /^(add|adjust|apply|build|configure|connect|create|customize|define|delete|deploy|disable|enable|filter|generate|handle|install|manage|migrate|query|reduce|register|remove|send|set|setup|specify|update|upgrade|use|visualize|write)\b/i;

/** Names that keep their capital letter when a sentence continues into them. */
const PROPER_NOUNS =
  /^(prisma|postgres|postgresql|mysql|mongodb|sqlite|sql server|sql|microsoft|neon|turso|planetscale|supabase|cloudflare|vercel|deno|aws|github|gitlab|npm|next\.js|nuxt|nestjs|typescript|javascript|node|permit\.io|better auth|solidjs|pnpm|no_color|api|cli|orm|json|mcp)\b/i;

interface DocPage {
  url: string;
  title: string;
  file: string;
  headings: Map<string, string>;
}

function stripInlineFormatting(text: string) {
  return text.replace(/\*\*|__|\*|_/g, "").trim();
}

function parseFrontmatter(source: string) {
  if (!source.startsWith("---")) return {} as Record<string, string>;
  const end = source.indexOf("\n---", 3);
  const raw = end === -1 ? "" : source.slice(4, end);
  const data: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (match) data[match[1]] = match[2].trim().replace(/^["'](.*)["']$/, "$1");
  }
  return data;
}

function loadPages(): { pages: DocPage[]; byUrl: Map<string, DocPage> } {
  const pages: DocPage[] = [];
  const byUrl = new Map<string, DocPage>();

  for (const file of globSync(`${CONTENT_ROOT}/**/*.mdx`).sort()) {
    const source = readFileSync(file, "utf8");
    const data = parseFrontmatter(source);
    const headings = collectPageAnchors(source);

    const page: DocPage = {
      url: data.url ?? "",
      title: data.title ?? "",
      file,
      headings,
    };
    pages.push(page);
    if (page.url) byUrl.set(page.url, page);
  }

  return { pages, byUrl };
}

function lowercaseLead(name: string) {
  if (name.startsWith("`") || PROPER_NOUNS.test(name)) return name;
  if (/^[A-Z][a-z]/.test(name)) return name[0].toLowerCase() + name.slice(1);
  return name;
}

function resolveName(href: string, page: DocPage, byUrl: Map<string, DocPage>): string | null {
  if (/^https?:\/\//i.test(href)) return EXTERNAL_NAMES[href] ?? null;
  if (href.startsWith("mailto:")) return null;

  const [pathPart, fragment] = href.split("#");
  const target = pathPart === "" ? page : byUrl.get(pathPart.replace(/\/$/, ""));
  if (!target) return null;
  if (fragment) {
    const heading = target.headings.get(fragment);
    // Step headings ("2. Enable the feature flag") name the step, not the number.
    if (heading) return heading.replace(/^\d+[.)]\s+/, "");
    // An anchor with no heading text (an `id="..."` attribute) names nothing.
    if (pathPart === "" || target.headings.has(fragment)) return null;
  }
  return target.title || null;
}

interface Rewrite {
  file: string;
  line: number;
  before: string;
  after: string;
}

interface Unresolved {
  file: string;
  line: number;
  text: string;
  href: string;
}

const LINK_PATTERN = /\[([^\]\n]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function rewriteFile(page: DocPage, byUrl: Map<string, DocPage>) {
  const source = readFileSync(page.file, "utf8");
  const masked = maskCodeRegions(source, { maskHeadings: true });
  const lines = source.split("\n");
  const maskedLines = masked.split("\n");
  const rewrites: Rewrite[] = [];
  const unresolved: Unresolved[] = [];

  lines.forEach((line, index) => {
    const matches = [...maskedLines[index].matchAll(LINK_PATTERN)].filter((match) =>
      GENERIC_TEXTS.has(stripInlineFormatting(match[1]).toLowerCase()),
    );
    if (matches.length === 0) return;

    let updated = line;
    // Right to left so earlier offsets stay valid.
    for (const match of matches.reverse()) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      const anchorText = stripInlineFormatting(match[1]).toLowerCase();
      const href = match[2];
      const name = resolveName(href, page, byUrl);

      if (!name) {
        unresolved.push({ file: page.file, line: index + 1, text: match[1], href });
        continue;
      }

      const before = updated.slice(0, start);
      const after = updated.slice(end);
      const replacement = buildReplacement(anchorText, name, href, before, after);
      if (!replacement) {
        unresolved.push({ file: page.file, line: index + 1, text: match[1], href });
        continue;
      }

      updated =
        replacement.before +
        `[${replacement.text}](${href})` +
        (replacement.appendAfter ?? "") +
        (replacement.dropAfter ? after.slice(replacement.dropAfter) : after);
    }

    if (updated !== line) {
      rewrites.push({ file: page.file, line: index + 1, before: line, after: updated });
      lines[index] = updated;
    }
  });

  return { content: lines.join("\n"), rewrites, unresolved };
}

function buildReplacement(
  anchorText: string,
  name: string,
  href: string,
  before: string,
  after: string,
): { before: string; text: string; dropAfter?: number; appendAfter?: string } | null {
  const trailingWord = before.match(/([A-Za-z']+)[.,;:]?\s*$/)?.[1]?.toLowerCase();
  const opensBracket = /[([]\s*$/.test(before);
  const sentenceStart = startsSentence(before);

  // The sentence already names the destination right before the link
  // ("...add it to Cursor [here](/ai/tools/mcp-server#cursor)"): link that
  // phrase instead of repeating the name.
  const redundant = matchTrailingName(before, name);
  if (redundant) {
    return {
      before: before.slice(0, redundant.start),
      text: before.slice(redundant.start).trimEnd(),
    };
  }

  if (CALL_TO_ACTION.has(anchorText)) {
    // "[Learn more](x)." keeps the call to action as prose and lets the anchor
    // name the destination: "Learn more about [database upserts](x)."
    const phrase = anchorText === "click here" ? "see" : anchorText;
    const cta = sentenceStart ? phrase[0].toUpperCase() + phrase.slice(1) : phrase;
    // "[Read more](x) about why ..." already has its own "about" clause.
    const hasOwnClause = /^\s+about\b/.test(after);
    const connective = hasOwnClause
      ? "in"
      : IMPERATIVE_HEADING.test(name)
        ? "about how to"
        : "about";
    const linkName = connective === "in" ? name : lowercaseLead(name);
    return { before: `${before}${cta} ${connective} `, text: linkName };
  }

  // "visit [this](x) page." / "see the [docs](x) for ..." — the noun after the
  // link becomes the link's own noun, so it is absorbed into the anchor.
  const followingNoun = after.match(/^\s+(page|guide|documentation|docs)\b/i);
  if (followingNoun) {
    const article = /\b(the|a|an|their|its|our|your)\s*$/i.test(before) ? "" : "the ";
    return {
      before: `${before}${article}`,
      text: name,
      dropAfter: followingNoun[0].length,
    };
  }

  // "... these parameters. [This guide](x) describes ..." — a link that opens a
  // sentence takes no connective.
  if (sentenceStart) {
    const article = /^(the|a|an)\b/i.test(name) || /^[A-Z]/.test(name) ? "" : "The ";
    return { before, text: article ? `${article}${name}` : name };
  }

  if (opensBracket || !trailingWord) return { before, text: name };
  if (PREPOSITIONS.has(trailingWord) || DETERMINERS.has(trailingWord)) {
    return { before, text: name };
  }
  if (trailingWord === "go") return { before: `${before}to `, text: name };

  // A whole page rather than a section reads as a place, not a thing:
  // "Learn more in the [No Rust engine](x) documentation."
  if (!href.includes("#") && !/^https?:\/\//i.test(href) && !/^(the|a|an)\b/i.test(name)) {
    return { before: `${before}in the `, text: name, appendAfter: " documentation" };
  }

  return { before: `${before}in `, text: name };
}

/**
 * Where the destination's name already sits at the end of `before`, so the
 * rewrite can link that phrase instead of appending a second copy of it.
 */
function matchTrailingName(before: string, name: string) {
  const plain = name.replace(/`/g, "").trim();
  if (plain.length < 3) return null;
  const trimmed = before.trimEnd();
  if (trimmed.length === before.length - 0 && trimmed === "") return null;
  const lower = trimmed.toLowerCase();
  const candidate = plain.toLowerCase();
  if (!lower.endsWith(candidate)) return null;
  const start = trimmed.length - plain.length;
  // Must start at a word boundary, and must not swallow the whole sentence.
  if (start === 0 || /[\s(]/.test(trimmed[start - 1]) === false) return null;
  return { start };
}

/**
 * A call to action only keeps its capital letter when it opens a sentence: a
 * table cell, a list item, or text after a full stop. Mid-sentence ("..., learn
 * more about x") it stays lowercase.
 */
function startsSentence(before: string) {
  const text = before.trimEnd();
  if (text === "") return true;
  return (
    /(?:[.!?:]|\||>|^\s*[-*+]|^\s*\d+\.)\s*$/.test(text) || /^\s*(?:[-*+]|\d+\.)\s*$/.test(before)
  );
}

function folderOf(file: string) {
  const rel = path.relative(CONTENT_ROOT, file);
  const segments = rel.split(path.sep);
  if (segments[0] === "orm" && /^v\d+$/.test(segments[1] ?? ""))
    return `${segments[0]}/${segments[1]}`;
  return segments[0];
}

function main() {
  const check = process.argv.includes("--check");
  const { pages, byUrl } = loadPages();

  const allRewrites: Rewrite[] = [];
  const allUnresolved: Unresolved[] = [];

  for (const page of pages) {
    const { content, rewrites, unresolved } = rewriteFile(page, byUrl);
    allRewrites.push(...rewrites);
    allUnresolved.push(...unresolved);
    if (rewrites.length > 0 && !check) writeFileSync(page.file, content);
  }

  const perFolder = new Map<string, { links: number; files: Set<string> }>();
  for (const rewrite of allRewrites) {
    const folder = folderOf(rewrite.file);
    const entry = perFolder.get(folder) ?? { links: 0, files: new Set<string>() };
    entry.links += 1;
    entry.files.add(rewrite.file);
    perFolder.set(folder, entry);
  }

  for (const rewrite of allRewrites) {
    console.log(`${path.relative(CONTENT_ROOT, rewrite.file)}:${rewrite.line}`);
    console.log(`  - ${rewrite.before.trim()}`);
    console.log(`  + ${rewrite.after.trim()}`);
  }

  console.log("\nRewritten lines per folder:");
  for (const [folder, entry] of [...perFolder].sort()) {
    console.log(`  ${folder}: ${entry.links} lines in ${entry.files.size} files`);
  }
  console.log(`  total: ${allRewrites.length} lines`);

  if (allUnresolved.length > 0) {
    console.log(`\nLeft untouched, destination could not be named (${allUnresolved.length}):`);
    for (const item of allUnresolved) {
      console.log(
        `  ${path.relative(CONTENT_ROOT, item.file)}:${item.line} [${item.text}](${item.href})`,
      );
    }
  }

  if (check && allRewrites.length > 0) process.exit(1);
}

main();
