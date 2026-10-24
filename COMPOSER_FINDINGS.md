# Composer and Compute findings from porting Prisma Web

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

The custom domain `https://prisma.sorenbs.com` targets the branch gateway
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
