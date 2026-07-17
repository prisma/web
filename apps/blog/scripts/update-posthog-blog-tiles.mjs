// Re-bakes the static PostHog blog tiles from blog frontmatter so they stay
// current with no manual refresh.
//
// Tiles updated (PostHog project 60295, dashboard "Blog SEO & Performance"):
//   - "Blog posts published per month"            (insight 9555387 / 1eGn424G)
//   - "Blog library age — older vs younger 12mo"  (insight 9555402 / IasjsfXT)
//   - "Recent posts ranked by pageviews"          (insight 9497434 / D2eDZ3eq)
//
// Run by .github/workflows/blog-posthog-tiles.yml on every push to main that
// touches apps/blog/content/blog/**. Posts-per-month is driven by a
// publish-month histogram (frontmatter `date`); library-age classifies each
// post by its LAST TOUCH (`updatedAt` when present, else `date`), so refreshed
// posts count as young again; the recent-posts tile is driven by the list of
// posts published OR updated in the last 30 days (`date` / `updatedAt`).
//
// Local dry run (prints the queries, no API call):
//   node apps/blog/scripts/update-posthog-blog-tiles.mjs --dry-run

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PROJECT_ID = 60295;
const HOST = "https://us.posthog.com";

// Numeric insight ids (short ids in comments) on the Blog SEO & Performance dashboard.
const INSIGHTS = {
  postsPerMonth: 9555387, // 1eGn424G
  libraryAge: 9555402, // IasjsfXT
  recentPosts: 9497434, // D2eDZ3eq
};

const RECENT_DAYS = 30;

const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "content", "blog");

/** Read the frontmatter block of every post: { slug, date, updatedAt }. */
function readPosts() {
  const posts = [];
  for (const entry of readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    let raw;
    try {
      raw = readFileSync(join(CONTENT_DIR, entry.name, "index.mdx"), "utf8");
    } catch {
      continue; // directory without an index.mdx
    }
    const fm = raw.startsWith("---") ? (raw.split(/^---\s*$/m)[1] ?? "") : raw;
    const date = (fm.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m) ?? [])[1] ?? null;
    const updatedAt = (fm.match(/^updatedAt:\s*["']?(\d{4}-\d{2}-\d{2})/m) ?? [])[1] ?? null;
    posts.push({ slug: entry.name, date, updatedAt });
  }
  return posts;
}

/** Sorted [ ['YYYY-MM', count], ... ] histogram of publish months. */
function publishHistogram(posts) {
  const counts = new Map();
  for (const { date } of posts) {
    if (!date) continue;
    const month = date.slice(0, 7);
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
}

/** Slugs of posts published OR updated within the last RECENT_DAYS days. */
function recentSlugs(posts) {
  const cutoff = new Date(Date.now() - RECENT_DAYS * 86400000).toISOString().slice(0, 10);
  return posts
    .filter((p) => (p.date && p.date > cutoff) || (p.updatedAt && p.updatedAt > cutoff))
    .map((p) => p.slug)
    .sort();
}

function tuplesLiteral(hist) {
  return hist.map(([month, count]) => `tuple('${month}',${count})`).join(",");
}

function postsPerMonthQuery(tuples) {
  return {
    kind: "DataVisualizationNode",
    display: "ActionsBar",
    source: {
      kind: "HogQLQuery",
      query: `SELECT month, posts FROM (SELECT toDate(concat(t.1, '-01')) AS month, t.2 AS posts FROM (SELECT arrayJoin([${tuples}]) AS t)) WHERE month >= toStartOfMonth(today()) - toIntervalMonth(11) ORDER BY month`,
    },
    chartSettings: {
      xAxis: { column: "month" },
      yAxis: [{ column: "posts", settings: { display: { label: "Posts published" } } }],
    },
  };
}

/**
 * Per-post (publishMonth, lastTouchMonth) pairs for the library-age tile.
 * lastTouch = updatedAt when present (a refreshed post counts as "young"
 * again from its refresh month onward), else the publish date.
 */
function agePairsLiteral(posts) {
  return posts
    .filter((p) => p.date)
    .map((p) => {
      const pub = p.date.slice(0, 7);
      const touch = p.updatedAt && p.updatedAt > p.date ? p.updatedAt.slice(0, 7) : pub;
      return `tuple('${pub}','${touch}')`;
    })
    .join(",");
}

function libraryAgeQuery(pairs) {
  // At each display month M a post exists once published (pub <= M); its age
  // class comes from its last touch as of M: the refresh date if it had
  // already happened by M, otherwise the publish date.
  const query =
    `WITH posts AS (SELECT toDate(concat(t.1, '-01')) AS pub, toDate(concat(t.2, '-01')) AS touch FROM (SELECT arrayJoin([${pairs}]) AS t)) ` +
    `SELECT M AS month, ` +
    `countIf(pub <= M AND if(touch <= M, touch, pub) > M - toIntervalMonth(12)) AS younger_than_12mo, ` +
    `countIf(pub <= M AND if(touch <= M, touch, pub) <= M - toIntervalMonth(12)) AS older_than_12mo ` +
    `FROM (SELECT arrayJoin(arrayMap(i -> toStartOfMonth(today()) - toIntervalMonth(i), range(0, 36))) AS M) months ` +
    `CROSS JOIN posts GROUP BY M ORDER BY M`;
  return {
    kind: "DataVisualizationNode",
    display: "ActionsStackedBar",
    source: { kind: "HogQLQuery", query },
    chartSettings: {
      xAxis: { column: "month" },
      yAxis: [
        { column: "younger_than_12mo", settings: { display: { label: "< 12 months" } } },
        { column: "older_than_12mo", settings: { display: { label: "> 12 months" } } },
      ],
    },
  };
}

function recentPostsQuery(slugs) {
  const quote = (s) => `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  const arr = slugs.length ? `[${slugs.map(quote).join(",")}]` : "CAST([] AS Array(String))";
  const query =
    `WITH recent AS (SELECT arrayJoin(${arr}) AS slug), ` +
    `pv AS (SELECT properties.$pathname AS path, count() AS pageviews, count(DISTINCT person_id) AS visitors ` +
    `FROM events WHERE event = '$pageview' AND properties.$host = 'www.prisma.io' ` +
    `AND timestamp >= now() - INTERVAL 30 DAY AND properties.$pathname LIKE '/blog/%' GROUP BY path) ` +
    `SELECT path, pageviews, visitors, rank, multiIf(rank <= 3, 'Top 3', rank > total - 3, 'Bottom 3', '') AS tier ` +
    `FROM (SELECT concat('/blog/', recent.slug) AS path, coalesce(pv.pageviews, 0) AS pageviews, ` +
    `coalesce(pv.visitors, 0) AS visitors, row_number() OVER (ORDER BY coalesce(pv.pageviews, 0) DESC) AS rank, ` +
    `count() OVER () AS total FROM recent LEFT JOIN pv ON pv.path = concat('/blog/', recent.slug)) ` +
    `ORDER BY rank LIMIT 100`;
  return { kind: "DataVisualizationNode", display: "ActionsTable", source: { kind: "HogQLQuery", query } };
}

async function patchInsight(id, query) {
  const res = await fetch(`${HOST}/api/projects/${PROJECT_ID}/insights/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.POSTHOG_API_KEY}`,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`PATCH insight ${id} failed: ${res.status} ${await res.text()}`);
  }
}

const posts = readPosts();
const hist = publishHistogram(posts);
const tuples = tuplesLiteral(hist);
const total = hist.reduce((sum, [, count]) => sum + count, 0);
const recent = recentSlugs(posts);
console.log(
  `Blog posts: ${total} across ${hist.length} months (${hist[0]?.[0]} – ${hist.at(-1)?.[0]}); ${recent.length} recent (≤${RECENT_DAYS}d).`,
);

if (process.argv.includes("--dry-run")) {
  console.log("\nDRY RUN — queries that would be written (no API call):\n");
  console.log("posts-per-month:\n" + postsPerMonthQuery(tuples).source.query + "\n");
  console.log("library-age:\n" + libraryAgeQuery(agePairsLiteral(posts)).source.query + "\n");
  console.log("recent slugs (" + recent.length + "): " + recent.join(", ") + "\n");
  console.log("recent-posts:\n" + recentPostsQuery(recent).source.query);
  process.exit(0);
}

if (!process.env.POSTHOG_API_KEY) {
  console.error("Error: POSTHOG_API_KEY is not set. Set the repo secret, or pass --dry-run to preview.");
  process.exit(1);
}

await patchInsight(INSIGHTS.postsPerMonth, postsPerMonthQuery(tuples));
console.log(`Updated posts-per-month insight (${INSIGHTS.postsPerMonth}).`);
await patchInsight(INSIGHTS.libraryAge, libraryAgeQuery(agePairsLiteral(posts)));
console.log(`Updated library-age insight (${INSIGHTS.libraryAge}).`);
await patchInsight(INSIGHTS.recentPosts, recentPostsQuery(recent));
console.log(`Updated recent-posts insight (${INSIGHTS.recentPosts}).`);
console.log("Done.");
