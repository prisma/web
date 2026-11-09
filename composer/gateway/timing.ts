type Handler = (request: Request) => Response | Promise<Response>;

/** Time to upstream headers, without buffering the streamed response body.
 * A CDN HIT retains the timing from its cache fill; it is not per-hit work.
 */
export function withGatewayTiming(handler: Handler): Handler {
  return async (request) => {
    const start = performance.now();
    const response = await handler(request);
    const headers = new Headers(response.headers);
    headers.append("server-timing", `gateway;dur=${(performance.now() - start).toFixed(1)}`);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
