/** Provider-neutral routing contracts, prepared in memory at startup. */
export interface Condition {
  type: "host" | "header" | "query" | "cookie";
  key?: string;
  value?: string;
}
export interface Rule {
  pattern: string;
  caseSensitive?: boolean;
  destination?: string;
  target?: string;
  headers?: Record<string, string>;
  status?: number;
  methods?: string[];
  has?: Condition[];
  missing?: Condition[];
  continue?: boolean;
  check?: boolean;
  middleware?: string;
}
export type Route = Rule | { resource: true };
export interface Diagnostic {
  site: string;
  provider: string;
  code: string;
  message: string;
}
export interface Routing {
  routes: Route[];
  /** Requests claimed by the framework must reach its server before child dispatch. */
  delegates?: Rule[];
  diagnostics?: Diagnostic[];
}
export interface RoutingAdapter {
  readonly name: string;
  compile(context: { site: string; mount: string }): Routing;
}
export interface AssetMapping {
  prefix: string;
  destination: string;
}
export interface SiteDefinition {
  name: string;
  mount: string;
  routing: RoutingAdapter;
  /** Additional exact paths, e.g. /docs.md, belonging to this site. */
  paths?: string[];
  assets?: AssetMapping[];
}
export interface SitePlan extends Omit<SiteDefinition, "routing"> {
  routing: Routing;
}
export interface MiddlewareContext {
  request: Request;
  url: URL;
  site: SitePlan;
  target: SitePlan;
  waitUntil(promise: Promise<unknown>): void;
}
export type Middleware = (
  context: MiddlewareContext,
) => Response | void | null | Promise<Response | void | null>;
export type ResourceChecker = (pathname: string) => boolean | Promise<boolean>;
/** The transport must return raw response bytes, without automatic decompression. */
export type ProxyFetch = (url: string | URL, init: RequestInit) => Promise<Response>;
export interface ProxyOptions {
  origins: Record<string, string>;
  fetch: ProxyFetch;
  middleware?: Record<string, Middleware>;
  hasResource?: Record<string, ResourceChecker>;
  /** Old application origins explicitly rebound to named sites. */
  originAliases?: Record<string, string>;
  /** Enable only behind a trusted TLS-terminating ingress. */
  trustForwardedProto?: boolean;
  waitUntil?: (promise: Promise<unknown>) => void;
  onError?: (error: unknown, site: string) => void;
  /** Called once per diagnostic at startup, after routing and bindings validate. */
  onDiagnostic?: (diagnostic: Diagnostic) => void;
}
