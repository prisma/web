import { NextResponse } from "next/server";
import {
  assertNotListed,
  assertPublishedOnNpm,
  buildFallbackIssueUrl,
  fetchCurrentRegistry,
  getGitHubConfig,
  isTrustedOrigin,
  openPullRequest,
  submissionSchema,
  SubmissionError,
  toRegistryEntry,
} from "@/lib/extensions/submission";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const recentSubmissions = new Map<string, number[]>();
let lastSweep = 0;

/** Best-effort per-instance limiter. Enough to stop a runaway script. */
function isRateLimited(key: string): boolean {
  const now = Date.now();
  // Once per window, forget addresses whose window has passed so a warm
  // instance does not keep every address it has ever seen.
  if (now - lastSweep >= RATE_LIMIT_WINDOW_MS) {
    for (const [address, stamps] of recentSubmissions) {
      if (stamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(address);
      }
    }
    lastSweep = now;
  }
  const timestamps = (recentSubmissions.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  recentSubmissions.set(key, timestamps);
  return false;
}

export async function POST(request: Request) {
  if (!isTrustedOrigin(request.headers)) {
    return NextResponse.json(
      { error: "Cross-site submissions are not accepted." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "A JSON body is required." }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return NextResponse.json({ error: "Check the highlighted fields.", issues }, { status: 400 });
  }

  // Honeypot filled in: pretend it worked and drop it.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, prUrl: null });
  }

  // Only well-formed attempts count against the limit, so a typo does not
  // lock someone out of a real submission.
  const clientKey =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Too many submissions from this address. Try again in an hour." },
      { status: 429 },
    );
  }

  const config = getGitHubConfig();
  const repo = config?.repo ?? process.env.EXTENSIONS_REPO ?? "prisma/web";

  try {
    const entry = toRegistryEntry(parsed.data, new Date().toISOString().slice(0, 10));
    // Against the registry this deployment shipped with, so duplicates are
    // rejected even before the GitHub-backed check below.
    assertNotListed(entry, []);
    await assertPublishedOnNpm(entry.package);

    if (!config) {
      throw new SubmissionError(
        503,
        "Automatic pull requests are not configured on this deployment. Open the prefilled issue instead.",
        buildFallbackIssueUrl(repo, entry),
      );
    }

    const current = await fetchCurrentRegistry(config);
    assertNotListed(entry, current.entries);
    const pull = await openPullRequest(config, entry, current);
    return NextResponse.json({ ok: true, prUrl: pull.url, prNumber: pull.number });
  } catch (error) {
    if (error instanceof SubmissionError) {
      return NextResponse.json(
        { error: error.message, fallbackUrl: error.fallbackUrl },
        { status: error.status },
      );
    }
    console.error("Extension submission failed", error);
    return NextResponse.json(
      { error: "Something went wrong while opening the pull request. Try again later." },
      { status: 500 },
    );
  }
}
