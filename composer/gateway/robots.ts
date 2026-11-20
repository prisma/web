type Handler = (request: Request) => Response | Promise<Response>;

const robotsHeader = "x-robots-tag";

/**
 * Directives the apps set on their own responses (each app's next.config.mjs
 * `headers()`): social cards stay fetchable without being indexed, and the
 * console analytics page stays private. Everything else that reaches the
 * gateway noindexed comes from the compute ingress, which stamps noindex on
 * the internal gateway-to-service hop because it uses generated
 * *.prisma.build hostnames. That directive protects the generated hosts; the
 * gateway must not forward it onto the pages a custom domain serves.
 */
const intentionalRobots: ReadonlyArray<{ pattern: RegExp; value: string }> = [
  { pattern: /^\/(?:og|docs\/og|blog\/og)(?:\/|$)/, value: "noindex" },
  { pattern: /^\/console-analytics\.html$/, value: "noindex, nofollow" },
];

/**
 * Agent-markdown renditions whose directives must never be rewritten: the
 * blog's draft posts set their own conditional noindex on the Markdown
 * (apps/blog/src/app/llms.mdx), which no static allowlist can re-derive, and
 * published renditions name their canonical post instead. Leave the whole
 * path class alone; its internal-ingress noindex is harmless because these
 * responses are not meant to be indexed in the first place.
 */
const passthroughRobots: ReadonlyArray<RegExp> = [
  /^\/blog\/(?:llms\.mdx(?:\/|$)|.+\.mdx?$)/,
];

/**
 * The apps' own marker for an agent-negotiated Markdown rendition: their
 * proxies rewrite a plain post URL to the Markdown route, whose directives
 * (a draft's conditional noindex) depend on the resolved content, not the
 * requested path. The marker is set on the response by the apps themselves,
 * so honoring it keeps the gateway out of the rendition negotiation.
 */
const agentMarkdownMarker = "x-prisma-agent-markdown";

/** Keep the apps' indexing directives and drop the internal hop's ingress noindex. */
export function withRobotsDirectives(handler: Handler): Handler {
  return async (request) => {
    const response = await handler(request);
    const pathname = new URL(request.url).pathname;
    if (!response.headers.has(robotsHeader)) return response;
    if (
      response.headers.has(agentMarkdownMarker) ||
      passthroughRobots.some((pattern) => pattern.test(pathname))
    ) {
      return response;
    }
    const headers = new Headers(response.headers);
    headers.delete(robotsHeader);
    const directive = intentionalRobots.find(({ pattern }) => pattern.test(pathname));
    if (directive) headers.set(robotsHeader, directive.value);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
