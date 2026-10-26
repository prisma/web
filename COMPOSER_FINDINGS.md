# Composer and Compute findings from porting Prisma Web

Latest verified status, 25 October: code source `40a69269a` passed all checks,
five Vercel previews, Compute deployment and live cache/smoke validation with
the single origin-controlled Cloudflare rule on `prisma.sorenbs.com`.
Application optimizations substantially improve mobile homepage/blog LCP and
reduce initial bytes; docs mobile LCP is roughly level with Vercel. Cold fills,
uncached navigation and some network paths still prevent an all-user parity
claim. Composer/provider are `0.30.0-dev.9`. The final section records the
current evidence and product requirements, superseding earlier provisional
results; the original observations remain below as history. No production
cutover or extra Cloudflare rule was performed.

The later authenticated, same-source Vercel preview comparison is recorded in
the final section: blog mobile medians were 2.578 s on Vercel and 2.735 s on
Compute/Cloudflare, with overlapping run ranges. The large earlier advantage
over the live production homepage includes application changes that benefit
both hosts; it must not be interpreted as a hosting-only advantage.

Recorded on 12 October 2026. Tested with Composer and the Prisma Cloud target
0.29.1, Prisma CLI 8.0.0-rc.22, Next.js 16.3.4, pnpm 12.3.4, and Bun 1.4.3.
The target constraints are 1 GB memory and 1 GB files per Compute service.
These observations describe local tests; production workspace deployment is a
separate follow-up. The setup and reproduction commands are in [COMPOSER.md](COMPOSER.md).

## Application and build findings

| Observation | Evidence | Resolution in this PR |
| --- | --- | --- |
| The repository contains five websites, not just the three public zones | Site, docs, blog, handbook, and Eclipse each have their own Next.js app | One root module, five website services, and an HTTP gateway |
| One combined artifact cannot fit | Blog public media is about 653 MiB; site and docs public directories add about 138 MiB and 74 MiB before code or prerendered output | Keep website artifacts separate |
| Docs prerendering exceeds the file limit on its own | Initial standalone output was about 1.8 GiB on disk; server output included about 916 MB RSC and 372 MB HTML, measured as decimal bytes | Omit the article static-params generator in Composer mode and use request rendering |
| Eager MDX exceeds the memory budget | The local docs Bun process reached about 1.6 GB RSS before successful article navigation; the blog was about 677 MB | Enable Fumadocs async collections in Composer mode and materialize content at its consumers |
| Lazy collection data differs from eager data | Frontmatter is immediate, but body, toc, and last-modified exports require `load()` | Shared `pageContent()` helper; update pages, Markdown, prompts, RSS, sitemap, structured data, and link/agent checks |
| Returning an empty static-params array is insufficient | Next records a blocking fallback/ISR route; `connection()` in that route returned `DYNAMIC_SERVER_USAGE` at runtime | Export an undefined generator in Composer mode, preserving the original generator in Vercel mode |
| The native Next adapter understands this pnpm monorepo | It locates the app from Next's tracing manifest and repairs omitted/escaping traced dependency links | Reuse that assembler, rather than copying `node_modules` or building a custom Next server |
| Blog remains the tightest file budget | After the changes its artifact is approximately 846 MB, including public media | Enforce a 900 MB expanded-artifact budget; media offload is the next step if it grows |

The final complete smoke run measured site 129 MB, docs 467 MB, blog 211 MB,
handbook 115 MB, Eclipse 128 MB, and gateway 105 MB RSS after page/asset requests,
including current and legacy reference articles. Every process passed a 900 MB
RSS check. The largest expanded artifact was blog at about 846 MB. Both the
Composer build and the original Vercel-mode builds passed for all five websites.
The docs, blog, shared UI, root redirect/link tests, Composer tests, and docs/blog
link checks passed; the docs agent-readiness check reported zero failures.

Lazy imports and request rendering solve different problems. Lazy imports reduce
the startup heap; request rendering removes the stored HTML/RSC footprint.
Fumadocs documents [async collections and their content-loading contract](https://fumadocs.dev/docs/mdx/async).
Memory readings are process RSS samples on macOS, not a guarantee about all
production traffic, concurrency, or long-running module-cache growth. Preview
deployment should include a sustained request test against Compute's actual
memory limit and first-byte deadline.

Existing navigation and SEO intentionally include absolute `www.prisma.io`
links. Local requests to the gateway's zone paths work, but some existing
cross-site navigation still points at the canonical public host. This port does
not change that content convention. The original Turbo dev workflow also
requires local `NEXT_DOCS_ORIGIN`/`NEXT_BLOG_ORIGIN` overrides to avoid its
production fallback; the Composer gateway has no such fallback.

## Runtime and local development findings

### Bun compatibility and daemon isolation

The installed global Bun was 1.3.13. The first local HTTP requests failed while
loading `app-page-turbo.runtime.prod.js` with "Expected CommonJS module to have a
function wrapper". This has a [Bun issue with the same Next.js 16.3 reproduction](https://github.com/oven-sh/bun/issues/36866).
Bun 1.4.3 loads that runtime. The global installation was upgraded at the user's
request, and this repository pins 1.4.3 for repeatable local and CI runs.

A machine-wide compute daemon can retain the executable and state it started
with. The config therefore isolates the daemon by checkout. When changing from
the global daemon to a private daemon, existing local generated origin values
still pointed at old ports: gateway inputs contained ports 3010–3014 while the
new services were listening on 3003–3005 and other ports. Requests returned 502.
A fresh local run regenerated the origin bindings correctly. This is a local
state transition issue, not a reason to hardcode service URLs.

**Suggested improvements:** publish the exact Compute runtime version; make
local dev use or verify the same version; include it in `dev` diagnostics; scope
the default emulator by checkout; and regenerate local `serviceOrigin` bindings
when the daemon's identity or endpoint ports change.

### Watcher size and restart boundaries

The native Next adapter watches whole standalone trees and repaired tracing
targets. With these sites that produced repeated `EMFILE: too many open files,
watch` errors. Watching `.next/BUILD_ID` provides one completed-build marker per
website and avoids restarts while Next is still writing its output. Ctrl-C then
stopped the services successfully without the watcher flood.

**Suggested improvement:** give the Next adapter a completed-build watch mode,
preferably its default, with source HMR as a separately documented development
mode. Detect watcher exhaustion and emit one actionable error, rather than
repeating it for every attempted watch.

### Readiness and logs

The local control API can return a ready session before all HTTP listeners are
accepting connections. A smoke test's first gateway request received
`ECONNREFUSED`. The smoke runner now retries transport errors and startup
502/503 responses for up to 60 seconds, while application 500s fail immediately.

The CLI's startup stream did not include the Next.js service errors. Diagnosing
the CommonJS and dynamic-render failures required opening the emulator's
per-service logs. "Ready" alone did not establish that the pages worked.

**Suggested improvements:** verify listeners or a configurable HTTP health
check before readiness; expose a merged service-log option on `dev`; and
surface a failed boot with its service name, runtime version, and first error.

### Optional inputs differ between dev and deploy

The input schema supports optional fields, but the local target's preflight
requires every referenced `envParam` to exist even when its field is optional.
It also creates placeholder values for every referenced secret, including
optional secrets. Default bindings were narrowed to the integrations each
website uses; optional plain settings can be wired explicitly when configuring
the production workspace. Agent Front secrets are left unbound so a placeholder
does not enable reporting to an external ingest service.

**Suggested improvement:** resolve absent optional values consistently with
deploy/schema validation. Use placeholders only when explicitly requested for
testing an enabled integration. Explain which local features are disabled or
using placeholders, without requiring every application to write its own flags.

### Naming validation

A root module named `prismaWeb` passed authoring/typechecking but failed during
local convergence with `invalid path segment "prismaWeb"`. Changing it to
`prismaweb` resolved the failure. The connected Console project is now `web`,
so the root module was renamed to `web` before setting up GitHub deploys.
Validate names consistently across the
module graph, target, and local URL/path encoder, before spending time assembling
all services; include the permitted pattern in the error.

## Adapter, gateway, and deployment suggestions

1. **Add a supported Next.js pre-boot hook.** This PR wraps native assembly to
   inject typed service input before importing `server.js`. An official hook or
   typed legacy-environment mapping would remove that wrapper while preserving
   existing Next.js code. Bind Next's actual `HOSTNAME` setting as well as
   Composer's `HOST` setting, so container hostnames cannot cause binding errors.
2. **Provide an HTTP gateway module for multi-zone Next apps.** It should bind
   upstream origins per stage and preserve POST bodies, RSC headers, redirects,
   cookies, compression, ranges, cancellation, and streaming. A raw HTTP proxy
   fits these existing websites better than translating all requests into RPC.
3. **Make standalone asset-prefix behavior explicit.** Requests such as
   `/docs-static/_next/static/...` must reach `/docs/_next/static/...` on the
   standalone server. Include this in the adapter/gateway example and test it.
4. **Support importing existing routing rules.** The gateway reuses both Vercel
   redirect tables and the site's built Next routes manifest. Moving only the
   `/docs` and `/blog` forwards loses site-level legacy zone redirects. A
   migration helper should preserve ordering, conditions, query parameters,
   status codes, and base paths, and identify unsupported rules.
5. **Report expanded artifact size before provisioning.** Show compressed size,
   expanded bytes, file count, and remaining per-service headroom. The initial
   too-large docs build was valid Next output; its resource problem needed a
   separate check. Reject an oversized artifact early, with the largest folders
   and suggestions to reduce it.
6. **Offer static-asset offload for Next.js.** Public media and client assets are
   the next growth constraint. A managed object-store/CDN path with immutable
   build URLs and image-optimizer support would avoid an extra asset service.
   Keep server-side prerendered output and ISR storage in the size accounting too.
7. **Expose runtime memory in local tooling and preview diagnostics.** Eager MDX
   passed compilation and artifact checks but exceeded the runtime memory budget.
   Show per-service RSS/heap after startup and representative requests; offer a
   local limit matching the Compute VM rather than relying on the laptop's RAM.
8. **Make the build/run split and its costs visible.** Builds belong to the
   developer or CI machine; `dev` and `deploy` only assemble and run them.
   Sequential Next builds with one worker passed here, but local orchestration
   and packaging used several GB and took tens of seconds before ready. Display
   build, assembly, packaging, convergence, and boot durations separately, and
   cache unchanged assembly/archives on warm runs.

## Production follow-up

No production resources or domains were changed. Before moving traffic, verify
the runtime version, target region, actual filesystem and memory limits,
representative concurrent and sustained requests, integration credentials,
public build settings, gateway host/CSRF behavior, and cold starts in a preview
stage. Then connect the public domain and deployment automation to the gateway.
Vercel remains the existing deployment path while that work is done.

## PR validation follow-up

The first GitHub run passed the Composer build/smoke test, all five Vercel
previews, and the docs/Eclipse browser tests. The Links workflow failed in its
version check: npm's current `prisma` was 8.0.0-rc.22 with CLI engine 0.7.0,
while 16 current documentation references still used the previous versions.
Those current examples and the upgrade guide's historical-version clarification
were merged separately in [PR #8464](https://github.com/prisma/web/pull/8464).
No validation was weakened or skipped.

CodeQL and CodeRabbit identified the new workflow's default token permissions
and persisted checkout credentials. The Composer workflow now grants only
`contents: read` and disables credential persistence. The lazy-content test also
verifies preservation of `getText("processed")`. Header/cookie conditions already
worked for the generated Next redirect table; the same request headers are now
passed to both imported Vercel tables, with a conditional-redirect regression
test. Neither imported Vercel table currently contains header/cookie conditions.

## Routing parity audit

The gateway imports all 20 site and 1,439 docs Vercel redirects. An exhaustive
comparison against Next.js's path and destination compiler covers all 1,454
reachable rules, wildcard parameters, repeated/encoded query values,
destination fragments, status codes, and first-match table precedence.
Five pre-existing docs rules contain fragments in their **source**; browsers
never send those fragments to servers, so these rules cannot match on either
platform. They are retained unchanged and explicitly identified in the test.
Config tests also compare each app's redirects,
headers, and non-zone rewrites between Vercel and Composer modes.

The audit caught migration defects, now fixed:

- Already-prefixed docs redirects to `/customers` and `/company` were wrongly
  mounted under `/docs`. Only the two unprefixed docs aliases require a mounted
  destination; explicit public destinations keep their meaning.
- Forwarded repeated query values were dropped after the first value. The
  gateway now distinguishes keys provided by the destination from keys copied
  from the request, retaining all request values for non-overridden keys.
- The site's hostname-based external `beforeFiles` rewrite could be bypassed
  by `/docs` or `/blog` dispatch. The build now includes those rewrites in the
  gateway routing snapshot, and matching requests go to the site to execute
  its original Next.js rewrite. The gateway never proxies an arbitrary request
  hostname directly.
- Site Next.js redirects now execute in the site server instead of producing
  a bare gateway response. This keeps Next's own redirect response semantics
  and passes through any headers it returns. They take precedence over docs
  redirects. Next.js 16.3.4 intentionally clears configured response headers
  when returning a config redirect (`resolve-routes` returns `resHeaders: null`);
  the live test confirmed this. Page CSP/security headers remain present.
- Repeated slashes now produce a 308 normalization redirect before evaluating
  route rules, matching Vercel's documented CDN normalization behavior.

Zone-local Next.js redirects, rewrites, middleware, and headers remain in the
Next servers, including docs/blog Markdown, MCP, Sentry, analytics, and dataguide
forwarding. Repository parity is separate from Vercel dashboard domain redirects,
firewall/CDN rules, custom domains, and third-party integration credentials;
those need production access and verification before a traffic move. Composer
would benefit from a routing import/audit helper that exposes both kinds of rules
and reports precedence changes rather than only checking syntax.

The audit initially found a cross-zone behavior difference: the site's
Agent Front middleware observes docs/blog requests before Vercel forwards them.
The Composer gateway dispatches those requests directly to their own servers,
so configuring Agent Front only on the site would no longer cover those zones.
The library integration below now provides a gateway middleware bridge for
that hop, using the existing Agent Front implementation. It remains unbound
locally; enabling it requires the same ORA settings on the site and gateway.
Zone-local Markdown negotiation stays in each Next server.

Validation on 2026-10-12: all 22 Composer checks passed, all five websites
built, and the complete local smoke passed pages/assets, docs Markdown,
docs-to-marketing and legacy redirects, repeated/encoded query values,
slash normalization, site-before-docs redirect precedence, blog query-conditional
redirects, site/docs/blog Markdown negotiation, and page security headers.
No website content or Vercel configuration changed in this routing fix.

| Service | Expanded artifact, decimal MB | RSS after smoke, decimal MB |
| --- | ---: | ---: |
| Site | 264.3 | 132.9 |
| Docs | 425.7 | 453.7 |
| Blog | 848.2 | 211.5 |
| Handbook | 45.0 | 102.5 |
| Eclipse | 82.6 | 130.4 |
| Gateway | 0.9 | 107.6 |

These local macOS samples remain subject to the sustained-load and production
concurrency follow-up above. The blog artifact has about 52 MB left before the
repository's 900 MB guardrail, so media offload remains the first size improvement.

## Reusable OSS proxy from Vercel routing exports

The reusable component is now implemented as the vendored Apache-2.0
[`@prisma/proxy`](packages/proxy/README.md) package. Vercel already publishes
[`@vercel/routing-utils`](https://github.com/vercel/vercel/blob/main/packages/routing-utils/package.json)
under Apache-2.0. Its documented
[`getTransformedRoutes()`](https://vercel.com/docs/build-output-api/features#high-level-routing)
converts `vercel.json` redirects, headers, rewrites, clean URLs, and trailing-slash
settings into the lower-level Build Output API route format. It is a compiler
and validator; executing those routes requires a separate request-time router.

On 2026-10-12, a disposable probe using the published version **6.6.0** compiled
all 20 site redirects and all 1,439 docs redirects into 1,459 exported route
entries, with no compiler errors. A mixed headers/redirects/rewrites fixture
also produced a `filesystem` phase and a rewrite with `check: true`. This is
compilation evidence from before the runtime implementation, not a claim that
Vercel accepts source-fragment rules as meaningful HTTP routes. The
probe installed no dependencies in this repository and changed no app routing.

The architecture has three parts:

1. **Importer/compiler.** Accept a Build Output API v3
   [`.vercel/output/config.json`](https://vercel.com/docs/build-output-api/configuration#routes)
   export, or compile high-level `vercel.json` routing with Vercel's library.
   A separate Next.js manifest adapter can support the current standalone-build
   workflow without requiring a Vercel build. Preserve each project's route
   order, mount/base path, and middleware boundaries. Report the source file and
   rule index for invalid, unreachable, or unsupported entries.
2. **Portable HTTP runtime.** Expose a standard
   `(request: Request) => Promise<Response>` handler. Match compiled routes and
   execute redirects, internal/external rewrites, headers, methods, host/header/
   cookie/query conditions, and `continue` behavior in their exported order.
   Retain repeated and encoded query values, redirect statuses, POST bodies,
   cookies, streaming, compression, ranges, and cancellation. Support the
   export's regex dialect explicitly; a successful JavaScript `RegExp` parse
   alone does not establish equivalence with every PCRE expression.
3. **Composer adapter.** Provision a Bun gateway with typed service inputs and
   bind exported resource/service destinations to `serviceOrigin()` values.
   Rebind known old origin URLs explicitly and leave intentional external
   destinations external. Each imported project needs its own target/resource
   mapping; the JSON export alone cannot identify its replacement Compute
   services. The initial proposal compiled during the build; the runtime-only
   follow-up below instead ships original inputs and prepares the tables at boot,
   while retaining expanded-size and memory checks.

Middleware and resource phases need explicit providers. A `middlewarePath`
references executable code, and `filesystem`/`check` require knowing which
resources exist; blindly skipping either changes route precedence. Require a
registered middleware/resource adapter or reject the affected export with a
clear diagnostic. This provides a place to preserve the site's global Agent
Front hop before docs/blog dispatch. A rule export alone cannot execute Agent
Front or any other application middleware. Likewise, caching/ISR, image
optimization, locale rules, transforms, platform mitigation, and dashboard
domain/firewall settings require dedicated support or a reported limitation.

The first release should publish a support matrix and reject unsupported
execution features by default. Its conformance corpus should include this
repository's redirect tables and the proxy smoke/regression cases, plus
multi-project mount precedence and middleware/resource phase fixtures. Prefer
Vercel's compiler and public schema over continuing to extend this repository's
custom destination-string substitution into a general-purpose implementation.
Vercel's OSS dev router is useful reference material, but is coupled to its dev
server and filesystem orchestration; it is not a drop-in Fetch/Compute gateway.

The library replaces the former handwritten gateway router/proxy in this PR.
Its core and Vercel adapter are independent of Prisma website names, Composer,
and Next.js. `composer/gateway/config.ts` supplies the five website definitions;
`composer/gateway/server.ts` is a 22-line runtime that binds their origins.
The published-style package has JS/declaration exports, a standalone build,
Apache-2.0 license, README, and Bun/Node raw transports. It is vendored and has
not been published to npm.

The implementation uses Vercel's compiler for high-level and v3 exported rules,
retains per-site order and parent-before-child precedence, handles mixed public
and mounted docs redirects, and delegates the site's Next redirects/external
beforeFiles rewrites to its own server. Resource and middleware providers are
explicit; unsupported phases, transforms, locale/mitigation, object-valued
conditions, and Vercel routing-only service path overrides fail at compilation
instead of being ignored. Routing providers compile into a common plan, so a
future Netlify adapter can be added without changing the HTTP runtime.

The optional Agent Front bridge calls the site's actual implementation for
child requests and preserves its asset/RSC exclusions. Root requests still
execute it in Next. Its integration test uses a local ingestion fixture and
verifies one event per eligible child request, with no external credential or
network dependency. Matching Vercel redirects are case-sensitive, verified
against the live `/accelerate` versus `/Accelerate` behavior during the audit;
framework delegate selectors preserve Next's own matching semantics.

Initial library validation on 2026-10-13, before the runtime-only follow-up,
after merging main through `3f690a1e3`: all 33 library tests and 9 Composer checks
passed, including the 1,454-rule reference comparison.
All eight workspace type checks passed using the original Vercel origin settings.
That Composer build/smoke passed all five websites and assets, current/legacy
docs, Markdown negotiation, redirects, query preservation, headers, and budgets.
A packed tarball installed in an independent npm project also passed ESM import,
compiler/serialized-plan execution, real Node gzip/cookie forwarding, and strict
declaration checks with invalid inputs rejected by TypeScript. Frozen install,
formatting/lint, and diff checks passed. The PR diff has no website content changes.

| Service | Expanded artifact, decimal MB | RSS after smoke, decimal MB |
| --- | ---: | ---: |
| Site | 265.9 | 131.7 |
| Docs | 426.1 | 467.6 |
| Blog | 848.0 | 218.9 |
| Handbook | 45.0 | 118.0 |
| Eclipse | 82.6 | 127.3 |
| Gateway | 0.9 | 100.2 |

In that initial build, the compiler was excluded from the runtime and the gateway
JavaScript bundle was about 0.58 MB. The runtime-only follow-up bundles it instead.
Root-only Next/React dev dependencies support the optional Agent Front bridge; the OSS package itself depends only on the Vercel compiler. React
is pinned to the websites' existing 19.2.8 version for that bridge. A shared
Composer gateway module could use this library's plan/provider interface and
offer the middleware/resource bindings without requiring application-specific
bootstrap code. These remain local memory samples; production concurrency,
dashboard routing, and credential verification are still required before moving
traffic.


## Runtime-only proxy follow-up (2026-10-13)

The library now prepares its routing tables at boot. `createProxy` accepts site
adapters directly; `vercel` accepts original `vercel.json`/v3 export paths or
file URLs and optionally a Next routes-manifest path. There is no public
compile/serialize-plan workflow or generated `routing.json`. An adapter reads
its files when `createProxy` initializes it, rather than when the adapter is
declared. Each proxy instance validates all routing and bindings before serving
requests; nonfatal diagnostics are reported once. Requests use that snapshot,
and a restart loads file changes. In-memory configs remain supported.

The HTTP core remains independent of filesystem APIs. File loading lives in
the Vercel adapter through `node:fs`, supported by Bun and Node. A future
Netlify adapter can read `_redirects`/`netlify.toml` at the same startup boundary
without changing the handler or transports. File URL inputs resolve relative
to the server, avoiding dependence on Composer's working directory. Bundlers
cannot infer these dynamic input files: the Composer build explicitly copies
the original site/docs configs and site Next manifest under the gateway's
`sites/` directory. Cleaning that directory removes the obsolete compiled plan.
Next's manifest remains necessary because some parent redirects and hostname
rewrites live in Next config rather than Vercel JSON. Next still executes them.

The compiler adds about 0.10 MB to the gateway JavaScript bundle (0.68 MB total).
The complete assembled gateway is 1.3 MB, including raw routing inputs and
Composer bootstrap files. A standalone Bun 1.4.3 probe initialized the actual
five-site tables in approximately 109 ms; this measures file reading,
compilation, and proxy initialization, excluding module import and HTTP startup.
The gateway build now also checks its copied inputs against the 900 MB budget.

**Composer/Compute improvement:** provide explicit runtime input-file declarations
for gateway adapters, with automatic copying and watching/restart when those
files change. This would remove the app-specific copy loop while keeping file
URLs reliable in local and production assembly. Report routing initialization
failures as failed readiness with their site/file context. Config changes should
require only a gateway restart when website artifacts are unchanged.

Validation passed: 37 library tests, 9 Composer checks (including comparison of
all 1,454 reachable Vercel redirects), all eight workspace type checks with the
existing Vercel origin settings, package formatting/lint, and the complete
Composer build/smoke. The smoke also verifies byte-for-byte copies of the
original configs/Next manifest and the absence of `routing.json`. An independent
npm consumer of the packed library passed file URL initialization, snapshot
routing after deleting the input file, real Node gzip/cookie forwarding, and
strict declaration checks with invalid API inputs rejected.

| Service | Expanded artifact, decimal MB | RSS after smoke, decimal MB |
| --- | ---: | ---: |
| Site | 265.9 | 130.7 |
| Docs | 426.1 | 459.7 |
| Blog | 848.0 | 216.2 |
| Handbook | 45.0 | 116.0 |
| Eclipse | 82.6 | 227.8 |
| Gateway | 1.3 | 138.7 |

These are single local samples, with GC and allocator variation between runs.
All services stayed below the 900 MB guards. Production load and concurrency
validation remain part of the production workspace follow-up. This change adds
no website content or dependency-version changes and leaves Vercel inputs and
build mode intact.


## GitHub connection setup (2026-10-13)

The Console project-create screenshot showed the `prisma` GitHub account but
only nine loaded repositories, with no match for `web`. Inspection of the
Console picker source (`RepoPickerBody` in the control-plane repository) showed
that its search filters loaded repositories by name; it does not search all of
GitHub. The likely first check is repository access in the workspace's Prisma
GitHub App installation: use **Add account**, choose the organization, and
include `prisma/web` in its selected repositories, then refresh the picker.
If more pages are available, **Load more** is also needed because the search
only covers loaded pages. The screenshot had no Load more control. Installation
access was not changed during this investigation; the CLI token could not list
organization installations without the `admin:org` scope.

Connecting the repository enables GitHub OIDC authentication, but deploys still
require the Prisma deploy workflow. The Console can propose that workflow in a
PR. Its build command must be `pnpm composer:build`, with the repo's pinned pnpm,
Node, and Bun available; the existing root `build` script retains Vercel mode.
The Composer setup was still on `codex/web-composer` in open PR #8458, so a first
preview must run code from that branch rather than unmodified `main`. Confirm
the target workspace, region, project identity, and integration variables before
production deployment. No project, connection, deployment, or domain was changed.

**Console improvement:** expose **Manage repository access** beside the account
picker and in empty search results, with a refresh action after the installation
changes. Explain that searches cover only loaded repositories, or implement
search across all accessible repositories. Distinguish missing installation
access from an empty search, and offer an existing Composer build-command
choice when proposing the deployment workflow.

References: [GitHub App repository access](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps)
and [Prisma deploy on push](https://www.prisma.io/docs/compute/deploy-on-push).

## Connected GitHub deployment setup — 13 October 2026

The repository is now connected to the Console project `web`. Console's setup
inspection still reads the default branch, where the Composer PR is not merged.
It identifies the shared `packages/ui` package as Next.js because it declares
Next dependencies, then blocks automatic setup because that library has no
build script. The five applications do have build scripts. The existing
Composer configuration on the PR branch is the intended deployment entrypoint.

The root module originally used `prismaweb`; it must be `web` to target the
connected project. The deployment workflow uses OIDC, an explicit
`pnpm install --frozen-lockfile`, and `pnpm composer:build`. The action's automatic
install detection supports npm/Bun rather than pnpm; its default build command
would also use the Vercel build path. Node 24 and Bun 1.4.3 are installed before
the action. Each website retains its separate artifact and 900 MB size guard.

The workflow selects the gateway from the action's service URL map and smoke
tests all five sites there. The gateway is also declared first: the action's
default URL selection chooses the first service with a root address when more
than one exists. A connected repository uses the platform's branch-deletion
automation for preview cleanup; the action currently cannot invoke CLI destroy.

**Product improvements:** distinguish workspace libraries from deployable apps
using app/config evidence instead of framework dependencies alone; show which
branch was inspected and let users choose an existing Composer branch and build
command; validate that the Composer module matches the connected project name;
support pnpm lockfiles directly in the deploy action; and let multi-service
modules declare their public entrypoint explicitly for deployment URLs and
Console links.

Local validation of the renamed module passed all 37 proxy tests, 9 Composer
checks, the complete build and six-service smoke test, all eight workspace type
checks, and workflow actionlint. The largest expanded artifact was blog at
848.0 MB. Docs had the highest sampled RSS at 488.1 MB; the other five processes
were below 224 MB. The smoke verified pages, static assets, Markdown, legacy
redirects, query handling, and current/legacy docs articles through the gateway.

The [first GitHub preview run](https://github.com/prisma/web/actions/runs/38428530811)
successfully exchanged GitHub OIDC for a short-lived workspace token and reused
the connected project. The Linux build passed every artifact guard (blog was
848.5 MB), but deploy preflight rejected six missing integration credentials.
`envSecret` bindings are required even when their input schema fields are
optional. Local dev had hidden this difference by supplying placeholders.

The fix makes external integrations explicit through `COMPOSER_INTEGRATIONS`
(`mixedbread`, `brevo`, `extensions`, `linear`). An empty selection binds no
credentials, allowing the initial pages/assets preview. Enabled integrations
still use real `envSecret` bindings, scoped to the websites that consume them;
missing values fail deployment. The workflow reads a non-secret GitHub variable,
with environment-level overrides for production or a particular preview. The
setup guide lists every required key and where to configure it. Unknown names
fail configuration, and regression tests cover empty selection, per-site secret
scope, and invalid selections. No fake cloud secrets are introduced.

**Compute/Composer improvements:** offer optional platform secret bindings that
honor optional schema fields, with an explicit unset value; clearly distinguish
local placeholder behavior from deploy requirements; and expose preflight before
the full build so missing credentials are caught before several minutes of work.

After merging the latest `main`, validation passed 37 library tests, 12 Composer
checks (including three credential-selection regressions), all eight workspace
type checks, the full build, and the six-service local smoke with no credential
bindings. The highest sampled RSS was docs at 488.2 MB. The deploy workflow skips
pushes limited to these two operational Composer guides so recording deployment
findings does not rebuild and redeploy unchanged services; website content is
not excluded.

## Compressed upload limit and blog media — 13 October 2026

The [second cloud attempt](https://github.com/prisma/web/actions/runs/38430380305)
passed OIDC, build and credential preflight. Five services deployed, but blog
failed in Alchemy before upload: `Prisma deployment artifact exceeds the
268435456 byte upload safety limit`. This is a separate hard 256 MiB archive
limit in `alchemy` 2.0.0-beta.78's `Prisma/Deployment.ts`; its validation does not
permit raising the limit. The 1 GB expanded filesystem guard alone therefore
did not establish deployability.

The blog's original public media is now distributed deterministically across
four small Compute services. Files are copied unchanged, with paths, sizes and
SHA-256 hashes in a catalog. Only the assembled Composer blog public directory
is removed; no source assets, website content, Vercel configuration or default
build output are changed. The gateway reads the catalog and original blog Next
manifest at boot, generating exact resource dispatch in memory. Parent rules
and Next redirects retain precedence; media receives the blog's original
headers. Static handlers stream files with ranges, HEAD, conditional requests
and validators, and serve only cataloged public files. The actual proxy entry
remains 22 lines; the vendored OSS library remains runtime-only.

Both expanded (900 MB) and compressed (240 MB) budgets now run during assembly.
The latter streams a system `tar` archive into a byte counter, leaving room
below the provider's 256 MiB cap for its bootstrap and tar-encoder differences.
Media shards have a separate 200 MB uncompressed cap, so incompressible images
cannot approach the upload limit. The first local build measured blog at
165.6 MB expanded / 38.1 MB compressed; media archives were 161–163 MB each.
Docs was largest at 426.1 MB expanded / 227.8 MB compressed.

Tests cover deterministic complete partitioning, oversized media, actual Bun
file streaming, ranges, HEAD, validators, private-file exclusion, retained
headers, exact dispatch, and Next redirect precedence. The full smoke now
checks an original file from every shard by hash through the gateway, as well
as ranges, HEAD, cache validation, and sampled memory across all ten services.

**Compute/Composer improvements:** advertise upload limits alongside memory and
expanded filesystem limits; include compressed-size checks in the normal
assembler and report the largest contributing files; align streaming upload
limits with supported runtime artifacts where possible; and provide a public
object-storage/CDN asset primitive so a large media collection does not require
four extra Compute services. The current packager builds the tar and gzip in
memory; streaming packaging would also reduce deployment-machine memory peaks.

Local validation on 14 October passed 37 proxy tests, 16 Composer checks, the
complete ten-service build and smoke, and lint. All 1,470 public media files were
cataloged; the smoke verified original bytes and HTTP behavior from every shard.
Docs sampled 421.6 MB RSS, the highest service sample; media services stayed below
95 MB. The local smoke initially caught a missing default service export in the
new media factory; each media service now has a small explicit default entrypoint.
Composer's node assembler could validate this bootstrap contract before
provisioning, and readiness could detect a process that immediately crashes
instead of first reporting deployment creation and relying on later HTTP checks.

## Compute ingress and public request origins — 14 October 2026

The [third cloud run](https://github.com/prisma/web/actions/runs/38436398041)
successfully deployed all ten services. Its gateway URL was selected correctly
by both the action and GitHub environment. One media startup took about three
minutes longer than its siblings, but deployment eventually succeeded. The
remote smoke then received 502 on the homepage, while the site service responded
200 directly. A controlled request to the site endpoint with the gateway's HTTP
`Host` returned the gateway's health response: Compute ingress routes by Host,
so preserving the public Host at the upstream connection caused a proxy loop.

The OSS proxy now sends the upstream Host and preserves public forwarded fields.
Its provider-neutral `upstreamHeaders` hook supports application header handling.
The web setup uses that hook to send authenticated public-origin metadata only
to the five named Next services. Their Composer bootstrap restores the public
host/scheme inside the Node HTTP request boundary, then removes the private
markers. This preserves hostname-based Next rewrites and server-action origin
checks without trusting arbitrary client headers or changing the Vercel path.

The workflow generates a masked CSPRNG key in `WEB_PROXY_KEY`. Existing values
are reused by deploy preflight; an absent key is provisioned into the target
environment from the workflow. Both ends use the same `envSecret` reference.
No external integration credentials are required for this internal hop. Tests
exercise actual HTTP forwarding, valid and forged markers, malformed hosts,
private-header removal, and exclusion of keys from media/external destinations.
The gateway entrypoint is now 24 lines, still just application wiring.

**Compute/Composer improvements:** document ingress Host routing and forwarded
header behavior; offer an authenticated service-to-service origin bridge in the
Next adapter; expose readiness/startup progress for a slow service; and make a
failed post-deploy smoke visible alongside deployment success in Console. The
action currently reports success before subsequent workflow verification runs.

The authenticated-hop revision passed all 37 library tests, 18 Composer checks,
the complete build and ten-service local smoke. The sampled maximum RSS was
461.6 MB (docs); each media service was below 90 MB. The internal key stayed out
of response headers and was excluded from external rewrites and media hops.

## Verified GitHub preview — 14 October 2026

[Run 38441243472](https://github.com/prisma/web/actions/runs/38441243472) succeeded
on code revision `9c8f63f4a`. All ten services deployed into the existing
project's `codex/web-composer` preview. GitHub OIDC authenticated through the
existing connection; the internal-key preflight checked one setting, filled
one absent value and reported no missing settings. Neither the repository
connection nor production domains were changed.

The public entrypoint is
[the gateway](https://dwgv6bi6aljw05msqzcpvtgg.ewr.prisma.build). Both the action's
primary URL and the GitHub deployment environment selected this gateway.
The remote smoke passed all five sites and their static assets, current and
legacy docs, Markdown content negotiation, imported redirects, repeated query
values, normalization and Next redirect precedence. Original media from all
four shards passed SHA-256, headers, range, HEAD and 304 validation checks.
Verification took about 16 seconds after deployment. The workflow completed
successfully, and all five Vercel preview checks also passed on that revision.

Linux artifact measurements: docs was largest at 425.4 MB expanded / 226.6 MB
compressed; blog was 166.1 / 37.7 MB; media shards were 171.3 MB expanded and
161.1–162.8 MB compressed; gateway was 1.7 / 0.4 MB. All budgets passed.
Local validation included 37 library tests, 18 Composer checks, all eight
workspace type checks, full build/smoke, lint and actionlint. Cloud RSS was not
measured by the remote smoke; the local samples remain in the setup guide.

External integrations remain an explicit opt-in requiring real keys. The next
production step is configuring the required integration/public build settings
before merging the workflow, then auditing domains and production load before
moving public traffic. The operational findings update does not redeploy
unchanged services because these two guides are excluded from push triggers.

## Ownership of the upload cap — 14 October 2026

The 256 MiB cap belongs to the **Prisma-specific provider inside Alchemy**,
not to a generic Alchemy engine limit. In the installed 2.0.0-beta.78 release,
`Prisma/Deployment.ts` defines `MAX_DEPLOYMENT_ARTIFACT_BYTES` as
`256 * 1024 * 1024`. The same constant remains in
[current upstream source](https://github.com/alchemy-run/alchemy/blob/1c1461cb8dad6c24a4824f36cb58b10cc3c5b7d1/packages/alchemy/src/Prisma/Deployment.ts#L46).
It governs file inspection, byte-array validation and the final upload guard.
The validation helper's `maxBytes` argument can lower the limit, but explicitly
rejects a higher value; deployment properties expose no override. An upstream
[regression test](https://github.com/alchemy-run/alchemy/blob/1c1461cb8dad6c24a4824f36cb58b10cc3c5b7d1/packages/alchemy/test/Prisma/Deployment.test.ts#L140)
also enforces that restriction. Updating Alchemy alone does not currently
remove it.

This proves the observed failure is client-side, before a PUT to the
presigned upload URL. It does **not** establish the maximum the hosted upload
and Foundry extraction paths accept. The inspected control-plane deployment
interactor asks Foundry to create a version and returns its upload URL; it does
not receive the artifact bytes or apply this 256 MiB check. Foundry's actual
upload/extraction limits still need confirmation or a live test.

The provider's file-backed hash and upload already stream in 64 KiB chunks.
The separate Composer Prisma Cloud packager remains memory-proportional to the
artifact: it reads every file into a buffer, concatenates the tar and calls
`gzipSync`. This is present in both the installed release and
[current Composer source](https://github.com/prisma/composer/blob/90a30381fb37bc204bcd003358c8bec28bec8d69/packages/1-prisma-cloud/0-lowering/lowering/src/compute/artifact.ts#L199).
Raising the provider cap does not solve that deployment-machine memory peak.

**Path to removing the workaround:** establish the platform's compressed and
expanded limits; align the Prisma provider's cap with the supported upload
limit; stream Composer's deterministic tar/gzip packaging to a temporary file;
then deploy a real artifact above 256 MiB and verify extraction, readiness,
original media bytes and memory. Preserve the Compute filesystem guard
independently. Consolidate the blog media services only after that succeeds.
The working Web preview and its limits are unchanged by this investigation.

## Proxy connections in the Console topology — 14 October 2026

The intended request path is Internet → gateway → the selected website or
media service. The gateway implements that path, but the Composer declaration
does not express its HTTP calls as dependency edges: every service currently
has `deps: {}`, and gateway upstream URLs arrive through `serviceOrigin()`
input bindings. Loading the real module with Composer 0.29.1 produced ten
services, zero dependency edges, zero authored edges and zero ports.

Console's `application-topology-layout.ts:publicServices()` infers entrypoints
as services that are not the provider of any submitted edge. With no edges,
it draws Internet arrows to all ten services. Those arrows are an inference
from declarations, not measured request traffic or configured routing rules.
The current diagram therefore omits the proxy connections. The Web runtime
works, but its communication topology is incompletely modeled.

This is also separate from network isolation. A read-only live check returned
200 from the gateway root and from the site root and docs page on their own
Compute URLs. Configuring the gateway as the public entrypoint does not make
the other endpoints private. `WEB_PROXY_KEY` authenticates public-origin
metadata in Next; it does not deny ordinary direct requests. A future
gateway-only access policy needs explicit enforcement, not a different diagram.

The installed SDK exports an untyped `http({ name })` dependency. A minimal
probe wiring a frontend's HTTP dependency to a provisioned backend produced a
flat dependency edge and a consumer input port, but **zero authored edges**:
the backend's bare ref has no exposed port for the topology exporter. The
exporter submits `graph.authoredEdges`, so replacing URL inputs with that bare
HTTP dependency alone would not fix this view. No cloud deployment was made
with the probe.

**Compute/Composer improvements:** support first-class raw HTTP provider ports
and dependency wiring through load, deployment and topology export; expose an
explicit ingress/access policy rather than inferring it from dependency
degree; and distinguish declared connections, public reachability and observed
traffic in Console. `serviceOrigin()` references could be shown separately as
configuration relationships, but should not automatically be treated as
traffic: website inputs also reference the gateway to form cross-site URLs.
Do not add unused RPC contracts solely to make a diagram look connected.

[Composer PR #358](https://github.com/prisma/composer/pull/358) merged on
16 October with the final API `rawHttpContract` and `rawHttp()` in
`@prisma/composer/http`. Raw HTTP declares no communication style. The original
proposal's `httpContract`/`http()` names and request/response styling were
revised before merge. Adoption and validation of the final API are recorded below.

## Original author of the 256 MiB limit — 14 October 2026

The constant was introduced by **Aman Varshney (`AmanVarshney01`)** in
[commit `74ff76499f4e64d7241d6aa5f6ef040d57378949`](https://github.com/alchemy-run/alchemy/commit/74ff76499f4e64d7241d6aa5f6ef040d57378949),
dated 10 July 2026 and titled `feat(prisma): harden management api provider`.
This is a pre-squash commit in
[Alchemy PR #416](https://github.com/alchemy-run/alchemy/pull/416), the original
Prisma provider PR, merged by Sam Goodwin on 29 July 2026. The squash commit
`92f9b3a` shows the same constant, but the earlier commit identifies when it
was actually added.

The original addition is at
[Deployment.ts line 49](https://github.com/alchemy-run/alchemy/blob/74ff76499f4e64d7241d6aa5f6ef040d57378949/packages/alchemy/src/Prisma/Deployment.ts#L49).
It also adds the validation that refuses a higher `maxBytes` and the final
upload guard. The immediately preceding `ComputeVersion.ts` upload code reads
the artifact into memory and has no equivalent size guard. This was therefore
a new client-side bound in the hardening change, not merely a rename of an
existing upload cap.

The error names it an "upload safety limit". Neither the commit message nor
the matching PR discussions inspected document why **256 MiB** was selected
or cite an underlying hosted-platform size constraint. Aman is the direct
contact for that rationale; the code history alone does not establish it.

## HTTP ports adopted — 16 October 2026

The Web module now wires all nine gateway upstreams through real Composer HTTP
ports. Each website and media service exposes `rawHttpContract`; the gateway
consumes a named `rawHttp()` dependency for each and reads its URL from
`service.load()`. The proxy continues using its existing raw Bun transport and
authenticated origin bridge, preserving headers, redirects, streaming and media
ranges. Its runtime entrypoint is 27 lines. No routing-plan file is generated.

The actual `module.ts` graph has ten services, eighteen HTTP ports and nine
authored connections. The published Prisma Cloud topology exporter produces
nine `communication` edges with no style. Passing that payload to Console's
actual `publicServices()` selects only `gateway`, so the intended map is
Internet → gateway → five websites / four media shards. The committed regression
loads the real module and checks every upstream connection and both endpoint
ports. Website `gatewayOrigin` remains URL configuration rather than a reverse
communication edge. This changes the declared topology, not direct reachability.

The stable Composer release `0.30.0` was published on 15 October, before the HTTP
merge. The feature is available in the published **`0.30.0-dev.9`** build from
16 October. Both SDK dependencies and Prisma's transitive Composer CLI are
pinned to that exact build. A pnpm override is necessary because the existing
Prisma CLI `8.0.0-rc.22` otherwise installs Composer CLI `0.29.1`. Both CLI builds
use CLI engine `0.7.0`; the Prisma CLI version itself is unchanged. Exact
minimum-release-age exclusions cover the three deliberately selected Composer
packages. Move these pins together to a stable release once it contains HTTP.
The existing `capnp-es` TypeScript 7 peer warning is unchanged by this upgrade.

Providers are provisioned while evaluating the gateway's dependency bindings,
so the gateway is no longer the first service in provisioning order. The
existing GitHub environment URL and remote smoke explicitly use `urls.gateway`,
which remains the public preview entrypoint.

The actual `pnpm dev --detach --json` command started all ten services and
reported the gateway endpoint. The full gateway smoke passed all five websites,
assets, Markdown, current/legacy docs, Vercel and Next redirects, query handling,
and original media bytes/ranges/HEAD/cache behavior from every shard.

Two upgrade details deserve upstream follow-up. The emulator moved process state
from `compute/apps.json` to `compute/instances.json`, with app/directory/address
labels instead of a nested app service map. The smoke runner now reads that
layout, limits its memory samples to this checkout's Web services, and requires
all ten processes to be present. A public process-inspection API would avoid
coupling memory checks to internal state files. Also, although the selected
Composer CLI advertises `dev url` and `dev stop`, `prisma dev url gateway --json`
through Prisma CLI `8.0.0-rc.22` was parsed as the parent `dev` command and failed
with `CLI.INVALID_ARGUMENTS` (too many arguments). The main `dev` command works;
the public SDK's `devStop()` successfully stopped the detached stack. Improve
CLI-family compatibility checks or ship a documented version matrix so matching
peer versions also guarantee the advertised subcommands work together.

Validation: the full ten-service build, 37 proxy tests, 19 Composer checks,
eight workspace type checks with the existing Vercel origins, formatting, lint
and frozen-lockfile installation pass. The largest archive remains docs at
227.8 MB, and all services satisfy the existing expanded/upload budgets.
The default `pnpm composer:smoke` also passed its complete SDK-owned startup,
HTTP checks, memory sampling and cleanup. Docs was the largest sampled process
at 425.5 MB RSS; the gateway sampled 139.2 MB. All ten service processes stopped
successfully afterwards. These local samples are not a concurrency load test.


## 768 MiB upload limit and blog consolidation — 16 October 2026

[Alchemy PR #2257](https://github.com/alchemy-run/alchemy/pull/2257) merged on
14 October as `891c46f23e9403a8d21cce164938d2fac492a8a0`. It raises the
compressed deployment upload ceiling from 256 MiB to **768 MiB / 805,306,368
bytes**, along with the generic archive, staging and website total bounds.
Uploads now have a fifteen-minute timeout; the generic 128 MiB per-file and
50,000-entry limits are unchanged.

Composer `0.30.0-dev.9` resolves Alchemy `2.0.0-beta.83`, published on
12 October, which still contains the old limits. The official PR preview at
`pkg.alchemy.run/alchemy/pr:2257:fb131d1` expires on 21 October after the PR
closed. Depending on it would make later clean CI installs fail. Instead,
`patches/alchemy@2.0.0-beta.83.patch` carries the exact five-file upstream
behavior change, plus corresponding compiled JavaScript and declaration
comments. Both exports matter: Bun selects `src/*.ts`, while Node selects
`lib/*.js`. Regression checks resolve the provider from Composer's own package
under both runtimes and confirm its active cap. The lockfile records the patch
hash; a frozen install passes. See `patches/README.md` for removal instructions.

The whole blog now measures **848.0 MB expanded / 685.1 MB compressed**, including
all 1,470 original public files. It satisfies the unchanged 900 MB expanded
budget and a new 750 MB compressed budget, leaving about 52 MB and 65 MB of
headroom respectively. Source media totals 682,419,712 bytes (650.8 MiB); its
largest file is 43,470,561 bytes. No media or website content is modified.

This works with the current Composer packaging path: its own tar/gzip writer
passes an artifact file to Alchemy's `Deployment` uploader. It does not call
Alchemy's generic `createComputeArchive()`, whose expanded ceiling is also
768 MiB and would reject the full blog. Keep expanded and compressed limits
separate; revalidate this distinction if the Composer packager changes.

The module now has **six services, five HTTP connections and ten ports**:
Internet → gateway → five websites. All media stays with the blog's Next server.
The four shard services, partitioner, file catalog, static server and gateway
media interception are removed. The gateway no longer ships a blog manifest
or media catalog; Next handles its own redirects and headers directly. The
smoke selects original files from the checkout, covers representative formats
and the largest file, and verifies hashes, byte ranges, HEAD, ETags and headers.
The memory check counts only running services belonging to this checkout,
allowing old stopped emulator instances to remain as local state.

Local validation passed: all five website builds and assembled size guards,
37 proxy tests, 18 Composer checks (including both provider runtime exports),
declaration types, formatting, lint and frozen installation. The complete
six-service smoke passed pages, assets, current/legacy docs, redirects,
Markdown and all selected original media, including the largest 43.5 MB GIF.
Blog RSS sampled 242.0 MB after those requests; docs was the largest process at
417.9 MB. All service processes stopped afterwards. The matching GitHub
preview deploy and upload result are linked from PR #8458.

The old custom media server returned 304 even when Node fetch implicitly added
`Cache-Control: no-cache` to a conditional request. Next honors that forced
reload and returns 200. The smoke now explicitly selects fetch's `no-cache`
revalidation mode, which sends `max-age=0`, and confirms a genuine 304. This
changes the test request, preserving the framework's existing cache behavior.

**Compute/Composer improvements:** publish compatible, durable development
artifacts for merged fixes; a seven-day PR download is unsuitable for a
long-lived deployment branch. Expose compressed and expanded artifact limits as
separate capabilities rather than requiring consumers to infer them from the
packaging path. Composer's current tar/gzip writer also holds the source files,
tar and compressed buffers in memory; stream packaging and hashing to disk to
reduce CI memory as artifact sizes approach these larger limits. Build-machine
memory is separate from the service's 1 GB runtime allowance.


### Real cloud upload and readiness observations

[GitHub run 38904449879](https://github.com/prisma/web/actions/runs/38904449879)
on commit `1301c2edd` successfully uploaded and deployed the consolidated blog.
Linux measured 848.5 MB expanded / 684.2 MB compressed. The four media services
and deployments were deleted. The uploader cap therefore works beyond 256 MiB
on the real GitHub/Compute path, not only in local constant checks.

The immediate post-deploy smoke then saw a 404 at `/blog`, despite the deploy
operation reporting success. Later direct and gateway requests returned 200
without another deploy, and the complete remote smoke passed, including the
largest GIF's original bytes, byte ranges, HEAD, ETag revalidation and headers.
This is consistent with a routing/service-readiness window; the precise
platform cause was not established. Initial landing-page probes now allow a
bounded two-minute startup window for 404/502/503 responses. Ordinary article
and asset 404s and application 500s still fail. A local HTTP fixture verified
startup retries and immediate failures for normal 404s and application 500s.
Full media downloads have a separate two-minute client deadline: the largest
file exceeded the old ten-second deadline from the local remote client.

**Platform improvements:** expose a routable/healthy state and keep the previous
version serving until that state is reached, rather than treating version
creation/start as HTTP readiness. Cleanup also logged four best-effort
`config_variable` deletion-report 404s after those variables were removed;
deploy itself completed. Change reporting should be able to record a deletion
without requiring a deleted resource to remain queryable.

Consolidation trades independent media deploy hashes for fewer services and
less proxy/static-server code. Blog code/content deployments now carry its
unchanged media too. Object storage or a separate media origin can avoid that
re-upload if deployment size or further media growth becomes a concern.

## Live blog performance comparison — 16 October 2026

Compared the [Compute gateway blog](https://dwgv6bi6aljw05msqzcpvtgg.ewr.prisma.build/blog)
with [production](https://www.prisma.io/blog) from the local Bangkok machine.
Chrome 155.0.8059.80 / Lighthouse 13.5.0, sequential alternating runs, fresh browser
profiles and no consent interaction. These are local lab results, not global
measurements, field percentiles, controlled service cold starts, or load tests.
The preview was verified against successful deployment run
[38906855672](https://github.com/prisma/web/actions/runs/38906855672), head
`ffb80bcf04c40bce842f095e44bc68f13920cf96`.

| Median | Compute | Production |
| --- | ---: | ---: |
| Fresh-connection HTTP TTFB, 10 samples | 813 ms | 191 ms |
| Full compressed HTML, 10 samples | 1.13 s | 0.19 s |
| Desktop default Lighthouse score, 3 runs | 61 | 87 |
| Desktop simulated LCP, 3 runs | 5.07 s | 2.40 s |
| Applied mobile LCP, 3 runs | 3.95 s | 3.47 s |
| Applied mobile blocking time, 3 runs | 482 ms | 723 ms |
| Applied mobile Lighthouse score, 3 runs | 66 | 62 |

Applied mobile settings: 150 ms request latency, 1,600 Kbps download, 750 Kbps
upload, CPU slowdown ×4; 412×823 viewport. Default desktop uses Lighthouse's
simulation, so the desktop and applied mobile rows use different methods.
Default simulated mobile scores were 63 / 67 and simulated LCP 8.42 / 9.48 s;
their LCP ranking differed from the observed trace. The separate applied
throttling runs validate the mobile comparison. Scores alone obscure the
tradeoff between earlier content and less JavaScript blocking.

All 30 HTTP requests returned 200. Both indices are **prerendered**: Compute
returned Next cache HIT/prerender headers and production Vercel cache HIT with
`sin1` routing. Compute's TCP connect median was 268 ms versus production's
21 ms. Direct Compute blog requests had 900 ms median TTFB, so bypassing the
gateway did not remove the gap. This supports geography/edge delivery as a
major factor; independent requests do not isolate the exact proxy overhead.
Compressed HTML sizes were nearly equal at about 23.5 KB.

This is a comparison of actual deployments with different commits/configuration.
The preview listing includes `is-prisma-8-ready-for-long-lived-production-apps`
where production includes `host-a-test-version-without-replacing-production`.
The former's approximately 615 KB PNG explains much of the larger desktop
Compute transfer (4.16 MB versus 3.72 MB during the audits). Both preload about
0.83 MB of fonts and download a 482 KB author image displayed at about 28×28
pixels. Desktop JavaScript transfer is about 1.21 / 1.30 MB, including third
parties. Preview QA also reported missing PostHog configuration, a CookieYes
hostname mismatch and a secondary FontAwesome kit 403; production shows the
consent banner. These differences prevent a pure hosting-only attribution.

**Improvements:** edge delivery of static HTML/assets with correct Next/RSC
variation and invalidation; build-time responsive image formats/sizes; font
subsetting and selective preloads; deferred optional client code and explicit
preview analytics/consent configuration. Validate from EWR/US as well before
making a global claim. Keep frontend optimizations separate from this structural
Composer PR.

Full methodology, ranges, HTTP headers, screenshots, 18 Lighthouse JSON/HTML
reports and reproduction scripts are saved locally in
`output/playwright/blog-performance-2026-10-16/`, with `REPORT.md` as the entry
point. No application, deployment, or production configuration was changed.

## Cloudflare custom-domain baseline and origin cache policy — 23 October 2026

At baseline, the custom domain `https://prisma.sorenbs.com` targeted the branch gateway
`https://bgbhakfqfiubyt7jh8c0eerb.ewr.prisma.build`, verified in successful
[deployment run 39432175818](https://github.com/prisma/web/actions/runs/39432175818)
on `043a33b5766c856f624c2a3571cc29c89300cb38`. The older generated domain used on
16 October is a different gateway; it is not the direct-origin control for this
experiment.

Before any origin/cache-rule changes, 10 fresh-connection GET samples per page
and target, followed by three sequential browser runs per profile, gave:

| Median | Cloudflare custom domain | Same gateway directly | Production |
| --- | ---: | ---: | ---: |
| `/blog` TTFB | 330 ms | 836 ms | 199 ms |
| `/` TTFB | 353 ms | 820 ms | 152 ms |
| Blog desktop Lighthouse score | 81 | 69 | 90 |
| Blog desktop simulated LCP | 2.35 s | 3.06 s | 2.04 s |
| Blog applied mobile LCP | 4.94 s | 4.05 s | 3.50 s |
| Blog applied mobile Lighthouse score | 61 | 63 | 61 |

Chrome 155.0.8059.85 / Lighthouse 13.5.0 on the same Bangkok machine. Desktop
uses standard Lighthouse simulation; mobile applies 150 ms request latency,
1,600/750 Kbps download/upload and CPU ×4. Browser caches were reset, CDN caches
were allowed to warm, and tests ran sequentially. A measurement round overlapping
pnpm's automatic dependency verification was discarded and replaced after local
checks finished. Raw discarded samples are retained separately. These are small
local lab samples; mobile results are mixed and do not establish a universal
Cloudflare speedup. Production and the preview also have different content and
analytics/consent configuration.

Cloudflare returned `DYNAMIC` for every landing HTML request despite the origin's
`s-maxage=31536000`. Hashed CSS/fonts went from `MISS` to `HIT`; public blog
images instead returned `REVALIDATED` because Next sends `public, max-age=0`.
One stylesheet went from a 1.98 s miss to a 66 ms hit. Browser network logs
confirm asset hits while HTML remains dynamic. The faster dynamic HTML path is
consistent with Cloudflare's network and reused origin connections; it is not
evidence of HTML cache hits.

Cloudflare distinguishes eligibility from freshness: proxied DNS enables its
default extension-based eligibility; HTML needs a Cache Rule. The user prefers
the origin to own freshness. The gateway therefore caps default public
prerendered HTML at `CDN-Cache-Control: public, max-age=60`, retaining browser
revalidation, shorter framework lifetimes and explicit application CDN policies.
Dynamic/private HTML and request variants cannot opt into this default shared
cache. Streamed/compressed bodies, assets, RSC and Markdown keep their transport
and existing non-HTML cache behavior. Conditional HTML 304s retain the cap.

`composer/cloudflare-cache-rule.json` describes an eligibility-only experiment
for `/` and `/blog`, with **no edge/browser TTL override**. Its request guards
exclude cookies, authorization, queries, RSC/Next navigation and agent/Markdown
negotiation before cache lookup. This prevents a cached HTML entry being served
to another representation. The Cloudflare rule must be enabled only after the
one-minute origin policy is deployed; then measure and verify actual `HIT`/`Age`
responses and request variants. No Cloudflare configuration has been changed
by the agent at this stage; the user requested instructions to apply the rule.

**Compute/Composer improvements:** provide deployment-aware edge caching and
invalidation for static HTML/assets, with framework-aware representation keys;
make the difference between a proxied custom domain and HTML cache eligibility
clear in setup documentation. Next's one-year prerender cache header assumes a
platform invalidation mechanism and should not silently become a year of stale
HTML on an independent CDN. Public-image caching needs its own explicit origin
policy if repeated revalidation is undesirable; do not treat unhashed image
URLs as immutable automatically.

Raw HTTP samples, Lighthouse reports, network logs and reproduction scripts are
saved locally in `output/playwright/blog-performance-2026-10-23/`. The historical
baseline is kept separate from measurements after code/rule changes.

### Deployment verification and custom-domain blocker

[PR #8585](https://github.com/prisma/web/pull/8585) introduces this policy on the
same `codex/web-composer` branch. Its code head
`ef0ea50b61ca8095278703d63b454d1ccd1e6341` passed the
[preview deployment and deployed smoke checks](https://github.com/prisma/web/actions/runs/39970460050),
including the actual landing-page cache headers. The Linux Composer build/local
stack CI and all five Vercel previews passed. Direct checks against the new
gateway `https://lvec8wy0mj35re22xqygszwq.ewr.prisma.build` also verified cookies,
authorization, prefetch, query strings, Markdown/agent requests, RSC and HTML
conditional 304s. Next redirects bare RSC requests to the `_rsc` query variant;
following that redirect returns the component representation. The root Markdown
document is served as `text/plain` and remains Markdown rather than cached HTML.

The original Composer PR #8458 merged on 20 October and GitHub deleted its head
branch. Recreating that branch for #8585 produced six different service IDs;
the infrastructure definitions and dependency versions were identical to the
previous deployment. The old gateway now returns 404 and its service is no longer
present in the Management API. The custom hostname also returns the Compute
"No app deployed" 404, while the new generated gateway is healthy. The new
gateway's domain list is empty. This is a routing/identity problem, separate
from Cloudflare caching; the precise service replacement cause is not established.

An attempt to reattach the existing hostname through
`POST /v1/services/{serviceId}/domains` was rejected with HTTP 400 because the
Prisma DNS verifier cannot see a CNAME behind Cloudflare's proxied DNS. No domain
was created by that attempt, and no Cloudflare settings were changed. The user
must temporarily expose the CNAME using DNS-only mode so it can be reattached,
then restore proxying. The local CLI also rejects preview-domain commands before
calling the API, despite Console supporting that use case.

**Product improvements:** preserve or explicitly migrate custom-domain routing
when a preview service is replaced; surface a warning before the previous target
is removed; support ownership verification for proxied hostnames (for example,
TXT verification); and keep CLI preview-domain support aligned with Console.
Do not enable the HTML rule or report after-rule performance until the hostname
serves the verified new gateway. Capture the new deployment's uncached baseline
before applying the eligibility rule so newer content is not attributed to caching.

## Custom-domain recovery and measured HTML caching — 24 October 2026

The user reattached `prisma.sorenbs.com` to gateway
`https://lvec8wy0mj35re22xqygszwq.ewr.prisma.build` and restored Cloudflare proxying.
All websites and their static assets serve successfully through the hostname.
The direct gateway passes the complete deployed smoke test, including original
media, ranges, HEAD, conditional requests, redirects, Markdown and legacy articles.

Subsequent investigation narrowed the replacement cause to the preview lifecycle.
PR #8585 merged at 21:34:12 Bangkok time on 23 October; GitHub deleted its head
branch three seconds later, while its preview build was still running. The
control plane's [GitHub delete handler](https://github.com/prisma/pdp-control-plane/blob/3eb81042bb511b59adf69c84054fe9276df95277/services/github-webhook/webhook-handlers/handleDelete.ts)
calls preview teardown, which purges branch state and removes service endpoints.
The running workflow connected around 21:41 and planned `45 to create`, using
`br_aj7z9r1362pmcrvlg79w39qc` instead of `br_dlot727q9c8gtwvtsyy73eau`. This
sequence explains a fresh environment after deletion and the lost domain binding.
The individual production webhook delivery trace has not been retrieved. Keep
the test hostname on a persistent Git branch; a stale workflow should be rejected
after branch deletion. The GitHub-delete path currently bypasses the pin guard
used for idle cleanup, so pinning alone does not protect this case.

A fresh baseline was recorded after recovery. The user then enabled the exported
Cloudflare eligibility rule, and the same deployment was measured again. All six
service/version IDs remained unchanged, and the before/after HTML fingerprints
match for the custom domain, direct gateway and production control.

| Median | Cloudflare before rule | Cloudflare after rule | Direct Compute | Production |
| --- | ---: | ---: | ---: | ---: |
| Blog TTFB | 326 ms | 64 ms | 826 ms | 195 ms |
| Homepage TTFB | 353 ms | 74 ms | 819 ms | 166 ms |
| Desktop Lighthouse score | 84 | 80 | 69 | 89 |
| Desktop simulated LCP | 2.68 s | 3.57 s | 3.09 s | 2.16 s |
| Observed desktop LCP | 1.25 s | 0.94 s | 2.84 s | 0.42 s |
| Applied mobile Lighthouse score | 71 | 61 | 62 | 60 |
| Applied mobile LCP | 3.36 s | 4.57 s | 4.03 s | 3.48 s |

Ten fresh-connection HTTP GETs per page, target and phase; three independent
browser audits per target/profile. Direct/production browser controls were
collected between the custom-domain before/after series; their HTTP controls
were repeated in both phases. Chrome 155 / Lighthouse 13.5.0, from Bangkok.
Desktop uses standard simulation; applied mobile uses 150 ms latency,
1,600/750 Kbps throughput and CPU x4. Browser caches reset between audits;
server/CDN caches were warm. These are small local lab samples, and the live
production site has different content and analytics/consent settings.

The rule reduced blog TTFB by about 80%. Nine of ten blog HTTP requests hit the
edge cache and one revalidated; all six browser documents were `HIT`, compared
with six `DYNAMIC` documents before. The origin still sets the 60-second CDN
lifetime and browser revalidation. Runtime probes verified cookie, authorization,
query, prefetch, RSC and Markdown/agent variants bypass the cached HTML; origin
conditional 304s retain the cap. The user changed Cloudflare configuration; no
application code or deployment was changed during these measurements.

Whole-page results are mixed: observed desktop LCP improved, while simulated
desktop and applied mobile LCP worsened. The mobile waterfall shows the same
featured hero image taking longer despite earlier HTML/CSS delivery. The hero
lacks explicit high fetch priority, roughly 0.8 MB of fonts is preloaded, and
other images compete for bandwidth. These are follow-up candidates rather than
an isolated diagnosis; faster HTML alone does not establish a whole-page speedup.
Public avatar/hero files still revalidate under `public, max-age=0`. Future
Compute edge delivery should handle asset freshness and deployment invalidation
as well as HTML caching, and provide framework-aware request variation.

One CDN transport limitation remains: the strict custom-domain smoke failed a
range assertion for the 43,470,561-byte GIF. Its full-file hash matched, but
Cloudflare returned the entire file as HTTP 200 for `Range: bytes=0-15`, with
`REVALIDATED` and no Content-Length. The direct gateway returned HTTP 206 and
exactly 16 bytes. [Cloudflare documents full responses during decompression](https://developers.cloudflare.com/cache/reference/range-requests/),
but the exact cause here has not been established. Do not label the complete CDN
smoke as passing or attribute this difference to the origin proxy without evidence.

The documentation-only preview deployment from 23 October separately failed an
artifact upload with HTTP 502 after updating four website versions. Site and
gateway still run the preceding successful deployment; both commits have identical
service source. That failed job was not retried for this experiment.

Raw samples, 24 Lighthouse audits, 192 successful HTTP responses, request-variant
probes, smoke logs and reproduction scripts are retained locally in
`output/playwright/blog-performance-2026-10-24/`, with `REPORT.md` as the entry point.

## Global parity investigation and follow-up — 24 October 2026

The recovered domain is not yet at Vercel parity for all visitors. Seven-region
measurements retained 176 successful responses: 28 blog GETs, 140 interleaved
HEAD metadata checks and eight direct gateway/blog checks. Warm landing hits
can beat Vercel, but the existing rule excludes articles, docs, cookies and
campaign parameters, while public images revalidate on every request. This
penalizes users outside the origin region. Three fresh interleaved mobile pairs
also reproduce a slower LCP with cached HTML (4.887 s median versus 3.651 s on
the cookie-bypass variant). Both load about 830 KB of fonts and compete for the
same featured image; the exact contribution of each resource is not isolated.

The [investigation report](composer/performance/2026-10-24.md) records the regional
matrix, methodology, raw measurement identifiers, limitations, proposed fixes
and remaining acceptance gates. Its [retained regional data](composer/performance/2026-10-24-regional-baseline.json)
includes locations, networks, PoPs, statuses and component timings. Globalping's
`firstByte` excludes DNS/TCP/TLS; reported TTFB adds them rather than comparing
it directly with curl's cumulative `time_starttransfer`. An earlier full-body
article probe attempt hit internal probe timeouts and was discarded; these
were not counted as site failures.

The follow-up gives the actual public-file inventory bounded edge freshness,
adds background revalidation, expands the proposed HTML eligibility rule and
allows invariant prerendered documents with cookies and distinct query keys.
It also removes unused font preloads, prioritizes the featured blog image and
lazy-loads author avatars without changing content, typography or original
assets. Vercel retains its deployment cache and receives the browser resource
improvements too. The proxy library and its runtime Vercel plan are unchanged;
the build-generated inventory contains public file paths, not a routing plan.

All five builds and the complete local Composer smoke pass, including original
43 MB media, ranges, conditional requests, redirects, Markdown and articles.
Local sampled RSS peaks at 459.8 MB for docs; the gateway is 142.9 MB. The largest
bundle remains blog at 850.7 MB expanded / 686.6 MB compressed. Proxy tests (37),
Composer tests (32), blog tests (85), Composer types and formatting pass. The
preview deployment, new rule activation and after-change measurements remain
to be verified before claiming an improvement or global parity.

**Compute/Composer improvements:** deployment-aware edge caching and atomic
invalidation; framework-aware HTML/RSC keys; shared cache fills and regional
origin placement; streaming conditional/range transport; per-hop latency and
cold-start attribution; standard regional/browser performance gates. A single
EWR origin and a short-TTL cache cannot guarantee Vercel-equivalent latency for
cold, unique-query or uncached navigation requests. These are explicit remaining
requirements, not hidden behind a warm Bangkok score.


### Public SSR documents and content validators

Further investigation found that article generation is intentionally disabled in
Composer builds to fit the file budget. Docs/blog articles therefore carry
Next's private SSR cache policy; widening the Cloudflare rule alone cannot cache
them. Composer-only route annotations now opt repository-backed public MDX into
the gateway policy, retaining request/status/Set-Cookie/Vary checks. Other SSR
pages stay private. This avoids an unbounded generated HTML/RSC runtime disk cache.
The separate Vercel-mode docs build, docs types and links (729 files) pass.
The final local smoke explicitly checks article CDN headers; its largest sampled
RSS is docs at 413.2 MB and gateway at 143.0 MB.

The first follow-up preview (`d011884df`) passed every GitHub check and all Vercel
previews. Public images became fresh hits, but Cloudflare still returned a full
200 for the largest GIF range, including on a fresh query key with no-transform
in standard Cache-Control. Bypassing Cloudflare while preserving the custom Host
returns the correct Content-Length and 16-byte 206. The policy now also puts
no-transform in CDN-Cache-Control and retains it on 304s; the new deployed result
must still be measured, rather than claiming that this candidate fixes the CDN.

The live Next file ETag encodes file size plus a fixed one-second timestamp
(`W/"2974ee1-3e8"` for the GIF). Same-size edits can therefore alias across
reproducible artifacts. The responsible archive/restore layer is not yet isolated.
The build now streams SHA-256 hashes into the 2,708-file inventory (442 KB), and
the gateway substitutes content validators for these size/mtime tags. Conditional
reads, preconditions and If-Range are checked without buffering file bodies;
encoded representations use weak tags and unreliable Last-Modified dates are
removed. Equal-size edits are covered by regression tests. Compute should provide
content validators and correct range transport for static artifacts natively.

Deployment-aware invalidation also needs asset retention or purge: stale HTML
can reference hashed chunks removed by a newer version. The six-minute bound is
not a production replacement for Vercel's deployment cache. This remains an
explicit parity/release gate in the report. The same-source Vercel preview is SSO
protected, so the public production control still has different content/build
and analytics configuration.


### Range failure traced to Bun's streaming response framing

The CDN was receiving a full streamed response without Content-Length. A bare
Bun 1.4.3 reproduction serves the original Bun.file with its 43,470,561-byte
length, but fetched/ReadableStream responses discard a manually supplied length
and become chunked. HEAD and short ranges retain a length, which obscured this
in the earlier probes. Direct streamed GETs on Compute show the same behavior.
No-transform cannot repair a header removed before Cloudflare receives it.

A Node HTTP server running on the same Bun preserves the exact length while
streaming. The OSS package now exports createHttpServer from @prisma/proxy/node,
and the gateway uses it. This keeps Bun and streams, without a Node binary,
extra dependency or full-file buffer. Node and Bun wire tests cover a 2 MiB
multi-chunk body, HEAD, 304 without an incorrect zero length, gzip bytes, separate
cookies, streamed POST, cancellation and abort propagation. A 128 MiB synthetic
response to a 1 KiB/s client produced only 1,966,080 bytes before cancellation;
the producer did not buffer the whole body. The complete local stack passes the
new full-GET length assertions, original media/ranges, article CDN policy,
redirects and Markdown. Gateway sampled RSS is 187.7 MB; docs is 407.8 MB.

The content ETag namespace is asset-v1, forcing one replacement of CDN objects
that were stored without Content-Length rather than perpetually validating
that old metadata. There are now 40 Node library tests, 32 Composer tests and
three Bun HTTP-adapter tests. Live CDN verification remains pending. Composer
should recommend or provide a streaming HTTP adapter with known-length support
when generating proxy examples for Bun services.

The final cache-policy source f1db7ec09 passed all GitHub checks, all five Vercel
previews and Compute deployment 40077691873. On that exact deployment, a fresh
seven-region baseline retained 112 successful HEAD measurements for articles,
docs, cookies and tracking-query visits before widening the eligibility rule.
All 56 custom-domain responses still reported DYNAMIC, despite correct origin
CDN headers. Raw responses and service/version snapshots are retained locally
under output/playwright/global-performance-2026-10-24. The rule update is a
separate operator step; source changes do not make Cloudflare HTML eligible.

### October 24: verified transport fix, browser results, and the read-only image cache

Source 2a037aa4c passed every GitHub check, all five Vercel previews, and Compute
workflow 40081258292. The complete custom-domain smoke passed too, including
original media hashes, full-GET lengths, redirects, Markdown and articles.
Cloudflare now serves a 16-byte range of the 43,470,561-byte GIF as 206/HIT with
Content-Range and the content-based asset-v1 validator. This verifies the
streaming HTTP adapter fix beyond HEAD/local tests.

Three interleaved audits per browser profile, from the same Bangkok machine,
used source 2a037aa4c with browser caches reset and edge resources warm. Service
version snapshots before/after all audits were identical. Lighthouse 13.5.0,
Chrome 155; mobile uses applied 150 ms latency, 1,600/750 Kbps and CPU x4.
Desktop Lighthouse simulation and observed paint are recorded separately.
The live production site has different builds/content/analytics, so these are
operational comparisons, not an isolated hosting experiment.

| Blog metric (median, 3 runs each) | Compute + Cloudflare | prisma.io / Vercel |
| --- | ---: | ---: |
| Desktop score | 99 | 90 |
| Desktop simulated LCP | 0.862 s | 2.084 s |
| Desktop observed LCP | 0.196 s | 0.421 s |
| Mobile score | 82 | 66 |
| Mobile applied LCP | 2.466 s | 3.464 s |
| Mobile transfer | 2,487,806 bytes | 3,352,414 bytes |

The font change reduces early contention, rather than eliminating italic font
transfer: CSS still requests Inter italic. Mobile font wire bytes were 788,333
versus 829,343, while total payload fell about 26%, principally from deferred
images. Do not describe this as removing 388 KB of font downloads.

One-run screening of other pages exposed why a blog-only conclusion would be
misleading. Docs mobile LCP was 2.603 versus 3.462 s; article mobile was 2.158
versus 3.523 s. However desktop docs was slower (2.492 versus 2.080 s simulated;
1.276 versus 0.483 s observed), and the homepage texture was much slower.
Homepage desktop LCP was 4.894 versus 2.550 s simulated / 3.911 versus 0.507 s
observed. Mobile was poor on both: 15.177 versus 14.959 s. These are single
screening samples, not robust medians or evidence of global parity.

The homepage texture's Next image request took 3.616 s in that desktop trace,
versus 85 ms on Vercel. Repeated manual origin-path requests still reported
x-nextjs-cache MISS and Cloudflare DYNAMIC. Read-only preview logs provide a
concrete cause: EACCES creating
/mnt/app/code/bundle/apps/site/.next/cache/images, including failed cache writes
and unhandled rejections. Next was optimizing repeatedly because its default
cache location is inside Compute's read-only application directory.

The follow-up uses Next 16.3.4's documented custom image-cache hook, with a
16 MiB / 256-entry in-memory LRU. Oversize images work without being retained.
Next's original handler still reads prerendered seeds and manages its existing
bounded page/fetch memory cache, with filesystem writes disabled. It is enabled
only for the Composer site build; Vercel's cache configuration is untouched.
The adapter's delegation uses a pinned Next internal module, guarded by tests
for seed reads, fetch/tag invalidation, no runtime writes, image LRU bounds and
binary/timestamp retention. The smoke test now demands repeated optimized-image
cache hits and correct separate WebP/JPEG responses. The homepage's above-fold
texture also gets eager/high-priority loading; other textures remain lazy.
Live verification of this follow-up is pending its deployment.

### One Cloudflare rule, with policy owned by the origin

The operator explicitly rejected maintaining route-specific Cloudflare rules.
The supplied rule is now just `(http.host eq "prisma.sorenbs.com")`, cache
eligible, origin-controlled Edge/Browser TTLs, full query key, and Vary Default
Passthrough. There are no per-route, cookie, agent, image-format or framework
lists in Cloudflare. Earlier HTML/image rule instructions are superseded.
Cloudflare documents generic Vary handling on all plans. Its default value is
the key setting: it follows every Vary header the origin actually emits,
without a Cloudflare header allowlist to maintain.

Vary must be configured, not assumed. When only the optimized-image expression
was applied without Vary handling, a request accepting image/jpeg received the
previously cached image/webp as a HIT. This was reported immediately, with an
instruction to disable that rule until representation separation is enabled.
A broad eligibility rule without Vary would also mix Next/Markdown responses.
The gateway therefore restores Accept/User-Agent and relevant authorization/
Next request headers in HTML Vary after Next overwrites the apps' declarations.
Private/no-store responses still cannot be stored. Raw Vary values prioritize
correctness over maximal sharing; especially User-Agent can fragment cache fills.

Compute/Composer should provide a bounded writable cache strategy for Next on
read-only deployments, and exercise real optimized-image GETs in its adapter
smoke tests. Its custom-domain CDN guide should distinguish origin freshness
from eligibility and require working Vary negotiation. Native deployment-aware
asset storage/purge, atomic old-chunk retention, shared regional fills and
Next-aware RSC variants remain necessary to meet the all-users target. One EWR
origin plus an external CDN and local Bangkok wins do not prove that target.

The generic-rule follow-up explicitly sets CDN no-store for Next/RSC navigation
(including _rsc and text/x-component), even if Next emits its default one-year
s-maxage. This keeps the former navigation exclusion at the origin rather than
maintaining a framework-specific Cloudflare expression. The regression test
checks the header/query/content-type paths and preserves streamed payloads.
Prerendered HTML declares Accept/User-Agent plus authorization/Next Vary fields
so an edge cannot reuse it before a private/navigation request reaches origin.
During the first rollout, direct gateway image reads changed from MISS to HIT
for both WebP and JPEG, with separate correct Content-Types; the origin hook
works on Compute’s read-only filesystem. Network timings from that partial
rollout are retained as diagnostic samples, not used as a browser/global result.

Final generic-origin local gates pass: 40 proxy tests, 36 Composer tests/types,
all existing site/blog tests and the complete stack smoke. Final sampled RSS
is docs 480.9 MB and gateway 187.9 MB. This does not yet verify the operator’s
new Cloudflare rule: its default Vary handling must be enabled and tested.

### Single-rule verification: inconsistent Vary schemas caused repeat misses

The operator enabled the one-host rule with raw Vary values. On source
643055148 the complete Cloudflare smoke passed, and 45 explicit GETs confirmed
correct HTML/Markdown negotiation, separate WebP/JPEG hits, and BYPASS/no-store
for authorization, RSC and _rsc requests. Blog/article, cookie and tracking
visits hit the edge. However, the repeated matrix never hit the homepage or
docs HTML, so this was not yet a complete success.

A targeted sequence reproduced the cause on the exact same URL and user agent:
HTML MISS/HIT/HIT; Markdown MISS/HIT; HTML MISS/HIT. The homepage similarly went
HTML MISS/HIT/HIT; uncached RSC BYPASS; HTML MISS/HIT. This supports a mismatch
in the edge's learned Vary schema, rather than an HTML eligibility problem.
HTML declared the full Next/authorization/Accept/User-Agent set, Markdown used
a smaller set, and the RSC redirect declared only Accept. These transitions
repeatedly made a warm HTML representation miss again. Bodies also differ due
to Cloudflare email obfuscation and docs Sentry trace metadata; body hashes
alone cannot establish whether HTML came from cache.

The origin fix canonicalizes a common lowercase, sorted Vary set for document
HTML, Markdown, negotiated plain text and navigation/redirects, always including
Accept-Encoding. Image and static-file negotiation remains separate. No
Cloudflare change is needed. A regression test and real-stack smoke assert one
schema across HTML/Markdown/RSC while keeping navigation no-store. The full
local smoke passes; exact-source remote verification follows deployment.

An additional seven-probe docs baseline retained 28 successful HEAD responses.
All seven initial custom-domain reads were misses (0.958–1.580 s TTFB); all
seven repeated reads were hits (0.029–0.588 s), whereas Vercel's repeated reads
were 0.071–0.207 s. Six of seven warmed custom-domain probes beat Vercel. The
Singapore probe (Oracle AS31898) was routed to Cloudflare MRS/Marseille, with
about 180 ms TCP and 194 ms TLS time even on a HIT. That route needs a separate
multi-provider check; it is not evidence that every Singapore user sees this
path, but prevents claiming the all-users target from these samples.


### Single origin-controlled rule: deployed verification and regional limits

Source `348d0fa68a19969e8213fc05de9b54ee08d10768` passed every GitHub
check, all five Vercel previews, and [Compute deployment 40103873105](https://github.com/prisma/web/actions/runs/40103873105).
The live custom-domain smoke passed. A 45-GET representation matrix and a
13-request interleaved sequence both finished with no failures: homepage,
blog, docs, article, cookie and tracking visits reuse the edge; HTML/Markdown,
agent Markdown and WebP/JPEG stay distinct; authorization and valid Next/RSC
navigation remain no-store/BYPASS. No additional Cloudflare rules were needed.
The origin's consistent document Vary schema fixes HTML-to-Markdown-to-HTML
cache thrashing. One observed `UPDATING` response with Age 204, followed by HIT
with Age 0, is successful stale-while-revalidate behavior, not a failed test.

The original minimal RSC probe was malformed: `RSC: 1` on bare `/` triggers
Next's redirect to `/?_rsc`. That no-store 307 still causes a following HTML
miss in this Cloudflare configuration and is retained as a diagnostic. The
correct minimal request includes `?_rsc` and returns `text/x-component`;
actual recorded browser prefetches also use `_rsc=<hash>`. Corrected interleaved
navigation tests preserve the cached HTML representation. Earlier unsuccessful
probe runs and the first over-strict check that rejected UPDATING are retained,
rather than overwritten with successful results.

The final seven-region comparison on this source made 196 successful HTTP 200
HEAD requests: seven cases, seven reused probes, two targets, two rounds.
Locations were Buffalo, Los Angeles, Falkenstein, Singapore, Sao Paulo,
Johannesburg and Sydney. TTFB includes DNS + TCP + TLS + firstByte; Globalping's
firstByte field alone excludes connection setup. Of the 49 repeated pairs,
Compute/Cloudflare was faster in 37. This is a sample count, not a percentage
of users. Repeated Cloudflare statuses were 45 HIT, two MISS, one EXPIRED and
one REVALIDATED; the four non-hits were on the Singapore probe. Outside
Singapore, all 42 repeated requests hit and 37 were faster than Vercel.

| Case | Median repeated Compute/Cloudflare TTFB | Vercel | Faster pairs / 7 |
| --- | ---: | ---: | ---: |
| Homepage | 70 ms | 71 ms | 4 |
| Optimized image | 64 ms | 61 ms | 3 |
| Article | 42 ms | 216 ms | 6 |
| Docs | 56 ms | 139 ms | 6 |
| Avatar | 42 ms | 110 ms | 6 |
| Cookie visit | 50 ms | 175 ms | 6 |
| Tracking visit | 63 ms | 97 ms | 6 |

The Singapore Oracle probe was processed in MRS/CDG/KIX and took 575–1,733 ms
versus 38–114 ms on Vercel, including slow cache HITs. Additional Singapore
networks confirm this is not confined to Oracle. On their second IPv4 docs
reads, Oracle AS31898 measured 982/29 ms (Cloudflare/Vercel, MRS), MyRepublic
AS56300 509/37 ms (MRS), AWS AS16509 32/42 ms (SIN), and Starhub AS55430
91/47 ms (SIN). Processing locations varied between requests. An available
Oracle IPv6 probe reached SIN and repeated at 41 ms, but it was a different
probe within that ASN, not a controlled same-device IPv4/IPv6 experiment.

Cloudflare's own `/cdn-cgi/trace`, which never reaches Compute, reproduced the
problem: Oracle 1,037 ms/MRS, AWS 491 ms/CDG, MyRepublic 700 ms/CDG, Starhub
215 ms/SIN including 179 ms DNS. Public Globalping evidence IDs:
`27gNFKLz46ekq6gjU00021NOK` (trace), `2XXJIIvlbrkyUPAtB00021NOK`
(traceroute), and `2zBqdYo4awCwaFAQw00021NOL` (TCP MTR). The incomplete
MTR endpoint responses do not establish HTTP packet loss; HTTP requests
succeeded. These results locate a delay outside our application, but do not
isolate ISP peering from Cloudflare's internal processing path.

[Cloudflare's routing guide](https://developers.cloudflare.com/support/troubleshooting/general-troubleshooting/geographic-traffic-routing/)
explains that the response colo identifies processing, which may differ from
ingress, and cannot be pinned in zone settings. The appropriate escalation
packet is affected ASN, timestamp/cf-ray, trace and traceroute/MTR. Evidence
is prepared; no support request or account/network change was made. This
routing gap, cold fills, unique query keys, raw User-Agent cache fragmentation,
uncached RSC and deployment-aware invalidation/old-asset retention prevent a
claim that this is at least as fast for all users.

The complete 48-audit Bangkok browser comparison used Lighthouse 13.5.0 and
Chrome 155, three interleaved audits per page/profile/target, fresh browser
caches, and progressively warmed edge resources. Mobile used applied DevTools
150 ms RTT, 1,600/750 Kbps and CPU x4; desktop simulated LCP is distinct from
observed LCP. Compute service version IDs were unchanged before/after and all
four production static-asset signatures remained unchanged. These are live
operational comparisons with different content/builds/analytics, not a pure
hosting A/B. Raw JSON/HTML/traces/headers and comparison summaries are retained
locally in `output/playwright/global-performance-2026-10-24`.

| Page (median of 3) | Mobile LCP Compute / Vercel | Desktop simulated LCP Compute / Vercel | Desktop observed LCP Compute / Vercel |
| --- | ---: | ---: | ---: |
| Blog | 2.492 / 3.505 s | 0.841 / 2.045 s | 0.210 / 0.463 s |
| Homepage | 10.187 / 14.944 s | 2.409 / 2.844 s | 0.325 / 0.506 s |
| Article | 2.483 / 3.470 s | 0.747 / 1.612 s | 0.173 / 0.388 s |
| Docs, before texture correction below | 3.412 / 3.517 s | 2.494 / 2.339 s | 0.289 / 0.475 s |

The first desktop homepage image variant was cold: image MISS and LCP
5.144 s simulated / 4.596 s observed. The two subsequent image HITs painted
at 0.325/0.324 s observed. Prewarming did not cover every browser format/width,
so calling all runs warm would hide a real first-visitor cost. Homepage mobile
still transfers about 6.55 MB and is poor on both hosts; a relative win is not
a good absolute experience. Docs desktop simulation was slightly slower.

Network-log review found a genuine docs regression hidden by aggregate scores:
its decorative texture's optimizer URL pointed at `/img/brand/texture.jpg`
without the app's `/docs` basePath. Vercel's image service resolves it, while
standalone Next returns HTTP 400. Thus the docs numbers above include a missing
image and are not a valid final comparison. The correction prefixes that
source only in Composer, enables the same bounded read-only image handler for
docs, and extends the smoke to fetch the image URL extracted from real docs
HTML, in separate WebP/JPEG variants with cache reuse. Docs monitoring/Sentry
requests return 403 on both hosts and are recorded separately from asset
failures. Docs must be remeasured after the correction deploys.

The texture correction passes 40 proxy and 37 Composer tests/types, all five
Composer builds, the extended full-stack smoke, docs type checking and all
729 current files' link checks. Sampled docs RSS after smoke is 565.5 MB and
gateway 171.6 MB; these are samples, not peak/load guarantees. Docs assembles
to 432.2 MB / 230.0 MB compressed. Remote deployment/remeasurement follows.


Repeated regional pairs retained from source `348d0fa68` (milliseconds; each
cell is Compute/Cloudflare versus Vercel, including connection setup):

| Probe | Home | Image | Article | Docs | Avatar | Cookie | Tracking |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Buffalo (AS36352) | 120 / 138 | 106 / 110 | 104 / 183 | 111 / 141 | 96 / 162 | 121 / 175 | 88 / 137 |
| Los Angeles (AS36352) | 70 / 90 | 54 / 61 | 42 / 216 | 48 / 139 | 42 / 55 | 50 / 97 | 63 / 133 |
| Falkenstein (AS24940) | 65 / 71 | 65 / 54 | 55 / 123 | 56 / 106 | 76 / 249 | 54 / 193 | 70 / 97 |
| Singapore (AS31898) | 588 / 49 | 1602 / 114 | 575 / 76 | 1609 / 74 | 1733 / 38 | 831 / 64 | 1108 / 68 |
| Sao Paulo (AS31898) | 46 / 42 | 54 / 32 | 38 / 282 | 48 / 71 | 25 / 110 | 34 / 68 | 30 / 63 |
| Johannesburg (AS37153) | 212 / 158 | 64 / 100 | 38 / 455 | 56 / 173 | 42 / 407 | 26 / 410 | 37 / 395 |
| Sydney (AS31898) | 54 / 61 | 30 / 29 | 30 / 357 | 32 / 362 | 32 / 94 | 43 / 384 | 40 / 87 |


### Docs texture correction: final deployed verification

Code source `6faead1cbd2c913bf18fdce56fc02c587b68c9b0` passed all 20
successful PR checks, all five Vercel previews and [Compute deployment
40108099618](https://github.com/prisma/web/actions/runs/40108099618).
Its direct post-deploy smoke and the complete custom-domain smoke pass,
including the actual docs image extracted from HTML, cache reuse and separate
WebP/JPEG representations. The 45-GET cache matrix and 13-request interleaved
sequence were repeated on this deployment with no failures. One hostname-wide
Cloudflare rule remains sufficient; no account/rule changes were made by the
agent. The manual operator update plus the origin fixes are both required;
this is not a clean same-source before/after experiment of the rule alone.

Twelve fresh-browser docs audits repeat the original method, three runs per
profile/target, with unchanged Compute service version IDs and unchanged
production static-asset signatures throughout. All twelve recorded image
requests return 200, with no first-party image/asset HTTP errors. The inherited
Sentry tunnel's 403s occur on both hosts. Raw results and the summarized
`verified-docs-texture-browser-comparison.json` are retained alongside earlier
failed/provisional traces. These supersede the missing-texture docs numbers.

| Docs metric, median of 3 | Compute + Cloudflare | prisma.io / Vercel |
| --- | ---: | ---: |
| Desktop score | 81 | 85 |
| Desktop simulated LCP | 3.002 s | 2.301 s |
| Desktop observed LCP | 0.252 s | 0.428 s |
| Desktop transfer | 4,342,198 bytes | 5,074,266 bytes |
| Mobile score | 61 | 59 |
| Mobile applied LCP | 3.390 s | 3.530 s |
| Mobile transfer | 3,519,265 bytes | 4,274,146 bytes |

Desktop simulation is worse despite faster observed paint; do not collapse
those metrics or describe docs as an unqualified performance win. Mobile is
roughly comparable in this small lab sample. The first cold desktop docs run
painted at 1.186 s versus Vercel's 0.419 s; the two subsequent Compute runs
painted at 0.246/0.252 s. Cold optimizations and cache fills remain material.
The texture is now present in both targets; its 1920-pixel WebP response here
is about 885 KB, versus about 856 KB for Vercel's JPEG in this trace. An
optimized format does not automatically imply a smaller response for noise.

Homepage mobile payload analysis on source `348d0fa68`, run 2, identifies a
separate application cost: approximately 4.19 MB images, 0.647 MB video and
1.36 MB scripts. Large requests include the original 860 KB grain texture,
648 KB CPU art, 510 KB compute art, and the looping CTA video. Its LCP trace
attributes about 9.794 s to resource loading, versus 71 ms document TTFB.
This points to media sizing/scheduling and competing transfers, rather than
slow HTML alone. Prioritize smaller or appropriately sized decorative media,
defer offscreen art/video and audit third-party script work. CDN hits alone
cannot turn the observed 10.187 s median homepage mobile LCP into a good
experience, even though Vercel was slower in these samples.

The current result is verified origin-controlled caching and working Compute
images, with measurable local/regional wins, not the all-users performance
target. Production work still includes deployment-aware invalidation/old-asset
retention, cold/shared fills and navigation caching, plus investigation of the
Cloudflare processing paths documented above. A native Compute CDN and a
framework-supported bounded writable/image-cache strategy would remove several
adapters and external configuration requirements from this setup.


## Application and CDN bottlenecks — 25 October

The [follow-up investigation](composer/performance/2026-10-25.md) separates
application downloads, cold/expired cache entries and network paths. It records
the new seven-region baseline, reused-connection origin/proxy measurements,
asset/font/chat/video changes under verification, and concrete requirements for
a deployment-integrated Compute CDN. Final measurements will be recorded after
the exact preview deployment; no global parity claim is made.

The first optimized-preview pilot (`7902b3bdd`, not a final median) reduced
homepage transfer to 2,172,310 bytes versus production's 6,563,483; applied mobile
LCP was 7.564 versus 14.970 seconds. The 34,457-byte AVIF still took 5.755 seconds
to load: an edge MISS plus contention with hydration scripts, and initial Medium
priority before layout promoted it to High. The critical picture now supplies
parser-time high priority and an AVIF-only preload (unsupported browsers skip
that preload and use the native JPEG fallback); below-fold instances are lazy.
Final measurements below will supersede this single cold pilot.

## Final optimization verification and CDN requirements — 25 October

Runtime source: `40a69269a70e74ff3d8223f3302cf285530d4e88`. Exact preview
workflow: [40177501927](https://github.com/prisma/web/actions/runs/40177501927).
All GitHub checks, all five Vercel previews, Compute deployment and its full
deployed smoke passed. The six active Compute service versions match before
and after the final browser/cache checks.
The [investigation](composer/performance/2026-10-25.md) contains the implementation,
baseline and CDN design requirements. No extra Cloudflare rule was added.

The app changes bake the original grain and selected artwork, use Unicode-ranged
Inter without dropping character coverage/axes/features, initialize the protected
Ask AI SDK/CAPTCHA on first open, and defer the closing video until near the
viewport (never download it for reduced motion). The critical picture now has
an AVIF-only early preload and high fetch priority; other instances are lazy.
Native JPEG fallback remains. Both Vercel and Compute use Next's content-hashed
static URLs; originals and legacy image optimization remain available.

Browser checks verified both format URLs, the actual AVIF selection, no initial
CAPTCHA requests, working desktop/mobile panels, keyboard close/reopen and an
unsent desktop draft. No real AI question or external form was submitted.
Thirty language/weight/style comparisons matched original Inter text widths
exactly, including Vietnamese, Greek, Cyrillic, combining marks and italics.
Desktop/mobile screenshots preserve the original layout and artwork. The raw
Node SSR/content tests now load static imports through a test-only loader; the
component also supports their classic JSX transform. Local site tests (272),
UI types and proxy/Composer checks (40 + 41) pass after these changes. The last
full local five-site build/smoke passed ranges, validators, redirects, Markdown,
legacy/current articles and both baked formats; docs peaked at 550.0 MB sampled
RSS, and blog remained largest at 850.4 MB expanded / 686.3 MB compressed.

### Delivery-path isolation

This experiment used the preceding optimized source `7902b3bdd`; its health
and proxy handler code is identical to the final source. Six sequential public
GETs per target, one curl process per target, HTTP/2 from
Bangkok. Exclude the first connection setup and take the median of five reused
connections:

| Path | TTFB median | Gateway handler |
| --- | ---: | ---: |
| Cloudflare managed `/cdn-cgi/trace` | 15 ms | Not invoked |
| Same custom-domain Compute health, direct origin | 266 ms | 0.0–0.1 ms |
| Generated Compute gateway health, direct | 290 ms | 0.0–0.1 ms |
| Custom-domain health through Cloudflare (BYPASS) | 1,030 ms | 0.0–0.1 ms |

The Cloudflare samples were 1,009–1,078 ms. Each of the three switchboard origin
IPs returned warm health in 267–293 ms. Direct HTTP/1.1 also reused connections
successfully (267 ms). This excludes a single unhealthy origin node and a basic
app keep-alive failure. It does **not** identify Cloudflare's chosen origin IP,
connection reuse, transit route, or Compute's pre-handler scheduling/ingress time.
The extra delay is outside Next rendering and the measured gateway handler.
Cloudflare documents [pooled HTTP/2 to origin, enabled by default](https://developers.cloudflare.com/speed/optimization/protocol/http2-to-origin/);
we have not inspected the account setting or provider-side connection telemetry.
Do not prescribe an unverified toggle or blame app CPU from this result.

The earlier same-connection docs comparison was 311–317 ms through the gateway
versus 308–313 ms directly to docs. A warm proxy hop is not the primary bottleneck.
`Server-Timing: gateway` covers work until upstream headers and preserves streams;
a cached HIT reports the timing from its cache fill, not work on that HIT.

Four reused Singapore probes were also checked. First image requests through
Cloudflare took about 1.68 seconds (two HIT, two REVALIDATED); the second requests
were HIT in 48–171 ms. Vercel's second requests were 30–57 ms. Unlike the previous
day's distant-processing trace, a fresh two-round Cloudflare-owned trace check
was fast on all four ASNs (28–64 ms, SIN). The anomaly is intermittent and did
not reproduce on the managed endpoint in this run. Country averages or a single
colo label cannot explain it; do not infer persistent packet loss or a definite
peering cause. Raw request IDs, headers, timings and per-IP checks are retained
under `output/playwright/performance-2026-10-25/`.

### Repeated browser results

Lighthouse 13.5.0 / Chrome 155, interleaved hosts, fresh browser cache per run,
Bangkok. Mobile uses actual DevTools throttling: 150 ms latency, 1,600/750 Kbps,
CPU ×4. Desktop uses 40 ms, 10,240/10,240 Kbps, CPU ×1. These are applied
measurements, not the earlier Lantern desktop simulation. No local builds or
tests ran during the selected batches. Edge resources were progressively warmed;
the inventory warmup does not guarantee a HIT for every browser representation
or responsive asset. Actual cache statuses are retained with each trace.

Mobile medians, three runs per page/host:

| Page | Compute + Cloudflare LCP | Live Vercel LCP | Compute bytes | Vercel bytes | Compute / Vercel TBT |
| --- | ---: | ---: | ---: | ---: | ---: |
| Homepage | 3.552 s | 14.911 s | 2.17 MB | 6.56 MB | 562 / 720 ms |
| Docs Composer | 3.396 s | 3.425 s | 2.06 MB | 4.27 MB | 686 / 1,082 ms |
| Blog index | 2.437 s | 3.551 s | 1.88 MB | 3.35 MB | 449 / 573 ms |
| Blog article | 2.327 s | 3.436 s | 1.88 MB | 2.62 MB | 465 / 596 ms |

The same-profile Compute baseline was 10.187 / 3.390 / 2.492 / 2.483 s LCP
and 6.55 / 3.52 / 2.49 / 2.48 MB for these four pages. Initial bytes fell about
67% / 41% / 24% / 24%. Docs LCP is essentially unchanged, while its TBT fell
about a third. Article TBT was 424 ms before versus 465 ms after; do not claim
every metric improved. Homepage FCP is 3.552 s versus Vercel's 3.468 s: the large
homepage LCP improvement removes late decorative-media work, not four times
faster first text or every interaction.

Desktop results (docs: median of three; other pages: one diagnostic each):

| Page | Compute + Cloudflare LCP | Live Vercel LCP | Compute / Vercel document cache |
| --- | ---: | ---: | --- |
| Homepage | 1.152 s | 5.876 s | EXPIRED / HIT |
| Docs Composer | 0.499 s | 0.664 s | Two UPDATING, one HIT / three HIT |
| Blog index | 1.006 s | 0.680 s | EXPIRED / HIT |
| Blog article | 1.152 s | 0.703 s | EXPIRED / HIT |

The three EXPIRED document responses took 752–889 ms to headers, versus
132–137 ms on Vercel HITs. The cached docs documents took 66–70 ms, versus
125–137 ms on Vercel. This exposes the freshness/delivery tradeoff rather than
proving that either platform always wins. The separate warm-document diagnostic
below uses the exact Chrome Accept/Accept-Encoding/User-Agent values: warming
with curl's simple `Accept: text/html` warms a different raw-Vary representation.

Exact-browser warm-document diagnostic, one additional applied-desktop run per
page/host, separate from the primary medians and expiry samples:

| Page | Compute + Cloudflare LCP | Live Vercel LCP | Document cache |
| --- | ---: | ---: | --- |
| Homepage | 0.432 s | 5.883 s | HIT / HIT |
| Blog index | 0.346 s | 0.660 s | HIT / HIT |
| Blog article | 0.343 s | 0.656 s | HIT / HIT |

Compute document header time was 61–62 ms versus Vercel 125–139 ms. All six
audits completed without runtime errors or first-party asset failures. These
single samples show the achievable warm path; they do not replace the slower
expired samples with a claim of steady global superiority. The homepage's
Vercel first text was 0.601 s despite its much later decorative-image LCP.

The final docs font fix is included in all docs results above. Removing preloads
in the preceding optimized build clustered two desktop font swaps, producing
CLS 0.167. The fix preloads the Unicode-ranged Latin face and code face without
creating a second full Inter family. Next's original bracketed code-font filename
also produced an encoded preload URI but an unencoded CSS URI, causing two Chrome
requests. A byte-identical clean filename makes the preload and CSS URI agree;
the generator and hash budget enforce equality with the original font. The final
docs desktop CLS is 0.090 in all three runs, versus live Vercel median 0.099;
mobile is 0.00158 on both. This is not zero CLS. Next can emit these hints in the
HTTP Link header, so the smoke checks both header and DOM hints and matches them
to the CSS URL, rather than assuming a missing DOM link means no preload.

The primary selected set has 36 audits: 24 mobile, six docs desktop and six other
desktop. Home/blog/article mobile ran on `d8994c4fe`; final docs and desktop ran
on `40a69269a`. Those three apps' JS and stylesheet URL inventories are identical
between batches on both hosts; the final code change affected docs fonts only.
The earlier desktop batch that overlapped font diagnostic builds is excluded,
and the failed docs CLS result is retained as a corrected regression, not a final
result. There are no Lighthouse runtime errors or first-party CSS/JS/image/font
HTTP failures in the selected set. Both hosts' docs monitoring endpoint returns
403 during some audits; these telemetry failures were not hidden or counted as
successful monitoring. The warm custom-domain diagnostics also recorded the
existing Font Awesome kit returning 403 and Promptwatch ingest returning 404,
unlike the production samples. Those external services were not disabled by this
change; their domain/configuration differs and these are not successful
integration checks. Content, build and enabled integrations differ between the
live deployments, so this is a real-site comparison, not a hosting-only A/B.
The before/after Compute measurements retain the same custom-domain integrations.

Two additional diagnostics show why warm medians are insufficient:

- With surrounding HTML cached and a fresh browser context, a new cache key for
  the 35 KB critical AVIF gave LCP **5.484 s**; repeating that key as a HIT gave
  **1.668 s**. The image response started at 1.132 s and finished at 5.102 s
  cold, versus 0.266 / 1.036 s warm. Only that read-only image request was given
  a probe query; no cache purge or rule changed. This is one controlled mobile
  pair, separate from the Lighthouse medians, using CDP 150 ms, 1,600/750 Kbps,
  CPU ×4. A small file still loses time on cache fill and competes with scripts.
- Real desktop Composer → Compute docs link navigation, two paired fresh-context
  runs with normal prefetch, took **1,283 / 434 ms** click-to-heading on Compute
  versus **97 / 116 ms** on Vercel. Compute RSC was BYPASS/no-store, Vercel HIT.
  Compute request header times were 306–1,193 ms, with gateway upstream-header
  work only 7.7–24.7 ms; Vercel was 69–109 ms. This supports a delivery gap outside
  the measured handler, not 1.2 seconds of demonstrated Next CPU. Streaming-body
  and pre-handler time are not separated by that metric. The unsent Ask AI draft
  survived close/reopen and navigation away/back; no question was submitted.

Raw reports, traces, screenshots, service identities, fingerprints and diagnostic
JSON are retained locally under `output/playwright/performance-2026-10-25/`.
Primary browser phases: `final-d899` (unchanged-app mobile only),
`final-font-40a` (final docs), `final-desktop-40a` (desktop expiry samples),
and `warm-desktop-40a` (six additional exact-browser warm diagnostics).
The machine-readable medians are in `final-browser-summary.json`; the cold pair
and navigation evidence are `cold-critical-results.json` and
`navigation-results.json`. The earlier baseline remains under
`output/playwright/global-performance-2026-10-24/`.

### Repeated regional and cache checks

All 28 final regional HEADs returned 200, reusing the same seven probes as the
before series. The first Cloudflare requests were EXPIRED (885–1,370 ms). The
second round was all HIT, with Cloudflare faster in six of seven pairs:

| Probe | Cloudflare HIT, ms | Vercel HIT, ms |
| --- | ---: | ---: |
| Buffalo (HostPapa) | 108 | 189 |
| Los Angeles (HostPapa) | 73 | 131 |
| Falkenstein (Hetzner Online) | 90 | 104 |
| Singapore (LeaseWeb) | 151 | 69 |
| Sao Paulo (Oracle) | 44 | 80 |
| Johannesburg (Xneelo) | 45 | 157 |
| Sydney (Oracle) | 99 | 293 |

These are connection-inclusive TTFB values (total minus the 0–1 ms HEAD
download), not browser paint. The Singapore Cloudflare HIT used HKG and took
151 ms versus Vercel’s 69 ms; the earlier fast LeaseWeb sample used a different
processing path. Do not replace the prior slow-ASN evidence with a country
median. The cold/expired and warm cases remain materially different.

Public Globalping measurement IDs: initial Cloudflare `2DMfalGzREA0yB6D000021Ne7`;
repeated Cloudflare `2m1TNcSvQ6Jjf7HdV00021Ne7`; repeated Vercel `2tMGAcE0QruyV9Kw000021Ne7`.

The final single-rule validation made 45 GETs across 15 cases: all returned 200,
with zero assertion failures. It recorded 30 HITs, four EXPIRED, two REVALIDATED
and nine BYPASS responses. Final public HTML, Markdown, harmless-cookie/tracking
variants and both optimized image formats were HIT. WebP/JPEG and HTML/Markdown
remain distinct; Authorization, RSC and `_rsc` query probes retained CDN no-store
and never HIT. The ordinary-cookie case is the existing explicitly public blog
route, not evidence that arbitrary authenticated pages can be cached. Final BKK
HIT first-byte times were 53–72 ms. The raw folder is named `final-cache-d899`
after its originally queued phase; the requests ran after the verified `40a`
deployment, with matching final service versions. The complete deployed smoke
also checks redirects, original/baked assets, correct ranges, framing and content
validators. No additional Cloudflare rule was needed.

### What the product needs

The most important missing capability is **deployment-integrated static and
framework delivery outside the VM's file budget**. Vercel prerenders the docs;
this Composer setup omits article static-params to fit the 1 GB filesystem,
then renders on demand. Extracting public/static files **and prerendered HTML/RSC**
into a release-scoped object store/CDN would remove that tradeoff. Keep old chunks
while old HTML can reference them; promote/rollback app, assets and framework
cache together. A one-minute TTL plus SWR bounds staleness; it does not provide
atomic deployment invalidation or version routing. Next's deploymentId detects
skew but does not itself retain/route old releases.

Use a Next-aware edge key for HTML, Markdown and eligible RSC/prefetch, including
release/zone and actual representation inputs. Raw User-Agent/Accept Vary and
complete queries are safe here but fragment cache entries. Normalize equivalent
representations and audit tracking parameters at a trusted edge; retain real
filters, auth, private responses, Server Actions and Set-Cookie behavior. Current
RSC navigation stays uncached until that contract exists.

Provide shared fills/shielding, coalescing and persistent image variants outside
the runtime filesystem. [Tiered caching](https://developers.cloudflare.com/cache/how-to/tiered-cache/)
can reduce repeated origin fills; it cannot eliminate first-ever SSR or fix a slow
HIT path. Preserve compression, content hashes, stream lengths, HEAD/206/304,
ranges and cancellation. Expose edge/shield/connect/TLS/ingress/scheduler/app
latency and cache key/reason/age/release so this diagnosis does not stop at the
boundary of the handler. A route-level critical-asset manifest can support early
hints/preloading without every app rediscovering its priority waterfall.

Compute + Cloudflare demonstrably supports fast cached delivery. A native CDN
on the same Cloudflare routing is not, by itself, a cure for the observed tails.
Universal parity is not established: cold and fragmented entries and uncached
navigation still pay EWR distance, independent-cache rollout semantics differ,
and some network paths fluctuate. A practical parity gate needs repeated
cold/warm/expired/campaign/navigation tests across ASNs and field p75 LCP/INP/CLS,
in addition to these lab samples. No private content was made cacheable, no
analytics/protection was disabled, and no production cutover was performed.

## Same-source Vercel preview verification — 25 October

The user supplied the signed-in [site branch preview](https://site-git-codex-web-composer-prisma.vercel.app/).
Tests used that existing Chrome Work window through native UI automation,
including the built-in Lighthouse panel. Authentication and deployment protection
were retained. GitHub deployment metadata identifies Vercel source
`a86036a22e491dabe6c4cf5ae32baf959dfc8507`; its application code is identical to
Compute's deployed `40a69269a70e74ff3d8223f3302cf285530d4e88` (the intervening
commit changes findings only). The six Compute live version IDs match the
previous verification after this comparison. No application code changed here.

Use each zone's exact deployment, rather than assuming the homepage preview's
zone forwards identify a particular docs/blog build:

| Project | GitHub deployment | Exact preview |
| --- | --- | --- |
| Site | 7311195285 | https://site-fih9qcqex-prisma.vercel.app/ |
| Docs | 7311202792 | https://docs-2rxj3n7nd-prisma.vercel.app/docs/composer |
| Blog | 7311196051 | https://blog-e6e8ozd6z-prisma.vercel.app/blog |

The site's observed deployment ID `72rq4JFeS5f1rRysc2aHVZgAzjNu` also matches
the commit's Vercel status, verifying the user-provided branch alias at measurement
time. The two other exact URLs were read from successful GitHub deployment statuses.

### Method and performance

Fourteen selected audits: twelve mobile (blog three per host, other pages one
per host) and two desktop docs diagnostics. Chrome 155 / Lighthouse UI 13.4.1,
same signed-in Work profile, serial audits without concurrent local builds/tests.
Network **Disable cache** was enabled to fetch assets over the network; Lighthouse
**Clear storage** was disabled to preserve the authenticated session. These are
authenticated network-reload diagnostics, not anonymous first-visit field data.
An initial browser-cache pilot transferred only 66 KB and gave 0.873 s homepage
LCP; it is retained locally and excluded from the comparison.

Mobile uses the UI's applied DevTools Slow 4G preset: request latency 562.5 ms,
download 1,474.56 Kbps, upload 675 Kbps, CPU ×4, 412 × 823. This is a different
profile and Lighthouse version from the earlier CLI measurements, which applied
150 ms / 1,600 / 750 Kbps. Do not compare the two batches as before/after timings.

| Page | Vercel preview LCP | Compute + Cloudflare LCP | Samples per host |
| --- | ---: | ---: | ---: |
| Homepage | 2.759 s | 2.944 s | 1 |
| Docs Composer | 3.003 s | 2.896 s | 1 |
| Blog index | 2.578 s | 2.735 s | 3, median |
| Blog article | 2.539 s | 2.674 s | 1 |

Blog ranges overlap: Vercel 2.308–2.667 s, Compute 2.459–2.825 s. Median blog
TBT is 745 / 665 ms (Vercel / Compute), and CLS is 0.001853 on both. The small
LCP differences do not establish a general hosting winner. Application startup
work and third-party integrations remain part of the measured result.

Sanitized document HAR entries matched to each audit show Vercel HITs but
Cloudflare EXPIRED on all six mobile documents. Both sent request no-cache as
part of the diagnostic. This is the current end-to-end policy comparison, not a
controlled HIT-versus-HIT benchmark; applied mobile throttling also obscures
some origin-latency differences. The cache-expiry/key-coverage gap is still
present. Do not derive unthrottled network latency by subtracting the configured
throttle from these request times.

The matched desktop docs diagnostics were HIT on both: LCP **0.289 / 0.280 s**
(Vercel / Compute), TBT 21 / 18 ms, CLS 0.000036 / 0.000249. The UI desktop preset
used CPU ×1 and no actual network shaping (request latency/download/upload were
zero in DevTools mode). These fast-connection samples verify the corrected font
path and demonstrate fast cached delivery on both; they do not replace the
earlier 40 ms / 10 Mbps desktop tests or prove that font swapping can never shift.

All fourteen selected audits completed without runtime errors or first-party
CSS/JS/image/font HTTP failures. Docs monitoring returns 403 on both hosts.
Compute's custom hostname still receives Font Awesome kit 403 and Promptwatch
ingest 404; those succeeded in these Vercel samples. CookieYes also reports its
registered-domain mismatch on the Vercel preview. These external integration
differences limit an isolated hosting comparison, and are not successful
production-consent/telemetry tests. Their scripts and protections were retained.

### Vercel behavior checks and merge implications

- Docs loads one Latin Inter subset and one canonical code-font URL, alongside
  Sora, without duplicate font downloads. Desktop/mobile text and code render.
- Ask AI shows its loading state on first open, then initializes the SDK and
  invisible CAPTCHA. Initial docs audits contain no CAPTCHA requests. Desktop
  Escape closes it visibly, the keyboard shortcut reopens it, and an unsent
  draft survives close/reopen plus Composer → Compute → Back navigation. The
  test draft was cleared without submission.
- The mobile drawer opens/closes and its layout was visually checked at
  412 × 823. No actual AI question or CAPTCHA challenge was submitted/solved.
- Pricing cards/grain and the homepage closing card were visually checked.
  Initial homepage audits do not request the closing video; the browser's
  Media log shows the Vercel preview video URL serving 206 range responses
  during inspection. No missing artwork was observed.

The changed Vercel behavior checks found no new release blocker. A real Ask AI
answer remains a useful manual check at the exact docs preview above. Normal
required PR review still applies. This does not certify the separate Compute
cache/release design gaps as solved or authorize a production cutover.

The browser was restored to normal caching, its original Lighthouse settings,
responsive dimensions/device mode, right dock and Console panel; DevTools was
closed and the supplied preview left at the homepage. Raw reports, sanitized
document HARs, cache-state matches, deployment identity, service-version snapshot,
QA notes and machine-readable results remain locally in
`output/playwright/performance-2026-10-25/signed-in-preview/`. The raw authenticated
browser artifacts are not committed. This section records the public aggregate
evidence and supersedes any implication that the production comparison alone
measured a Compute hosting advantage.

### Follow-up: user-submitted Ask AI question

The user manually submitted a question on the exact docs preview and confirmed
that the chat UI loaded correctly. Inspection of the retained Chrome Network
entry shows `POST https://proxy.kapa.ai/proxy/query/v2/chat/stream/` returning
HTTP 200 with `Content-Type: application/json`, but without
`Access-Control-Allow-Origin`. Chrome reports `MissingAllowOriginHeader` and
cannot expose the response body to the SDK.

Read-only OPTIONS probes on the same endpoint returned 200 and allowed the
production, exact preview and custom-domain origins, including the SDK's header
names. This is not evidence of a failed preflight. A per-integration domain
policy or upstream error response is plausible; the actual cause is unconfirmed
without the service's configuration/logs or readable response body. The Kapa
integration ID and default direct API endpoint match main. Kapa's
[configuration FAQ](https://docs.kapa.ai/integrations/website-widget/faq#how-do-i-fix-configuration-issue-detected-error)
also identifies CORS as a possible integration configuration issue.

Record the UI behavior as passed and actual answer generation as unverified.
Do not count this as a successful end-to-end answer or assume an allowlist change
alone fixes it. No query was replayed, CAPTCHA token reused, protection relaxed,
or external integration configuration changed during diagnosis.

### Review corrections before merge

CodeRabbit's review of `a14d74de6` identified three valid improvements, applied
together without changing routing, cache policy or integration configuration:

- The retained desktop chat panel is inert while closed. A real-browser check
  of the production docs build confirms the open textarea accepts focus, the
  closed panel rejects focus, and reopening restores interaction. No question
  was submitted during this check.
- Video source retention and playback use separate intersection observations.
  The source becomes eligible near the viewport and stays attached offscreen;
  playback follows actual visibility. A real-browser check confirms no source
  initially, playback on entry, pause on exit with the source retained, resume
  on re-entry, and no source/request on a fresh reduced-motion page.
- The HTTP adapter reports upstream body errors through `onError`, then destroys
  the response without passing the error into an unobserved response event.
  A new regression test fails before the fix because the failure is not reported;
  after the fix it verifies a partial response fails, the original error is
  reported once, and another request to the same server succeeds. All four
  transport tests pass on both Node and Bun 1.4.3.

Validation after these fixes: proxy 41, Composer 41, docs 92 and site 289 tests
pass; all eight type-check tasks pass with the required production origin
values; ordinary production builds of Site and Docs succeed. Local browser
artifacts, including test-setup failures and final passing checks, remain in
`output/playwright/review-2026-10-25/`. The review's optional docstring-coverage
warning does not identify another runtime defect. CI and deployed-preview
verification still need to complete on the pushed correction commit.

## 26 October: blog cache expiry, startup work and release assets

The production comparison after #8586 measured mobile blog LCP at 2.46 seconds
on Vercel and 6.05 seconds on Compute plus Cloudflare. The Compute runs were
6.054 / 2.486 / 6.047 seconds; both slow runs synchronously revalidated the
unversioned hero SVG, while the faster one served it `UPDATING`. Public HTML and
files already advertised 60 seconds freshness plus 300 seconds SWR. A request
after that stale window ends still waits for origin. Cloudflare SWR was working;
it was not a missing dashboard switch. See its
[origin cache-control documentation](https://developers.cloudflare.com/cache/concepts/cache-control/).

The follow-up keeps the single hostname-wide Cloudflare rule and implements:

- **Content versions for blog media.** Next configuration generates a roughly
  230 KB lookup for 1,463 public images. Cards and avatars use a `__asset` SHA-256
  query parameter. The gateway validates it against the existing public-file
  inventory and gives matching media one-year immutable caching. Changed media
  requested through an old version redirects without caching new bytes under
  the old digest. Original paths and Vercel's native public-file handling work
  as before. The version lookup does not bulk-copy the blog's media.
- **Hash the chrome's logos with Next.** The header's light/dark lockups and the
  footer's two animated layers previously made one-second `REVALIDATED` origin
  reads after quiet periods. Four static imports now publish them under Next's
  immutable, content-hashed paths on both Vercel and Compute. Their original
  bytes, dimensions, theme rules and animation are unchanged; a build-output
  digest check verifies all four files are byte-identical. They also participate
  in the retained Next asset store, without importing the full image inventory
  into a client component.
- **Longer blog SWR with static retention.** Deployment builds with
  `WEB_RETAIN_ASSETS=1` use the existing project credential to locate the branch's
  active gateway. Its public static manifest and digest endpoints let the next
  build retain historical Next files for 48 hours, alongside the current release.
  Content deduplication avoids storing the same font once per app. Only public
  Next static files are published, not server code, source maps or credentials.
  Current requests preserve Next compression; historical files stream from the
  gateway, which can also cover a current-file 404 during promotion. Incorrect
  history, immutable-path collisions and excess size stop the build.
- **A one-day stale window for public blog HTML.** Its browser policy remains
  revalidation and its edge freshness remains one minute. Retained assets cover
  the dependencies of cached HTML across deployments. Other sites, private
  requests, Next navigation and unversioned public files retain their prior
  policies. Offline builds without retention enabled keep the five-minute window.
- **Less initial client work.** Static post cards render on the server. Blog
  search code loads on first open, or preloads on hover/focus/touch intent. A
  Base UI modal supplies a cancellable loading state; the loaded search stays
  mounted so its query survives closing and reopening. Consent and analytics
  integrations remain enabled.
- **Keep font changes evidence-driven.** An Inter preload experiment used the
  CSS face's exact URL, but five paired mobile runs still showed the same
  0.001837 CLS and later Compute paint. It was removed before the final
  comparison. Existing font faces and the Sora preload remain unchanged.
- **Cache/deploy observability.** The public manifest records the CI release,
  and public HTML carries `X-Composer-Release`. Deployment smoke waits for the
  expected release instead of accepting an older service returning HTTP 200.

The first image-version prototype hashed files from server components. Next
warned that dynamic filesystem access would trace the whole project; it was
replaced by a build-time lookup before publishing. This is a useful monorepo
deployment diagnostic: a small helper can otherwise defeat artifact budgets.
The runtime-only routing library still loads original Vercel files at boot;
the image/static inventories describe assets, not a precompiled routing plan.

Bun verification found another compatibility detail: in Bun 1.4.3,
`new Request(original, { headers: emptyHeaders })` retains the original headers.
The public-file validator now clones the request and deletes conditional headers
on that clone, preserving metadata and avoiding that empty-override behavior.
The existing conditional-read regression then passes on Node and Bun.

Local verification includes blog 92, proxy 41, Composer 49 and root 65 tests,
all eight type tasks, ordinary Vercel and Composer production builds, and the full
local five-site smoke. The focused cache/retention/validator suite passes on
Node and Bun. A multi-generation test verifies old files survive a deploy and
expire only after their retention window; oversized history is rejected before
blob download. Real-browser checks verify no search chunk initially, first-open
focus, Escape, query retention, delayed-chunk cancellation and no late reopen.
Deployed benchmark results are recorded in the follow-up PR after deployment;
these local gates alone do not establish a performance win.

Review found that URL parsing preserves reserved filename characters such as
`@` and `+`, while the image inventory encodes them. A regression using an actual
file fails before normalizing the lookup and passes afterward, for both raw
and encoded URLs. Malformed encodings still remain unchanged. This prevents
some image names from silently retaining the short, unversioned cache policy.

The retained before-run browser logs reveal an important comparison caveat:
CookieYes rejects `prisma.sorenbs.com` as an unregistered website and PostHog
reports a missing public token on Compute. The corresponding production runs
do not report those errors. This is not a hosting performance improvement;
disabled or failing integrations can reduce client work. The deploy workflow
now reads the existing `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
repository secrets, with same-named public variables as a fallback. Only secret
names were inspected; their values were not exported or copied. Turbo's Next
framework inference passes these values into builds and includes them in the
cache key, verified with a dry run using dummy values. CookieYes must still
authorize the preview domain.
No third-party domain policy, credential or security setting was changed.
Cache-specific tests remain useful independently; whole-page score and CPU
comparisons must retain this qualification until integration parity is verified.
Opening and reopening the deployed search dialog preserves focus and its query,
but the preview's search API returns 503. `COMPOSER_INTEGRATIONS` has not selected
Mixedbread, whose runtime key is required by the existing search handler. This
is a preview configuration limitation, not evidence of successful search results
or a reason to count reduced startup work as disabled functionality.

The retention-enabled assembly is within both budgets: gateway 31.5 MB expanded
/ 9.8 MB compressed; blog 859.7 / 687.4 MB; other apps remain below those maxima.
The full local smoke sampled gateway RSS at 178.7 MB, blog 228.0 MB and a maximum
of 487.8 MB in docs. Static bodies are streamed, not loaded as an in-memory cache.

Longer SWR trades freshness for availability: a quiet blog page can serve content
up to one day plus one minute old before its background refresh. Retention is
not instant deployment invalidation or full server-version pinning. Public media
changed in place redirects to its current version; a deleted public media file
has no retained origin copy in this bridge. A durable release asset store should
cover that case as well as Next chunks. First-ever
misses, evicted entries and new full query keys still reach EWR. A Compute CDN
should provide durable versioned assets, coordinated invalidation/promotion,
shared fills/shielding and framework-aware representation keys rather than
requiring this application-level bridge. No all-user/all-metric victory is
inferred from warm lab medians; subsequent comparisons include a quiet period
and first-cache misses as well as warmed delivery.

The first full warm comparison on `e022326d2` was stopped after its five mobile
pairs exposed a consistent paint regression, despite much faster cached HTML.
The entire dataset remains in `output/playwright/blog-cache-2026-10-26/`, including
the preliminary run and aborted next audit. The follow-up comparison uses a
separate `blog-cache-final-2026-10-26` directory after removing the unproven
preload; the slower measurements are not discarded or combined into a win.

Cloudflare's generic Vary normalization only trims/combines arbitrary header
values; it does not group browser user agents. Our negotiation needs `Vary:
User-Agent` so crawlers and HTML readers do not share the wrong representation.
Consequently, different browser/version strings can create distinct cold HTML
entries even with the one-day SWR window. Removing that header without an edge
representation classifier would break correctness. A Compute CDN should key
on the representation class rather than the complete user-agent string. See
[Vary normalization](https://developers.cloudflare.com/cache/concepts/vary/).
Cloudflare's existing
[Smart Tiered Cache](https://developers.cloudflare.com/cache/how-to/tiered-cache/)
is also worth testing for shared fills: an upper-tier cache can satisfy a miss
at a visitor-facing edge before reaching EWR. No zone-wide setting was changed
in this work; tiering cannot remove a genuinely new representation/key's first
origin request by itself.

### Final deployment and performance verification

Application commit `2c4c88533cbfa2fbecd34b13a961b6bf1fc954f3` passed all checks,
all five ordinary Vercel previews, Composer local build/smoke and the
[Compute preview deployment/smoke](https://github.com/prisma/web/actions/runs/40287389755).
The final CI archive sizes are gateway 35.5 MB assembled / 11.0 MB compressed and
blog 860.3 / 686.6 MB. The other sites also pass the existing 900 MB assembled /
750 MB upload guards. Earlier RSS figures above are local samples, not remote
peak-memory measurements.

The final comparison contains 40 Lighthouse 13.5.0 / Chrome 155.0.8059.85 audits:
four explicit warm-ups, five warm pairs per profile, three new-query pairs per
profile and one quiet pair per profile. They use the exact saved mobile and
desktop applied-DevTools profiles from the preceding comparison. Runs are
serial/counterbalanced with fresh browser profiles; all 40 match the expected
configuration. No Lighthouse runtime errors, run warnings, first-party HTTP
failures or non-cancelled first-party loading errors were observed. The
production control's script/CSS asset fingerprint stayed constant throughout;
main stayed at `0d360d034`, whose Production–blog deployment is `7321580277`.

| Observation | Compute + Cloudflare | Current Vercel production |
| --- | ---: | ---: |
| Warm mobile LCP, five-run median | 2,413 ms | 2,446 ms |
| Warm desktop LCP, five-run median | 367 ms | 489 ms |
| Warm mobile HTML TTFB | 71 ms | 151 ms |
| Warm desktop HTML TTFB | 69 ms | 144 ms |
| Mobile LCP after quiet period, one run | 2,380 ms | 2,525 ms |
| Desktop LCP after quiet period, one run | 363 ms | 558 ms |
| New-query mobile HTML TTFB, three-run median | 1,456 ms | 149 ms |
| New-query desktop LCP, three-run median | 1,585 ms | 494 ms |

Mobile warm LCP ranges overlap (Compute 2,382–2,520 ms; Vercel
2,424–2,468 ms): this is effectively a tie, rather than a clear mobile paint
win. Desktop warm paint improves. CLS ties at 0.001837 mobile and 0.000327
desktop; desktop TBT is effectively tied at about 10 ms. Mobile TBT measured
619 vs 775 ms and first-party JS transfer 663 vs 776 KB, but whole-page CPU,
paint and byte comparisons retain the vendor-configuration qualification below.
The shared application improvements will also help Vercel after merge, so this
is not a same-code hosting A/B. Field INP and client-navigation performance were
not measured.

The quiet Compute requests served `UPDATING` at ages 872 seconds mobile and
444 seconds desktop, beyond the old six-minute total window. Their immutable
media remained hits; the previous six-second expiry behavior did not recur in
these observations. Vercel served all six unused-query requests as `HIT` while
Cloudflare served all six as `MISS`. Cold mobile LCP was 2,694 vs 2,464 ms; the
one slightly higher Compute CLS sample is retained in the raw data.

The earlier Inter experiment is also retained: five mobile pairs measured
3.482 seconds on Compute, versus 2.441 seconds on Vercel, with unchanged CLS.
Removing the preload restored Compute to 2.492 seconds across two diagnostic
runs, with a 2.508-second Vercel control. No font preload remains in the final
diff. Four small logo layers now use native immutable Next paths instead; their
emitted SVGs are byte-identical to the originals.

A real promotion retained 21 historical static paths. Five prior files,
including the 680 KB client chunk, returned their exact original hashes through
the new gateway. Later generations preserved historical expiry times instead
of extending them indefinitely. The featured hero also has identical decoded
bytes and SHA-256 on production and Compute.

The final regional quiet pass served all seven Compute entries `UPDATING` after
about 26 minutes. In the immediate repeat, with warm DNS and cache, total HTTP/2
HEAD times were:

| Probe | Compute + Cloudflare | Vercel |
| --- | ---: | ---: |
| Buffalo, AS36352 | 147 ms | 232 ms |
| Los Angeles, AS36352 | 46 ms | 98 ms |
| Falkenstein, AS24940 | 61 ms | 85 ms |
| Singapore, AS59253 | 545 ms | 69 ms |
| São Paulo, AS31898 | 34 ms | 59 ms |
| Johannesburg, AS37153 | 45 ms | 189 ms |
| Sydney, AS31898 | 37 ms | 72 ms |

The Singapore probe reached Cloudflare MRS (Marseille), while Vercel used SIN.
That path loses despite a cache hit. Some earlier regional losses were DNS
cost instead: São Paulo's 281 ms DNS lookup dominated its 310 ms stale response.
All results, including an earlier Buffalo expiry after a colo change, remain
in the dataset. Seven networks do not establish an all-user result.

There is a reproducible new-key cost independent of rendering. Reusing one
HTTP/2 client connection, render-free health requests with new query strings
took 1,009 / 1,027 ms through Cloudflare; repeating the same key took 269 ms.
Bypassing Cloudflare with the same custom hostname, SNI and valid TLS to EWR
took 266 / 267 ms for new keys. Generated-domain controls were similarly fast.
All reported zero gateway handler time, and later transfers had no new client
TLS connection. This isolates additional cost on the Cloudflare-specific path
before the handler; its exact internal lookup/tier/origin-connection component
still needs provider tracing. The 7/30-second idle-gap control did not establish
a simple five-second application keep-alive timeout, so no speculative timeout
change was introduced.

New Chrome/Safari User-Agent variants likewise produced Cloudflare
`MISS` then `HIT`; Vercel remained `HIT`. The first Chrome variant took
1,521 ms and its repeat 23 ms. The current default key includes full search
strings. Globally ignoring queries would collapse image version/optimizer keys
and can skip query-dependent routing; it is not a safe generic fix. Cloudflare's
[documented selective query-key controls](https://developers.cloudflare.com/cache/how-to/cache-keys/)
are Enterprise-only. Origin freshness headers alone do not supply the missing
routing/framework semantics.

The preview still reports CookieYes domain rejection, a FontAwesome kit 403
and a Promptwatch preflight 404/CORS failure; production reports none of these.
PostHog's missing-token warning is fixed using existing build secrets. Missing
vendor work is not counted as a hosting improvement. Search's existing 503
also remains a preview integration configuration issue, separate from the
verified dialog interaction. These limitations prevent an unconditional claim
of full functional parity or victory on every page metric.

The next Compute/Composer improvements should be routing- and framework-aware
keys (including RSC/private behavior), durable globally served public assets,
atomic release promotion/invalidation, shared fills and reusable origin
connections, and timing/colo/ASN/configuration diagnostics. These should be
managed from Composer/framework metadata rather than application-specific
Cloudflare rules or a hand-maintained asset-retention bridge. The current work
improves cached delivery and expiry behavior; it does not make new keys or poor
client-to-edge paths universally faster than Vercel.

The complete local report, raw reports/traces and supplemental controls are in
`output/playwright/blog-cache-final-2026-10-26/`. The rejected experiment and its
controls remain in the separate directories named above. Aggregates are also
recorded in [PR #8602](https://github.com/prisma/web/pull/8602).
