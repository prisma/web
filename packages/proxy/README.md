# @prisma/proxy

Compose multiple websites behind one streaming HTTP proxy. Each site brings its
own routing configuration, public mount, and upstream origin. This Apache-2.0
library is vendored in `packages/proxy`; this PR does not publish it to npm.

The runtime uses standard `Request`/`Response` objects and has no dependency on
Composer or Next.js. Routing providers compile into a common, serializable plan.
The Vercel adapter uses Vercel's `@vercel/routing-utils` compiler rather than
implementing another version of its destination syntax. Netlify and other
providers can implement the same adapter contract later.

## Use with Bun

Build the vendored workspace package first: `pnpm --filter @prisma/proxy build`.
The following example imports a separate `vercel.json` for each website:

```ts
import { compileProxy, createProxy, bunFetch } from "@prisma/proxy";
import { vercel } from "@prisma/proxy/vercel";
import siteConfig from "./site/vercel.json" with { type: "json" };
import docsConfig from "./docs/vercel.json" with { type: "json" };

const plan = compileProxy([
  { name: "site", mount: "/", routing: vercel(siteConfig) },
  {
    name: "docs",
    mount: "/docs",
    routing: vercel(docsConfig),
    assets: [{ prefix: "/docs-static/_next", destination: "/docs/_next" }],
    paths: ["/docs.md", "/docs.mdx"],
  },
]);

Bun.serve({
  port: 3000,
  fetch: createProxy(plan, {
    origins: { site: "http://127.0.0.1:3001", docs: "http://127.0.0.1:3002" },
    fetch: bunFetch,
  }),
});
```

Compile and serialize `plan` on the build machine when possible. At runtime,
read that JSON and provide environment-specific origins. The compiler and its
dependencies then stay out of the gateway bundle. Origins must be HTTP(S)
origins without credentials, path, query, or fragment. `bunFetch` disables Bun's
automatic decompression so forwarded compression headers describe the actual
bytes. On Node.js, use `rawFetch` from `@prisma/proxy/node` instead; native Node
`fetch` automatically decompresses responses.

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
vercel(siteConfig, {
  nextjs: {
    redirects: manifest.redirects,
    rewrites: manifest.rewrites,
  },
});
```

Matching Next redirects and external `beforeFiles` rewrites select that site's
server before child dispatch. Next executes the real rule, including its
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

## Add another provider

Implement `RoutingAdapter` with a provider name and
`compile({ site, mount }): Routing`. Return an ordered `routes` program using
the public `Route`/`Rule` types, optional framework `delegates`, and diagnostics.
The common representation uses regex patterns, capture templates, conditions,
headers, destinations, and resource/middleware references. A Netlify adapter
can parse `_redirects`/`netlify.toml` into this representation and express its
ordering and resource checks without changing `createProxy` or the transports.
The runtime defaults to case-sensitive patterns; adapters specify otherwise
when their provider's semantics require it. No Netlify adapter is included yet.

## This repository

`composer/gateway/config.ts` composes site, docs, blog, handbook, and Eclipse.
Site/docs import their existing `vercel.json` files; the remaining websites
have no Vercel JSON rules and continue using their Next configs. The build
writes the compiled plan to `dist/composer/gateway/routing.json`.
`composer/gateway/server.ts` is the small runtime entrypoint, with upstreams
resolved from Composer service input.

The optional `composer/gateway/agent-front.ts` middleware bridge preserves the
site's Agent Front behavior on child requests while leaving root requests to
Next, avoiding duplicate reporting. Configure the same ORA settings on the
site input and the gateway's optional `agentFront` input when enabling it;
credentials are not serialized into the routing plan. It remains disabled
when that input is absent. Integration tests use local fixture endpoints.

Validation: `pnpm --filter @prisma/proxy build`,
`pnpm --filter @prisma/proxy test`, `pnpm composer:check`, and
`pnpm composer:build && pnpm composer:smoke`. The repository integration compares
all reachable Vercel JSON redirects with Next's destination compiler and checks
all five site/asset mounts. Library tests cover routing phases, middleware,
streaming, real gzip/cookie transport, and independent provider adapters.

## License

Apache-2.0; see [LICENSE](LICENSE). The Vercel compiler is a separate Apache-2.0
dependency. The package contains no Prisma website content or credentials.
