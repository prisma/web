# @prisma/proxy

Compose multiple websites behind one streaming HTTP proxy. Each site brings its
own routing configuration, public mount, and upstream origin. This Apache-2.0
library is vendored in `packages/proxy`; this PR does not publish it to npm.

The runtime uses standard `Request`/`Response` objects and has no dependency on
Composer or Next.js. Routing providers prepare a common routing table in memory
at startup; there is no routing-plan build step or generated plan file.
The Vercel adapter uses Vercel's `@vercel/routing-utils` compiler rather than
implementing another version of its destination syntax. Netlify and other
providers can implement the same adapter contract later.

## Use with Bun

Build the vendored workspace package first: `pnpm --filter @prisma/proxy build`.
Point each website at its own `vercel.json`:

```ts
import { createProxy, bunFetch } from "@prisma/proxy";
import { vercel } from "@prisma/proxy/vercel";
import { createHttpServer } from "@prisma/proxy/node";

const sites = [
  { name: "site", mount: "/", routing: vercel(new URL("./site/vercel.json", import.meta.url)) },
  {
    name: "docs",
    mount: "/docs",
    routing: vercel(new URL("./docs/vercel.json", import.meta.url)),
    assets: [{ prefix: "/docs-static/_next", destination: "/docs/_next" }],
    paths: ["/docs.md", "/docs.mdx"],
  },
];

const proxy = createProxy(sites, {
  origins: { site: "http://127.0.0.1:3001", docs: "http://127.0.0.1:3002" },
  fetch: bunFetch,
});
createHttpServer(proxy).listen(3000, "0.0.0.0");
```

`createProxy(sites, options)` reads the files, compiles the rules, and validates
all bindings synchronously before returning its handler. It does this once per
proxy instance, before the server starts accepting requests. Requests reuse the
in-memory tables without file I/O or compilation. Restart the process (or create
a new instance) to load config changes. Missing files, malformed JSON, and
unsupported rules throw at startup with the site and input file context where
applicable. `onDiagnostic` reports nonfatal notices once at startup.

`vercel()` accepts a file URL, a filesystem path string, or an in-memory config
object. Strings resolve from `process.cwd()`; file URLs relative to
`import.meta.url` work regardless of the launch directory. Config objects are
copied before compilation. The Vercel file adapter uses `node:fs`, supported by
Bun and Node; the provider-neutral HTTP core has no filesystem dependency.
Ship the original JSON files alongside the server. Bundlers do not discover
file URL inputs automatically. Building the package above only emits its
JavaScript and TypeScript declarations; it does not generate website routing.

Origins must be HTTP(S) origins without credentials, path, query, or fragment. `bunFetch` disables Bun's
automatic decompression so forwarded compression headers describe the actual
bytes. On Node.js, use `rawFetch` from `@prisma/proxy/node` instead; native Node
`fetch` automatically decompresses responses.

`createHttpServer(handler, { onError? })` adapts the standard fetch handler to
Node's HTTP server. It works on both Node and Bun, preserving known
`Content-Length` on streamed responses, raw compressed bytes, separate
`Set-Cookie` headers, HEAD semantics, backpressure and client cancellation.
It also streams request bodies into the handler. The returned server uses the
standard `.listen()` / `.close()` API. HTTP upgrades/WebSockets are not supported.

Use this adapter rather than `Bun.serve({ fetch: handler })` when acting as a
streaming proxy: Bun 1.4.3 discards explicit `Content-Length` on a streamed fetch
response. A CDN can then download the full file for a range request. The Node
HTTP adapter preserves the header without buffering the response or changing
the Bun runtime.

## Multiple sites and precedence

One site must mount at `/`. Names and mounts must be unique. Routing follows
the ancestor sites from the root to the most specific matching mount. A parent
redirect or terminal rewrite takes precedence over its children's rules. The
child's redirects run before forwarding to its server. Rules keep their order
inside each site's table. Sibling configurations never run on one another's
requests. A mount matches complete segments: `/docs` does not capture
`/docs-other`. Asset mappings keep the upstream's base path and use the longest
matching public prefix. `paths` adds exact paths outside the mount's normal
segment boundary, such as a Markdown rendition of a section root.

For high-level Vercel configs, `paths: "mixed"` is the default adapter option:

- An already-mounted source such as `/docs/showcase` keeps its explicit
  destination `/customers`, allowing redirects to another website.
- A project-relative source `/old/:path*` on the `/docs` site becomes
  `/docs/old/:path*`; its relative destination `/new/:path*` becomes
  `/docs/new/:path*`.
- Absolute destinations remain absolute. Repeated request query values survive,
  except keys explicitly provided by the destination. Destination fragments,
  escaped paths, status codes, and method-preserving redirects are retained.

Use `vercel(config, { paths: "public" })` when every rule already uses public
paths, or `paths: "relative"` when every high-level rule is project-relative.
Vercel route matching is case-sensitive unless an exported rule explicitly
sets `caseSensitive: false`. Repeated slashes produce a 308 normalization
redirect before route evaluation. The compiler reports source-fragment rules
as unreachable: browser fragments never appear in HTTP requests.

## Exports and framework routing

`vercel()` also accepts Build Output API v3 `.vercel/output/config.json` route
exports. Their compiled paths default to `public`; select `relative` to mount
an export whose paths belong to a site's private root. Capture substitution in
`src`/`dest`/headers, methods, `continue`, and named service destinations are
supported. A service handoff runs the target's own table without repeating
its parents, keeping the request path. Vercel's routing-only service `path`
overrides require a resource execution adapter and are rejected. `originAliases`
explicitly rebinds old external application origins
to named sites; intentional external destinations remain external.

Next.js standalone servers should keep executing their own framework routes.
For a root app whose rules can claim child paths, pass its built routes manifest:

```ts
vercel(new URL("./site/vercel.json", import.meta.url), {
  nextjs: new URL("./site/routes-manifest.json", import.meta.url),
});
```

The manifest is read once at boot too; `nextjs` also accepts an in-memory object
with `redirects` and `rewrites.beforeFiles`. Matching Next redirects and external
`beforeFiles` rewrites select that site's server before child dispatch. Next executes the real rule, including its
response behavior and middleware. Other rewrites, Markdown negotiation,
Sentry forwarding, APIs, image handling, and headers remain in the Next servers.

## Middleware, resources, and supported behavior

`createProxy` accepts `middleware` providers keyed by site name or an exported
`middlewarePath`. A provider receives `{ request, url, site, target, waitUntil }`
and returns a final `Response` to intercept the request, or `null`/`undefined`
to continue. A site's hook runs after its imported rules/framework delegates
and before child dispatch. A hook should avoid reading the request body when
continuing, leaving the stream for the upstream. Adapt middleware protocols
explicitly; the library does not execute arbitrary Edge function artifacts.

`waitUntil` schedules background work through the runtime callback supplied in
the options. On a resident Bun/Node server the promise also runs when that
callback is omitted. Rejections go to `onError`. `hasResource[siteName](pathname)`
provides existence checks for `filesystem` and `check` routes. These callbacks
must reflect the site's actual resources; a missing resource/middleware
provider rejects startup rather than silently changing route precedence.

| Behavior | Support |
| --- | --- |
| High-level redirects, rewrites, headers | Vercel compiler + runtime |
| Wildcards, captures, status codes, explicit query precedence | Supported |
| Host/header/cookie/query `has` and `missing` | String/regex conditions; last repeated query value is matched |
| Exported headers, methods, `continue`, service handoffs | Supported |
| `filesystem` / `check`, middleware | Explicit callbacks required |
| `cleanUrls` / `trailingSlash` | Generated redirect rules; resource serving stays with the upstream |
| POST bodies, cookies, RSC, ranges, streaming, cancellation | Preserved |
| Compression | Raw Bun and Node transports included |
| Arbitrary PCRE | JavaScript-compatible subset; unsupported constructs rejected |
| Other routing phases, transforms, object-valued conditions, locale, mitigation | Rejected during compilation |
| Vercel caching/ISR, Edge execution, dashboard domain/firewall rules | Separate platform/framework responsibilities |

Set `trustForwardedProto: true` behind a trusted TLS-terminating ingress to keep
redirects and forwarded origins on HTTPS. Client-supplied host/path data cannot
select an arbitrary upstream. Rewrite origins must be fixed HTTP(S) origins;
dynamic host rewrites are rejected. Responses keep end-to-end headers and
cookies, and hop-by-hop headers are removed. Absolute upstream redirects are
rebased to the public origin. Transport failures produce 502, aborted requests
499; `onError(error, site)` provides application diagnostics.

Upstream HTTP `Host` uses the destination host so ingress can select the correct
service. `X-Forwarded-Host` and `X-Forwarded-Proto` retain the public request
origin. Frameworks that require the public `Host` should restore it after their
ingress boundary using authenticated metadata; forwarding the public `Host` to
a domain-routed ingress can send a request back to the proxy.

`upstreamHeaders({ site, url, publicUrl, request, headers })` can modify outgoing
headers or return additional headers, synchronously or asynchronously. `site`
is undefined for external rewrite destinations. Gate internal credentials on
a trusted named site, and remove client-supplied internal headers before adding
your own. The vendored web setup uses this hook for its authenticated Next.js
origin bridge; that bridge is application configuration outside this library.

## Add another provider

Implement `RoutingAdapter` with a provider name and
`compile({ site, mount }): Routing`. Return an ordered `routes` program using
the public `Route`/`Rule` types, optional framework `delegates`, and diagnostics.
The common representation uses regex patterns, capture templates, conditions,
headers, destinations, and resource/middleware references. `createProxy` calls
the adapter once at startup, so it can read its provider files there. A Netlify
adapter can parse `_redirects`/`netlify.toml` into this representation and express its
ordering and resource checks without changing `createProxy` or the transports.
The runtime defaults to case-sensitive patterns; adapters specify otherwise
when their provider's semantics require it. No Netlify adapter is included yet.

## This repository

`composer/gateway/config.ts` composes site, docs, blog, handbook, and Eclipse.
Site/docs point at copies of their existing `vercel.json` files; the remaining
websites have no Vercel JSON rules and continue using their Next configs. The
build copies those original files and the site Next manifest under
`dist/composer/gateway/sites/`. The small `composer/gateway/server.ts` binds
upstreams from Composer input and calls `createProxy` to compile everything
in memory at boot. No generated routing-plan JSON is shipped.

The optional `composer/gateway/agent-front.ts` middleware bridge preserves the
site's Agent Front behavior on child requests while leaving root requests to
Next, avoiding duplicate reporting. Configure the same ORA settings on the
site input and the gateway's optional `agentFront` input when enabling it;
credentials stay in runtime bindings. It remains disabled when that input is absent. Integration tests use local fixture endpoints.

Validation: `pnpm --filter @prisma/proxy build`,
`pnpm --filter @prisma/proxy test`, `pnpm composer:check`, and
`pnpm composer:build && pnpm composer:smoke`. The repository integration compares
all reachable Vercel JSON redirects with Next's destination compiler and checks
all five site/asset mounts. Library tests cover routing phases, middleware,
streaming, real gzip/cookie transport, and independent provider adapters.
Run `bun test packages/proxy/src/server.test.ts` from the repository root to
verify the HTTP adapter on Bun as well as the default Node test suite.

## License

Apache-2.0; see [LICENSE](LICENSE). The Vercel compiler is a separate Apache-2.0
dependency. The package contains no Prisma website content or credentials.
