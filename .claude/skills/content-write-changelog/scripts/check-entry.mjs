#!/usr/bin/env node
// Checks a changelog entry before it goes into a pull request.
// Usage: node check-entry.mjs apps/site/content/changelog/2026-10-02.mdx [--links] [--modules <dir>]
//
// Always checked: required frontmatter, slug and version equal to date, the file name, em dashes
// and emoji, private pull request links, images on disk with alt text, and that the MDX compiles.
// With --links: every link returns 200, pull request links included, and every #anchor exists on
// the page it points to.
// --modules names a directory whose node_modules holds @mdx-js/mdx, for a checkout or worktree
// that has no install of its own. Exit 1 on any finding.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const file = args.find((a) => a.endsWith(".mdx"));
const checkLinks = args.includes("--links");
const modulesFlag = args.indexOf("--modules");
if (!file) {
  console.error("Usage: check-entry.mjs <entry.mdx> [--links] [--modules <dir>]");
  process.exit(2);
}

const path = resolve(file);
const siteDir = resolve(dirname(path), "../..");
const repoRoot = resolve(siteDir, "../..");
const source = readFileSync(path, "utf8");
const findings = [];
const fail = (message) => findings.push(message);

const match = source.match(/^---\n([\s\S]*?)\n---\n/);
if (!match) {
  console.error("No frontmatter found.");
  process.exit(1);
}
const frontmatter = match[1];
const body = source.slice(match[0].length);
const field = (name) => frontmatter.match(new RegExp(`^${name}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1];

for (const name of ["title", "date", "version", "slug", "headline", "canonical", "metaDescription"]) {
  if (!field(name)) fail(`frontmatter: "${name}" is missing`);
}
if (!/^tags:\s*\n(\s+-\s+.+\n?)+/m.test(frontmatter)) fail("frontmatter: tags are missing");
const date = field("date");
if (date) {
  const parsed = new Date(`${date}T00:00:00Z`);
  const real = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
  if (!real) fail(`frontmatter: date "${date}" is not a real YYYY-MM-DD date`);
  if (field("slug") !== date) fail("frontmatter: slug must equal date");
  if (field("version") !== date) fail("frontmatter: version must equal date, not a product version");
  if (basename(path) !== `${date}.mdx`) fail(`file name must be ${date}.mdx`);
  if (field("canonical") !== `/changelog#log${date}`) fail(`frontmatter: canonical must be /changelog#log${date}`);
}
if (field("title") !== field("headline")) fail("frontmatter: headline must repeat title");
if (/^Prisma:|\bv?\d+\.\d+\.\d+\b/.test(field("title") ?? "")) fail("title: no Prisma: prefix and no version number");

const lines = source.split("\n");
lines.forEach((line, i) => {
  if (/\u2014|\u2013/.test(line)) fail(`line ${i + 1}: dash character, use a comma, a period, or parentheses`);
  if (/\p{Extended_Pictographic}/u.test(line)) fail(`line ${i + 1}: emoji`);
});

const prose = body.replace(/```[\s\S]*?```/g, "");
if (/^##\s/m.test(prose.trimStart().split("\n")[0])) fail("body: open with a paragraph, not a heading");

const links = [...prose.matchAll(/(?<!!\[[^\]]*)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)|href="([^"]+)"/g)].map((m) => m[1] ?? m[2]);
const privateRepos = new Set();
for (const link of links) {
  const pr = link.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/\d+/);
  if (pr) privateRepos.add(pr[1]);
}

for (const image of prose.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)) {
  const [, alt, src] = image;
  if (alt.trim().length < 20) fail(`image ${src}: alt text is missing or too short to describe the image`);
  if (src.startsWith("/") && !existsSync(join(siteDir, "public", src))) fail(`image ${src}: not found in apps/site/public`);
}

function findMdx() {
  const roots = [modulesFlag >= 0 ? resolve(args[modulesFlag + 1]) : null, repoRoot].filter(Boolean);
  for (const root of roots) {
    const direct = join(root, "node_modules/@mdx-js/mdx/index.js");
    if (existsSync(direct)) return direct;
    const store = join(root, "node_modules/.pnpm");
    if (!existsSync(store)) continue;
    const dir = readdirSync(store).find((name) => name.startsWith("@mdx-js+mdx@"));
    if (dir) return join(store, dir, "node_modules/@mdx-js/mdx/index.js");
  }
  return null;
}

const mdxPath = findMdx();
if (!mdxPath) {
  fail("mdx: @mdx-js/mdx not found, run pnpm install or pass --modules <dir>");
} else {
  const { compile } = await import(pathToFileURL(mdxPath).href);
  try {
    await compile(body);
  } catch (error) {
    fail(`mdx: does not compile: ${error.message}`);
  }
}

// One retry, because a slow or rate-limited response is not a broken link.
async function status(url) {
  for (const attempt of [1, 2]) {
    try {
      const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000) });
      if (attempt === 2 || (response.status !== 429 && response.status < 500)) return response;
    } catch {
      if (attempt === 2) return null;
    }
    await new Promise((done) => setTimeout(done, 3000));
  }
  return null;
}

async function inBatches(items, size, check) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(check));
}

if (checkLinks) {
  const privateFound = new Set();
  for (const repo of privateRepos) {
    const response = await status(`https://github.com/${repo}`);
    if (!response || response.status !== 200) {
      privateFound.add(repo);
      fail(`link: ${repo} is not a public repository, remove its pull request links`);
    }
  }
  const unique = [...new Set(links)].filter((link) => {
    const repo = link.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\//)?.[1];
    return !repo || !privateFound.has(repo);
  });
  await inBatches(unique, 6, async (link) => {
    const url = link.startsWith("/") ? `https://www.prisma.io${link}` : link;
    const [page, anchor] = url.split("#");
    const response = await status(page);
    if (!response || response.status !== 200) {
      fail(`link: ${url} returned ${response ? response.status : "no response"}`);
      return;
    }
    if (anchor && !/^log\d{4}/.test(anchor)) {
      const html = await response.text();
      if (!html.includes(`id="${anchor}"`)) fail(`link: ${url} has no element with id "${anchor}"`);
    }
  });
}

if (findings.length) {
  console.error(`${basename(path)}: ${findings.length} finding${findings.length === 1 ? "" : "s"}`);
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exit(1);
}
console.log(`${basename(path)}: ok${checkLinks ? ", links checked" : ""}`);
