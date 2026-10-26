import {
  getTransformedRoutes,
  normalizeRoutes,
  sourceToRegex,
  type GetRoutesProps,
  type RouteWithSrc,
} from "@vercel/routing-utils";
import type { Condition, Diagnostic, Route, Rule, RoutingAdapter } from "./types.ts";
import { readFileSync } from "node:fs";

export type VercelConfig = GetRoutesProps & { [key: string]: unknown };
export interface VercelExport {
  version: 3;
  routes?: import("@vercel/routing-utils").RouteInput[];
}
export interface FrameworkRule {
  source: string;
  destination: string;
  regex?: string;
  has?: Condition[];
  missing?: Condition[];
}
export interface NextjsRouting {
  redirects?: FrameworkRule[];
  rewrites?: { beforeFiles?: FrameworkRule[] };
}
/** Strings resolve from process.cwd(); file URLs provide location-independent paths. */
export type VercelSource = VercelConfig | VercelExport | string | URL;
export interface VercelOptions {
  /** mixed accepts existing public paths and mounts project-relative rules. */
  paths?: "mixed" | "public" | "relative";
  /** Next's server executes these rules; the proxy preserves parent-site precedence. */
  nextjs?: NextjsRouting | string | URL;
}
function load<T extends object>(source: T | string | URL): T {
  let value: unknown = source;
  if (typeof source === "string" || source instanceof URL) {
    try {
      value = JSON.parse(readFileSync(source, "utf8"));
    } catch (error) {
      throw new Error(`Cannot read routing JSON ${String(source)}: ${String(error)}`, {
        cause: error,
      });
    }
  }
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new Error(`Expected a routing JSON object: ${String(source)}`);
  return value as T;
}
const supported = new Set([
  "src",
  "dest",
  "destination",
  "headers",
  "status",
  "methods",
  "continue",
  "check",
  "caseSensitive",
  "has",
  "missing",
  "middlewarePath",
  "middlewareRawSrc",
]);
function conditions(input: RouteWithSrc["has"]): Condition[] | undefined {
  return input?.map((condition) => {
    if (
      !["host", "header", "cookie", "query"].includes(condition.type) ||
      (condition.type !== "host" && !condition.key)
    )
      throw new Error("Invalid route condition type or missing key");
    if (condition.value !== undefined && typeof condition.value !== "string")
      throw new Error("Object-valued route conditions are not supported");
    return { ...condition } as Condition;
  });
}
function isPublic(path: string, mount: string) {
  return (
    mount === "/" || path === mount || path.startsWith(`${mount}/`) || path.startsWith(`${mount}.`)
  );
}
function mountPath(path: string, mount: string) {
  return path === "/" ? mount : `${mount}${path}`;
}

/** Read a config or export and compile it once when createProxy prepares the site. */
export function vercel(config: VercelSource, options: VercelOptions = {}): RoutingAdapter {
  return {
    name: "vercel",
    compile({ site, mount }) {
      try {
        // Vercel's compiler normalizes condition keys in place; never mutate caller config.
        const input = structuredClone(load<VercelConfig | VercelExport>(config)) as VercelConfig,
          diagnostics: Diagnostic[] = [];
        const nextjs =
          options.nextjs === undefined ? undefined : load<NextjsRouting>(options.nextjs);
        const exported = input.version === 3;
        if (input.version !== undefined && input.version !== 2 && input.version !== 3)
          throw new Error(`Site ${site}: unsupported Vercel export version`);
        const scope = options.paths ?? (exported ? "public" : "mixed");
        if (!exported && mount !== "/" && input.routes?.length && scope !== "public")
          throw new Error(
            `Site ${site}: use a v3 export with paths: relative, or paths: public for raw routes`,
          );
        const normalize = <T extends { source: string; destination?: unknown }>(rule: T) => {
          if (rule.source.includes("#"))
            diagnostics.push({
              site,
              provider: "vercel",
              code: "unreachable-source",
              message: `Fragment source never reaches HTTP: ${rule.source}`,
            });
          const relative =
            mount !== "/" &&
            (scope === "relative" || (scope === "mixed" && !isPublic(rule.source, mount)));
          if (!relative) return rule;
          return {
            ...rule,
            source: mountPath(rule.source, mount),
            ...(typeof rule.destination === "string" &&
            rule.destination.startsWith("/") &&
            !rule.destination.startsWith("//") &&
            !isPublic(rule.destination, mount)
              ? { destination: mountPath(rule.destination, mount) }
              : {}),
          };
        };
        let result;
        try {
          result = exported
            ? normalizeRoutes(input.routes ?? [])
            : getTransformedRoutes({
                routes: input.routes,
                redirects: input.redirects?.map(normalize),
                headers: input.headers?.map(normalize),
                rewrites: input.rewrites?.map(normalize),
                cleanUrls: input.cleanUrls,
                trailingSlash: input.trailingSlash,
              });
        } catch (error) {
          throw new Error(`Site ${site}: Vercel compilation failed`, { cause: error });
        }
        if (result.error) throw new Error(`Site ${site}: ${result.error.message}`);
        const routes: Route[] = (result.routes ?? []).map((route, index) => {
          const fail = (message: string): never => {
            throw new Error(`Site ${site}, Vercel rule ${index}: ${message}`);
          };
          if ("handle" in route) {
            if (route.handle !== "filesystem") return fail(`unsupported phase ${route.handle}`);
            return { resource: true };
          }
          for (const key of Object.keys(route))
            if (!supported.has(key)) fail(`unsupported field ${key}`);
          const target =
            route.destination && typeof route.destination === "object"
              ? route.destination.service
              : undefined;
          if (
            target &&
            typeof route.destination === "object" &&
            route.destination.path !== undefined
          )
            fail("routing-only service path overrides require a resource execution adapter");
          const rule: Rule = {
            pattern: route.src,
            destination: target
              ? route.destination && typeof route.destination === "object"
                ? route.destination.path
                : undefined
              : route.dest,
            target,
            headers: route.headers,
            status: route.status,
            methods: route.methods,
            continue: route.continue,
            check: route.check,
            caseSensitive: route.caseSensitive ?? true,
            has: conditions(route.has),
            missing: conditions(route.missing),
            middleware: route.middlewarePath,
          };
          if (exported && scope === "relative" && mount !== "/") {
            rule.pattern =
              rule.pattern === "^/$"
                ? `^${mount.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`
                : `^${mount.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${rule.pattern.replace(/^\^/, "")}`;
            rule.headers =
              rule.headers &&
              Object.fromEntries(
                Object.entries(rule.headers).map(([key, value]) => [
                  key,
                  key.toLowerCase() === "location" &&
                  value.startsWith("/") &&
                  !value.startsWith("//")
                    ? mountPath(value, mount)
                    : value,
                ]),
              );
            if (rule.destination?.startsWith("/") && !rule.destination.startsWith("//"))
              rule.destination = mountPath(rule.destination, mount);
          }
          return rule;
        });
        const delegates = [
          ...(nextjs?.redirects ?? []),
          ...(nextjs?.rewrites?.beforeFiles?.filter((rule) =>
            /^https?:\/\//.test(rule.destination),
          ) ?? []),
        ].map((rule) => ({
          pattern: rule.regex ?? sourceToRegex(rule.source).src,
          caseSensitive: false,
          has: rule.has,
          missing: rule.missing,
        }));
        return { routes, delegates, diagnostics };
      } catch (error) {
        const files = [config, options.nextjs].filter(
          (source) => typeof source === "string" || source instanceof URL,
        );
        if (!files.length) throw error;
        throw new Error(`Vercel inputs ${files.join(", ")}: ${String(error)}`, { cause: error });
      }
    },
  };
}
