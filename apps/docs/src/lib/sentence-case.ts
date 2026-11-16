/**
 * Multi-word names that keep every capital ("Prisma Postgres", not
 * "Prisma postgres"). Matched word by word, ignoring surrounding punctuation.
 */
const PRODUCT_PHRASES = [
  "Prisma Accelerate",
  "Prisma Client",
  "Prisma Composer",
  "Prisma Compute",
  "Prisma Migrate",
  "Prisma Optimize",
  "Prisma Postgres",
  "Prisma Schema",
  "Prisma Studio",
  "Query Insights",
  "AWS Lambda",
  "Azure Functions",
  "Claude Code",
  "Cloudflare Pages",
  "Cloudflare Workers",
  "Deno Deploy",
  "Edge Functions",
  "GitHub Actions",
  "GitHub Copilot",
  "Netlify Functions",
  "Vercel Functions",
  "VS Code",
].map((phrase) => phrase.split(" "));

/**
 * Single-word proper nouns written in plain title case, which the mixed-case
 * rule below can't tell from an ordinary word ("Postgres" vs "Started").
 */
const PROPER_NOUNS = new Set([
  "Prisma",
  "Postgres",
  "Accelerate",
  "Astro",
  "Azure",
  "Bun",
  "Cloudflare",
  "Copilot",
  "Deno",
  "Docker",
  "Drizzle",
  "Fly.io",
  "Git",
  "Heroku",
  "Hono",
  "Koyeb",
  "Kysely",
  "Lambda",
  "Mongoose",
  "Neon",
  "Netlify",
  "Next.js",
  "Node.js",
  "Nuxt",
  "Ollama",
  "Pulumi",
  "Railway",
  "Raycast",
  "Remix",
  "Rust",
  "Sequelize",
  "Sevalla",
  "Supabase",
  "Terraform",
  "Turso",
  "Vercel",
  "Windows",
]);

/** The word without surrounding punctuation: "(Postgres)," → "Postgres". */
function core(word: string) {
  return word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}.]+$|\.$/gu, "");
}

/** Capitals past the first letter mark an acronym or mixed-case name:
 *  "ORM", "PostgreSQL", "MongoDB", "GitHub", "IDs". */
function hasInnerCapital(word: string) {
  return /\p{Lu}/u.test(core(word).slice(1));
}

/**
 * "Getting Started" → "Getting started": the brand's sentence case for
 * navigation labels. Acronyms, mixed-case names ("PostgreSQL", "MongoDB"),
 * known products ("Prisma Postgres") and proper nouns ("Vercel") keep their
 * capitals. Used by the header and in-page breadcrumbs, so the page tree's
 * own titles (and the sidebar) are unchanged.
 */
export function sentenceCase(title: string) {
  const words = title.split(" ");
  const keep = new Set<number>([0]);

  words.forEach((_, start) => {
    for (const phrase of PRODUCT_PHRASES) {
      if (phrase.every((part, offset) => core(words[start + offset] ?? "") === part)) {
        phrase.forEach((_, offset) => keep.add(start + offset));
      }
    }
  });

  return words
    .map((word, i) =>
      keep.has(i) || hasInnerCapital(word) || PROPER_NOUNS.has(core(word))
        ? word
        : word.toLowerCase(),
    )
    .join(" ");
}
