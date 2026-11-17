import type { SiteDefinition, SitePlan } from "./types.ts";

export function contains(mount: string, pathname: string) {
  return mount === "/" || pathname === mount || pathname.startsWith(`${mount}/`);
}
export function validatePath(path: string) {
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("?") ||
    path.includes("#") ||
    path.includes("\\") ||
    (path !== "/" && path.endsWith("/"))
  )
    throw new Error(`Expected an absolute path without a trailing slash: ${path}`);
}
/** Read and validate adapters once at startup; never persist a routing artifact. */
export function prepareSites(sites: readonly SiteDefinition[]): SitePlan[] {
  const names = new Set<string>(),
    mounts = new Set<string>(),
    assets = new Set<string>();
  const prepared: SitePlan[] = [];
  for (const site of sites) {
    validatePath(site.mount);
    if (!site.name || names.has(site.name) || mounts.has(site.mount))
      throw new Error(`Duplicate site name or mount: ${site.name} (${site.mount})`);
    names.add(site.name);
    mounts.add(site.mount);
    for (const path of site.paths ?? []) validatePath(path);
    for (const asset of site.assets ?? []) {
      validatePath(asset.prefix);
      validatePath(asset.destination);
      if (assets.has(asset.prefix)) throw new Error(`Duplicate asset prefix: ${asset.prefix}`);
      assets.add(asset.prefix);
    }
    let routing;
    try {
      routing = site.routing.compile({ site: site.name, mount: site.mount });
    } catch (error) {
      throw new Error(`Site ${site.name}: ${site.routing.name} routing failed: ${String(error)}`, {
        cause: error,
      });
    }
    for (const rule of [...routing.routes, ...(routing.delegates ?? [])]) {
      if ("resource" in rule) continue;
      if (
        rule.status !== undefined &&
        (!Number.isInteger(rule.status) || rule.status < 200 || rule.status > 599)
      )
        throw new Error(`Unsupported HTTP response status: ${rule.status}`);
      if (rule.destination) {
        if (rule.destination.startsWith("//"))
          throw new Error(`Protocol-relative rewrite is unsupported: ${rule.destination}`);
        const url = new URL(rule.destination, "http://proxy.invalid");
        if (
          !["http:", "https:"].includes(url.protocol) ||
          url.username ||
          url.password ||
          url.host.includes("$")
        )
          throw new Error(`Rewrite must have a fixed HTTP(S) origin: ${rule.destination}`);
      }
    }
    const { routing: _adapter, ...settings } = site;
    prepared.push({ ...settings, routing });
  }
  if (!mounts.has("/")) throw new Error("A root site mounted at / is required");
  prepared.sort((a, b) => a.mount.length - b.mount.length);
  return prepared;
}
