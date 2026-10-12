import { match } from "path-to-regexp";
import siteConfig from "../../apps/site/vercel.json" with { type: "json" };
import docsConfig from "../../apps/docs/vercel.json" with { type: "json" };

export const zones = ["site", "docs", "blog", "handbook", "eclipse"] as const;
export type Zone = (typeof zones)[number];

export function route(pathname: string): { zone: Zone; pathname: string } {
  for (const zone of zones) {
    const prefix = `/${zone}-static`;
    if (pathname.startsWith(`${prefix}/_next/`)) {
      return {
        zone,
        pathname: `${zone === "site" ? "" : `/${zone}`}${pathname.slice(prefix.length)}`,
      };
    }
    if (
      zone !== "site" &&
      (pathname === `/${zone}` ||
        pathname.startsWith(`/${zone}/`) ||
        pathname === `/${zone}.md` ||
        pathname === `/${zone}.mdx`)
    ) {
      return { zone, pathname };
    }
  }
  return { zone: "site", pathname };
}

interface Condition {
  type: "host" | "header" | "query" | "cookie";
  key?: string;
  value?: string;
}

export interface Redirect {
  source: string;
  destination: string;
  permanent?: boolean;
  statusCode?: number;
  regex?: string;
  has?: Condition[];
  missing?: Condition[];
}
export function redirectMatcher(rules: readonly Redirect[]) {
  const compiled = rules.map((rule) => ({
    ...rule,
    matches: match(rule.source, { sensitive: false }),
  }));
  return (url: URL, headers = new Headers()) => {
    for (const rule of compiled) {
      if (rule.regex && !new RegExp(rule.regex, "i").test(url.pathname)) continue;
      const result = rule.matches(url.pathname);
      if (!result) continue;
      const parameters: Record<string, string | string[]> = { ...result.params };
      const satisfies = (condition: Condition) => {
        const value =
          condition.type === "host"
            ? url.hostname
            : condition.type === "header"
              ? headers.get(condition.key!)
              : condition.type === "query"
                ? url.searchParams.get(condition.key!)
                : (headers.get("cookie") ?? "")
                    .split(";")
                    .map((item) => item.trim())
                    .find((item) => item.startsWith(`${condition.key}=`))
                    ?.slice(condition.key!.length + 1);
        if (value == null) return false;
        if (condition.value === undefined) return true;
        const matched = new RegExp(`^(?:${condition.value})$`).exec(value);
        if (matched?.groups) Object.assign(parameters, matched.groups);
        return Boolean(matched);
      };
      if (rule.has && !rule.has.every(satisfies)) continue;
      if (rule.missing?.some(satisfies)) continue;
      const destination = rule.destination.replace(/:([A-Za-z0-9_]+)[*+]?/g, (_, name: string) => {
        const value = parameters[name];
        return Array.isArray(value) ? value.join("/") : (value ?? "");
      });
      const location = new URL(destination, url.origin);
      const destinationQuery = new Set(location.searchParams.keys());
      for (const [name, value] of url.searchParams) {
        if (!destinationQuery.has(name)) location.searchParams.append(name, value);
      }
      return { location: location.href, status: rule.statusCode ?? (rule.permanent ? 308 : 307) };
    }
    return undefined;
  };
}

export const siteRedirect = redirectMatcher(siteConfig.redirects);
// Vercel's docs project sees both prefixed and unprefixed variants. Normalize
// the latter for the gateway's /docs mount, preserving table order. Only those
// unprefixed rules need a relative destination mounted under /docs; already
// prefixed rules can intentionally redirect out to marketing pages.
export const docsRedirect = redirectMatcher(
  docsConfig.redirects.map((rule) => ({
    ...rule,
    source: rule.source.startsWith("/docs") ? rule.source : `/docs${rule.source}`,
    destination:
      !rule.source.startsWith("/docs") &&
      rule.destination.startsWith("/") &&
      !rule.destination.startsWith("/docs")
        ? `/docs${rule.destination}`
        : rule.destination,
  })),
);

export function redirect(url: URL, headers = new Headers()) {
  return (
    siteRedirect(url, headers) ??
    (route(url.pathname).zone === "docs" ? docsRedirect(url, headers) : undefined)
  );
}
