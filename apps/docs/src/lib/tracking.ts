type ContentArea = "ppg" | "orm" | "accelerate" | "console" | "guides" | "ai" | "other";

const PREFIX_MAP: [string, ContentArea][] = [
  ["/postgres", "ppg"],
  ["/prisma-postgres", "ppg"],
  ["/orm", "orm"],
  ["/prisma-orm", "orm"],
  ["/accelerate", "accelerate"],
  ["/console", "console"],
  ["/guides", "guides"],
  ["/ai", "ai"],
];

const PPG_AREAS: Set<ContentArea> = new Set(["ppg"]);

export function getContentArea(pathname: string): ContentArea {
  const stripped = pathname.replace(/^\/docs\/v\d+/, "");
  for (const [prefix, area] of PREFIX_MAP) {
    if (stripped.startsWith(prefix)) return area;
  }
  return "other";
}

export function isPpgOrCompute(area: ContentArea): boolean {
  return PPG_AREAS.has(area);
}

export function getContentSubtype(pathname: string): string | null {
  if (pathname.includes("/quickstart")) return "quickstart";
  if (pathname.includes("/getting-started")) return "getting-started";
  return null;
}
