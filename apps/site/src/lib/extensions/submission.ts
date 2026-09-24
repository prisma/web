import { z } from "zod";
import {
  extensions,
  validateExtensionEntry,
  type ExtensionEntry,
} from "@prisma-docs/ui/data/extensions";

/** Path of the community registry inside the prisma/web repository. */
export const COMMUNITY_REGISTRY_PATH = "packages/ui/src/data/extensions/community.json";

const httpsUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => value.startsWith("https://"), "Must be an https URL");

/**
 * Shape of the submission form. Shared by the client form and the API route.
 * The form asks for what only the author knows; slug, display name, and the
 * author link are derived from the package name and repository.
 */
export const submissionSchema = z.object({
  package: z
    .string()
    .trim()
    .min(1)
    .max(214)
    .regex(
      /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/,
      "Not a valid npm package name",
    ),
  repo: httpsUrl,
  tldr: z.string().trim().min(10).max(140),
  description: z.string().trim().min(40).max(600),
  databases: z
    .array(
      z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug such as postgresql"),
    )
    .min(1, "Name at least one database")
    .max(6),
  authorName: z.string().trim().min(1).max(80),
  experimental: z.boolean().optional(),
  /** Honeypot. Real users never fill it; the route drops anything that does. */
  website: z.string().optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

/** Derive a directory slug (and display name) from an npm package name. */
export function slugFromPackage(packageName: string): string {
  return packageName
    .toLowerCase()
    .replace(/^@[^/]+\//, "")
    .replace(/^(prisma-)?orm-extension-/, "")
    .replace(/^prisma-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The author's profile link: the owner of a GitHub or GitLab repository, or
 * the repository itself for any other host.
 */
export function authorUrlFromRepo(repo: string): string {
  const url = new URL(repo);
  const owner = url.pathname.split("/").filter(Boolean)[0];
  if (owner && (url.hostname === "github.com" || url.hostname === "gitlab.com")) {
    return `${url.origin}/${owner}`;
  }
  return repo;
}

export function toRegistryEntry(input: SubmissionInput, addedAt: string): ExtensionEntry {
  const slug = slugFromPackage(input.package);
  const entry: ExtensionEntry = {
    slug,
    name: slug,
    package: input.package,
    source: "community",
    status: input.experimental ? "experimental" : "release-candidate",
    tldr: input.tldr,
    description: input.description,
    // The form can name a database twice (checkbox plus the free-form field).
    databases: [...new Set(input.databases)],
    tags: [],
    repo: input.repo,
    author: { name: input.authorName, url: authorUrlFromRepo(input.repo) },
    addedAt,
  };
  const problems = validateExtensionEntry(entry);
  if (problems.length > 0) throw new SubmissionError(400, problems.join("; "));
  return entry;
}

export class SubmissionError extends Error {
  constructor(
    public status: number,
    message: string,
    public fallbackUrl?: string,
  ) {
    super(message);
  }
}

/** Reject entries that collide with anything already listed. */
export function assertNotListed(entry: ExtensionEntry, current: ExtensionEntry[]) {
  const all = [...extensions, ...current];
  if (all.some((listed) => listed.slug === entry.slug)) {
    throw new SubmissionError(409, `An extension with the slug "${entry.slug}" is already listed.`);
  }
  if (all.some((listed) => listed.package === entry.package)) {
    throw new SubmissionError(409, `${entry.package} is already listed.`);
  }
}

const UPSTREAM_TIMEOUT_MS = 10_000;

/**
 * `fetch` with a deadline, so a stalled npm or GitHub request fails the
 * submission with a clear status instead of holding the route open until the
 * platform kills it. `read` runs inside the same guard because the deadline
 * also covers the body: once the signal fires, `response.json()` rejects with
 * the same `TimeoutError` the request itself would. A timeout is 504; any
 * other transport failure is 502. A `SubmissionError` thrown by `read` passes
 * through unchanged.
 */
async function fetchUpstream<T>(
  what: string,
  url: string,
  init: RequestInit,
  read: (response: Response) => Promise<T>,
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    return await read(response);
  } catch (error) {
    if (error instanceof SubmissionError) throw error;
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    throw new SubmissionError(
      timedOut ? 504 : 502,
      `Could not reach ${what}${timedOut ? " in time" : ""}. Try again in a minute.`,
    );
  }
}

/** Confirm the package is published before we open a pull request for it. */
export async function assertPublishedOnNpm(packageName: string) {
  await fetchUpstream(
    "the npm registry",
    `https://registry.npmjs.org/${encodeURIComponent(packageName)}`,
    { headers: { accept: "application/json" } },
    async (response) => {
      if (response.status === 404) {
        throw new SubmissionError(400, `${packageName} is not published on npm.`);
      }
      if (!response.ok) {
        throw new SubmissionError(502, "Could not reach the npm registry. Try again in a minute.");
      }
    },
  );
}

const SCALAR = String.raw`(?:"[^"\n]*"|-?\d+(?:\.\d+)?|true|false|null)`;
const SCALAR_ARRAY = new RegExp(String.raw`\[\n\s+(${SCALAR}(?:,\n\s+${SCALAR})*)\n\s+\]`, "g");

/**
 * Print the registry the way the checked-in file is formatted: two-space JSON
 * with scalar arrays (`databases`, `tags`) on one line and objects expanded,
 * which is what `oxfmt` keeps the file as. Keeps the pull request diff to the
 * added entry only. `apps/site/scripts/extensions-registry.test.ts` checks it
 * reproduces both registry files byte for byte.
 */
export function formatRegistry(entries: ExtensionEntry[]): string {
  const json = JSON.stringify(entries, null, 2).replace(
    SCALAR_ARRAY,
    (_match, items: string) => `[${items.split(/,\n\s+/).join(", ")}]`,
  );
  return `${json}\n`;
}

/**
 * Only accept posts from our own pages. Browsers set `Origin` on cross-site
 * POSTs and a page cannot forge it, so matching it against the request host
 * (plus the production hosts and local development) keeps third-party sites
 * from submitting through a visitor's browser.
 */
export function isTrustedOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  if (!origin) return false;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  return (
    (host !== null && url.host === host) ||
    url.host === "prisma.io" ||
    url.host === "www.prisma.io" ||
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"
  );
}

/** A prefilled GitHub issue for when automatic pull requests are unavailable. */
export function buildFallbackIssueUrl(repo: string, entry: ExtensionEntry): string {
  const title = `Extension submission: ${entry.name}`;
  const body = [
    `Please add this extension to \`${COMMUNITY_REGISTRY_PATH}\`.`,
    "",
    "```json",
    JSON.stringify(entry, null, 2),
    "```",
  ].join("\n");
  const params = new URLSearchParams({ title, body, labels: "extensions" });
  return `https://github.com/${repo}/issues/new?${params.toString()}`;
}

type GitHubConfig = { token: string; repo: string; baseBranch: string };

export function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_EXTENSIONS_TOKEN;
  if (!token) return null;
  return {
    token,
    repo: process.env.EXTENSIONS_REPO ?? "prisma/web",
    baseBranch: process.env.EXTENSIONS_BASE_BRANCH ?? "main",
  };
}

async function github<T>(
  config: GitHubConfig,
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const method = init.method ?? "GET";
  return fetchUpstream(
    "GitHub",
    `https://api.github.com${path}`,
    {
      method,
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${config.token}`,
        "x-github-api-version": "2022-11-28",
        ...(init.body !== undefined ? { "content-type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    },
    async (response) => {
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new SubmissionError(
          502,
          `GitHub returned ${response.status} for ${method} ${path}: ${detail.slice(0, 200)}`,
        );
      }
      return (await response.json()) as T;
    },
  );
}

/** Read the community registry as it is on the base branch right now. */
export async function fetchCurrentRegistry(
  config: GitHubConfig,
): Promise<{ entries: ExtensionEntry[]; sha: string }> {
  const file = await github<{ content: string; sha: string }>(
    config,
    `/repos/${config.repo}/contents/${COMMUNITY_REGISTRY_PATH}?ref=${encodeURIComponent(config.baseBranch)}`,
  );
  const decoded = Buffer.from(file.content, "base64").toString("utf8");
  return { entries: JSON.parse(decoded) as ExtensionEntry[], sha: file.sha };
}

/** Create a branch, commit the updated registry, and open the pull request. */
export async function openPullRequest(
  config: GitHubConfig,
  entry: ExtensionEntry,
  current: { entries: ExtensionEntry[]; sha: string },
): Promise<{ url: string; number: number }> {
  const base = await github<{ object: { sha: string } }>(
    config,
    `/repos/${config.repo}/git/ref/heads/${encodeURIComponent(config.baseBranch)}`,
  );
  const branch = `extensions/add-${entry.slug}-${Date.now().toString(36)}`;
  await github(config, `/repos/${config.repo}/git/refs`, {
    method: "POST",
    body: { ref: `refs/heads/${branch}`, sha: base.object.sha },
  });

  const next = [...current.entries, entry].sort((a, b) => a.name.localeCompare(b.name));
  await github(config, `/repos/${config.repo}/contents/${COMMUNITY_REGISTRY_PATH}`, {
    method: "PUT",
    body: {
      message: `feat(extensions): list ${entry.name}`,
      content: Buffer.from(formatRegistry(next), "utf8").toString("base64"),
      sha: current.sha,
      branch,
    },
  });

  const body = [
    `Adds **${entry.name}** (\`${entry.package}\`) to the community extension directory.`,
    "",
    `> ${entry.tldr}`,
    "",
    `- Databases: ${entry.databases.join(", ")}`,
    `- Source: ${entry.repo}`,
    `- Author: [${entry.author.name}](${entry.author.url})`,
    "",
    "Submitted through https://www.prisma.io/extensions/submit. The entry passed schema",
    "validation and the package resolves on npm. Review: confirm it targets Prisma 8, skim the",
    "README, then merge. The docs catalog table regenerates on push.",
  ].join("\n");

  const pull = await github<{ html_url: string; number: number }>(
    config,
    `/repos/${config.repo}/pulls`,
    {
      method: "POST",
      body: {
        title: `feat(extensions): list ${entry.name}`,
        head: branch,
        base: config.baseBranch,
        body,
        maintainer_can_modify: true,
      },
    },
  );

  // Labels are best effort: a missing label must not fail the submission.
  await github(config, `/repos/${config.repo}/issues/${pull.number}/labels`, {
    method: "POST",
    body: { labels: ["extensions"] },
  }).catch(() => undefined);

  return { url: pull.html_url, number: pull.number };
}
