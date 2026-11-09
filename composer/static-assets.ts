export const staticManifestPath = "/_composer/static-assets.json";
export const blogStaleSeconds = 86_400;
export const staticRetentionSeconds = 172_800;

export type StaticAsset = {
  sha256: string;
  bytes: number;
  contentType: string;
  current: boolean;
  expiresAt?: number;
};

export type StaticAssets = {
  version: 1;
  release: string;
  blogStaleSeconds: number;
  assets: Record<string, StaticAsset>;
};

export function staticAssetKey(pathname: string): string {
  let path = pathname;
  if (path.startsWith("/_next/static/")) path = `/site-static${path}`;
  path = path.replace(
    /^\/(docs|blog|handbook|eclipse)\/_next\/static\//,
    "/$1-static/_next/static/",
  );
  try {
    return path.split("/").map(decodeURIComponent).map(encodeURIComponent).join("/");
  } catch {
    return "";
  }
}
