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

/** Keep the apps' indexing directives and drop the internal hop's ingress noindex. */
export function withRobotsDirectives(handler: Handler): Handler {
  return async (request) => {
    const response = await handler(request);
    if (!response.headers.has(robotsHeader)) return response;
    const headers = new Headers(response.headers);
    headers.delete(robotsHeader);
    const directive = intentionalRobots.find(({ pattern }) =>
      pattern.test(new URL(request.url).pathname),
    );
    if (directive) headers.set(robotsHeader, directive.value);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
