# IndexNow notifications

`indexnow.yml` runs only after successful Vercel deployments named `Production – site`, `Production – docs`, or `Production – blog`, or a manual run from `main`. It verifies that the checked-out commit belongs to `main`. Preview deploys do not submit URLs.

The site serves `public/prisma-indexnow.txt` as the public ownership-verification file. This is an IndexNow verification key, not a Bing Webmaster API key. Deploy the site before running a docs or blog backfill. Every submission first checks that the production key file matches the repository.

Each run reads that app's live sitemap and compares Git content fingerprints with its previous successful checkpoint. Changed MDX pages are notified individually; shared layout or dependency changes notify affected pages. Listings use the whole app fingerprint. Removed sitemap URLs are also notified. On the first run, or if GitHub evicts the cache, the current sitemap is submitted in full. Only canonical HTTPS URLs on `www.prisma.io` are accepted; preview hosts, API routes, query strings and static assets are rejected.

Run locally from the repository root:

```sh
node --test scripts/indexnow.test.mjs
node scripts/indexnow.mjs site          # dry run, no submission or checkpoint
node scripts/indexnow.mjs docs          # dry run
node scripts/indexnow.mjs blog          # dry run
node scripts/indexnow.mjs site --submit # production key must already be live
```

After merging and deploying the site, manually dispatch once for `site`, `docs`, and `blog` to seed the checkpoints. Subsequent successful deployments sync their affected app automatically. The workflow needs no additional secret or Bing account access. HTTP 202 (key validation pending) and other non-200 responses fail without saving the checkpoint; rerun after resolving the response. HTTP 200 confirms receipt, not indexing or AI recommendations.

The workflow uses production sitemap contents at run time. If publication has not yet propagated to the canonical host, rerun once the sitemap reflects the release. Changes outside this repository need a manual run after their content is reflected in a deployment; this workflow is not a substitute for accurate sitemap generation.
