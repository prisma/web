import imageVersions from "../../.generated/public-image-versions.json";

/** The lookup is generated before Next builds; no runtime filesystem tracing or media copies. */
export function versionPublicImage(
  src: string,
  versions: Readonly<Record<string, string>> = imageVersions,
): string {
  if (!src.startsWith("/blog/")) return src;
  const url = new URL(src, "https://blog.invalid");
  const version = versions[url.pathname];
  if (!version) return src;
  url.searchParams.set("__asset", version);
  return `${url.pathname}${url.search}${url.hash}`;
}
