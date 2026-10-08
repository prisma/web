# Gathering: what shipped in the window

A changelog entry is only as good as its sources. Read all of them before you write a line.

## 1. Set the window from the last entry

List `apps/site/content/changelog/` and open the newest file. The window starts on that entry's date. Because an entry is written on the day it lands, pull requests merged that same day may or may not be in it, so compare against the pull requests it links instead of trusting the date alone.

## 2. Find the repositories

The repositories that feed the changelog carry the `loggy-core` topic. Ask GitHub for the current list instead of keeping one in your head, because repositories get added and renamed:

```bash
gh api --paginate 'search/repositories?q=org:prisma+topic:loggy-core&per_page=100' \
  --jq '.items[] | "\(.full_name)\t\(.private)"'
```

The second column tells you which repositories are private. Changes from those are published without a link, as `filtering.md` explains. If the search returns only public repositories, your `gh` session cannot see the private ones. Say so in the pull request, because the Console, the REST API, and most of Prisma Compute and Prisma Postgres will be missing.

## 3. List the merged pull requests

For each repository, list what merged in the window and keep the title, the merge date, and the body. `SINCE` and `UNTIL` are the dates from step 1, written as `YYYY-MM-DD`:

```bash
gh pr list -R "$repo" --state merged --limit 1000 \
  --search "merged:$SINCE..$UNTIL" \
  --json number,title,mergedAt,url,body
```

Set `SINCE` a few days before the last entry's date, then drop what that entry already covers. If a repository returns exactly 1000 pull requests, the list was cut off, so split the window in two and run the command for each half.

A month across every repository is close to a thousand pull requests. Do not read them all. Read the titles first, and set aside the ones that start with `chore`, `ci`, `test`, `refactor`, or `build`, along with dependency bumps and internal project close-outs. Read the body only for the candidates that are left. The body, not the title, tells you what the user sees and whether the change is behind a flag.

## 4. Check what is released

A merged pull request is not a shipped feature. Each product has its own check.

- **Prisma ORM.** The release notes in the `docs/releases/` directory of the ORM repository are the authoritative source, one file per version. Use them for the wording of features, fixes, and breaking changes, and for the pull request each one links. A pull request merged after the last version bump is not released. Leave it for the next entry. `npm view prisma dist-tags` shows what `latest` and `prev` install today.
- **Prisma Studio.** Compare the merge dates with `gh release list -R prisma/studio`. A fix merged after the newest release has not reached users.
- **Console, REST API, Prisma MCP server, Prisma Compute, Prisma Postgres.** These deploy continuously, so a merged change is usually live. Read the body for the words "flag", "gate", "rollout", "internal", "eligible", and "behind". A feature that is on for some accounts only is flagged, not published.
- **This repo.** A docs page or blog post is live when its URL returns 200 on production. Check it, because a page can merge before the app that serves it is deployed.

## 5. Find the public source for each item

For every feature you keep, find the docs page that documents it. In `apps/docs/content/docs/`, the URL of a page is its file path: `postgres/migrate-from-ea-to-ga.mdx` is served at `/docs/postgres/migrate-from-ea-to-ga`, and a folder name in parentheses is dropped from the URL.

A feature with a docs page gets a link to it. A feature with no docs page and no public pull request is described by its effect, gets no link, and goes into the triage note as "no public PR" so a reviewer can confirm it is live.

Quote every date, limit, and price from the docs page. If a pull request and the docs disagree, the docs win, and the disagreement goes into the triage note.

## 6. List the new guides and blog posts

List the posts in `apps/blog/content/blog/` whose frontmatter `date` falls in the window, and the docs guides that were added. Take each one-sentence annotation from the post's `metaDescription` or its opening paragraph. A title alone is not enough to describe a post accurately.

## 7. Collect the images

A headline section about something visual carries one screenshot.

- If the docs already publish a screenshot of the feature, copy it from `apps/docs/public/img/` instead of taking a new one.
- For a public page, capture the live page at a width of 1440 pixels, and crop out cookie banners and announcement bars.
- For a Console screen, ask the operator for a screenshot. It must come from a demo workspace and show no customer names, email addresses, or connection strings.

Save images as `apps/site/public/changelog/{YYYY-MM-DD}-{short-name}.png`.
