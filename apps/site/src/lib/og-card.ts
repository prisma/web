import type { OgAccent } from "@prisma-docs/ui/components/og-image";
import { SITE_NAME } from "@/lib/site-metadata";

/**
 * The generated Open Graph card for marketing pages, served by
 * `app/og/card.png/route.tsx`. A page's title, description, kicker, and
 * accent ride in the query string, so no page needs a hand-made PNG. Both
 * sides of the URL go through the same clamps: `getOgCardUrl` when the page
 * builds it, `parseOgCardParams` when the route reads it back.
 */
export const OG_CARD_PATH = "/og/card.png";

const LIMITS = { title: 120, description: 200, kicker: 40 } as const;
const ACCENTS: readonly OgAccent[] = ["cyan", "yellow", "red"];
const DEFAULT_ACCENT: OgAccent = "cyan";

export type OgCardOptions = {
  title: string;
  description?: string;
  /** Sentence-case eyebrow above the title. Defaults to the site name. */
  kicker?: string;
  /** Product accent for the kicker dot. Defaults to cyan. */
  accent?: OgAccent;
};

function clamp(value: string | null | undefined, max: number) {
  const text = (value ?? "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function getOgCardUrl({ title, description, kicker, accent }: OgCardOptions) {
  const params = new URLSearchParams({ title: clamp(title, LIMITS.title) });
  if (description) params.set("description", clamp(description, LIMITS.description));
  if (kicker) params.set("kicker", clamp(kicker, LIMITS.kicker));
  if (accent && accent !== DEFAULT_ACCENT) params.set("accent", accent);

  return `${OG_CARD_PATH}?${params}`;
}

export function parseOgCardParams(params: URLSearchParams): Required<OgCardOptions> {
  const accent = params.get("accent");

  return {
    title: clamp(params.get("title"), LIMITS.title) || SITE_NAME,
    description: clamp(params.get("description"), LIMITS.description),
    kicker: clamp(params.get("kicker"), LIMITS.kicker) || SITE_NAME,
    accent: ACCENTS.find((value) => value === accent) ?? DEFAULT_ACCENT,
  };
}
