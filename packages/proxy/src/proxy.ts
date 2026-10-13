import { compileMatcher, destination, interpolate } from "./match.ts";
import { contains, prepareSites } from "./plan.ts";
import { endToEndHeaders } from "./transport.ts";
import type { MiddlewareContext, ProxyOptions, SiteDefinition, SitePlan } from "./types.ts";

/** Prepare sites at boot and return a handler; no Vercel, Next.js, or Composer dependency. */
export function createProxy(definitions: readonly SiteDefinition[], options: ProxyOptions) {
  const sites = prepareSites(definitions);
  const origins = new Map<string, URL>();
  const compiled = new Map(
    sites.map((site) => {
      const origin = new URL(options.origins[site.name]);
      if (
        !["http:", "https:"].includes(origin.protocol) ||
        origin.pathname !== "/" ||
        origin.search ||
        origin.hash ||
        origin.username ||
        origin.password
      )
        throw new Error(
          `Site ${site.name} requires an HTTP(S) origin without path, query, or credentials`,
        );
      origins.set(site.name, origin);
      for (const rule of site.routing.routes) {
        if (("resource" in rule || rule.check) && !options.hasResource?.[site.name])
          throw new Error(
            `Site ${site.name} requires a hasResource callback for filesystem/check routing`,
          );
        if (!("resource" in rule) && rule.middleware && !options.middleware?.[rule.middleware])
          throw new Error(`Site ${site.name} requires middleware provider: ${rule.middleware}`);
        if (
          !("resource" in rule) &&
          rule.target &&
          !sites.some((target) => target.name === rule.target)
        )
          throw new Error(`Unknown service destination: ${rule.target}`);
      }
      return [
        site.name,
        {
          routes: site.routing.routes.map((rule) =>
            "resource" in rule ? { rule, match: undefined } : { rule, match: compileMatcher(rule) },
          ),
          delegates: (site.routing.delegates ?? []).map(compileMatcher),
        },
      ] as const;
    }),
  );
  if (!sites.some((site) => site.mount === "/"))
    throw new Error("A root site mounted at / is required");
  const aliases = Object.entries(options.originAliases ?? {}).map(([origin, name]) => {
    if (!origins.has(name)) throw new Error(`Unknown origin alias target: ${name}`);
    return [new URL(origin).origin, name] as const;
  });
  const assetMappings = sites
    .flatMap((site) => (site.assets ?? []).map((asset) => ({ site, ...asset })))
    .sort((a, b) => b.prefix.length - a.prefix.length);
  const select = (pathname: string) => {
    const asset = assetMappings.find((mapping) => contains(mapping.prefix, pathname));
    const site =
      asset?.site ??
      sites
        .filter((site) => contains(site.mount, pathname) || site.paths?.includes(pathname))
        .at(-1)!;
    return { site, asset };
  };
  for (const site of sites)
    for (const diagnostic of site.routing.diagnostics ?? []) options.onDiagnostic?.(diagnostic);
  return async (request: Request): Promise<Response> => {
    const publicUrl = new URL(request.url);
    if (options.trustForwardedProto && request.headers.get("x-forwarded-proto") === "https")
      publicUrl.protocol = "https:";
    if (publicUrl.pathname.includes("//")) {
      publicUrl.pathname = publicUrl.pathname.replace(/\/{2,}/g, "/");
      return new Response(null, { status: 308, headers: { location: publicUrl.href } });
    }
    let url = new URL(publicUrl),
      active = sites[0];
    let boundTarget: SitePlan | undefined;
    const responseHeaders = new Headers();
    let responseStatus: number | undefined;
    const context = (site: SitePlan): MiddlewareContext => ({
      request,
      url,
      site,
      target: boundTarget ?? select(url.pathname).site,
      waitUntil: (promise) => {
        const guarded = promise.catch((error) => options.onError?.(error, site.name));
        options.waitUntil?.(guarded);
      },
    });
    const finish = (response: Response, applyStatus = false) => {
      const headers = endToEndHeaders(response.headers);
      responseHeaders.forEach((value, key) => headers.set(key, value));
      const status = applyStatus ? (responseStatus ?? response.status) : response.status;
      const empty = request.method === "HEAD" || [204, 205, 304].includes(status);
      if (empty) void response.body?.cancel();
      return new Response(empty ? null : response.body, {
        status,
        statusText: response.statusText,
        headers,
      });
    };
    const proxy = async (site: SitePlan | undefined, destinationUrl: URL) => {
      const upstream = site ? new URL(origins.get(site.name)!) : new URL(destinationUrl);
      upstream.pathname = destinationUrl.pathname;
      upstream.search = destinationUrl.search;
      const headers = endToEndHeaders(request.headers);
      headers.set("host", site ? publicUrl.host : upstream.host);
      headers.set("x-forwarded-host", publicUrl.host);
      headers.set("x-forwarded-proto", publicUrl.protocol.slice(0, -1));
      const response = await options.fetch(upstream, {
        method: request.method,
        headers,
        redirect: "manual",
        signal: request.signal,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        duplex: "half",
      } as RequestInit);
      const outgoing = endToEndHeaders(response.headers),
        location = outgoing.get("location");
      if (location) {
        const next = new URL(location, upstream);
        if (
          [...origins.values()].some((origin) => origin.origin === next.origin) ||
          aliases.some(([origin]) => origin === next.origin)
        )
          outgoing.set("location", `${publicUrl.origin}${next.pathname}${next.search}${next.hash}`);
      }
      return finish(
        new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: outgoing,
        }),
        true,
      );
    };
    try {
      const visited = new Set<string>();
      let handoffs = 0;
      for (;;) {
        const matched = select(url.pathname);
        const selected = boundTarget
          ? {
              site: boundTarget,
              asset: matched.asset?.site.name === boundTarget.name ? matched.asset : undefined,
            }
          : matched;
        const site =
          sites.find(
            (site) =>
              !visited.has(site.name) &&
              (site.mount === "/" || contains(site.mount, selected.site.mount)),
          ) ?? (visited.has(selected.site.name) ? undefined : selected.site);
        if (!site) {
          if (selected.asset)
            url.pathname =
              selected.asset.destination + url.pathname.slice(selected.asset.prefix.length);
          return await proxy(selected.site, url);
        }
        active = site;
        visited.add(site.name);
        const program = compiled.get(site.name)!;
        let handedOff = false;
        for (const { rule, match } of program.routes) {
          if ("resource" in rule) {
            if (await options.hasResource![site.name](url.pathname)) return await proxy(site, url);
            continue;
          }
          const params = match!(url, request);
          if (!params) continue;
          if (rule.middleware) {
            const response = await options.middleware![rule.middleware](context(site));
            if (response) return finish(response);
          }
          const headers = new Headers();
          for (const [key, value] of Object.entries(rule.headers ?? {}))
            headers.set(interpolate(key, params), interpolate(value, params));
          const location = headers.get("location");
          if (location && rule.status && rule.status >= 300 && rule.status < 400) {
            headers.set("location", destination(location, {}, url).href);
            responseHeaders.forEach((value, key) => headers.set(key, value));
            return new Response(null, { status: rule.status, headers });
          }
          headers.forEach((value, key) => responseHeaders.set(key, value));
          if (rule.status) responseStatus = rule.status;
          if (rule.destination || rule.target) {
            const next = destination(rule.destination ?? url.pathname, params, url);
            if (
              rule.check &&
              next.origin === publicUrl.origin &&
              !(await options.hasResource![site.name](next.pathname))
            )
              continue;
            if (rule.continue) {
              url = next;
              continue;
            }
            const rebound = rule.target ?? aliases.find(([origin]) => origin === next.origin)?.[1];
            if (rebound) {
              if (++handoffs > 32) throw new Error("Proxy service handoff cycle");
              const target = sites.find((site) => site.name === rebound)!;
              boundTarget = target;
              // A service handoff runs the target's own table, without re-entering its parents.
              url = new URL(`${next.pathname}${next.search}`, publicUrl.origin);
              for (const parent of sites) if (parent.name !== rebound) visited.add(parent.name);
              visited.delete(target.name);
              handedOff = true;
              break;
            }
            return await proxy(next.origin === publicUrl.origin ? site : undefined, next);
          }
          if (!rule.continue && !rule.middleware) return await proxy(site, url);
        }
        if (handedOff) continue;
        if (program.delegates.some((match) => match(url, request))) return await proxy(site, url);
        const response = await options.middleware?.[site.name]?.(context(site));
        if (response) return finish(response);
      }
    } catch (error) {
      options.onError?.(error, active.name);
      return new Response(request.signal.aborted ? null : "Website temporarily unavailable", {
        status: request.signal.aborted ? 499 : 502,
      });
    }
  };
}
