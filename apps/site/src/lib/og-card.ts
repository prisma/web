import type { OgAccent } from "@prisma-docs/ui/components/og-image";

/**
 * The generated Open Graph card for marketing pages, served by
 * `app/og/card.png/route.tsx`. The page's own title and description ride in
 * the query string so a page needs no hand-made PNG; the route clamps them to
 * the lengths the card can show.
 */
export const OG_CARD_PATH = "/og/card.png";
export const OG_CARD_TITLE_MAX = 120;
export const OG_CARD_DESCRIPTION_MAX = 200;
export const OG_CARD_KICKER_MAX = 40;

export const OG_CARD_ACCENTS: readonly OgAccent[] = ["cyan", "yellow", "red"];

export type OgCardOptions = {
  title: string;
  description?: string;
  /** Sentence-case eyebrow above the title. Defaults to "Prisma". */
  kicker?: string;
  accent?: OgAccent;
};

export function clampOgText(value: string, max: number) {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function getOgCardUrl({ title, description, kicker, accent }: OgCardOptions) {
  const params = new URLSearchParams();
  params.set("title", clampOgText(title, OG_CARD_TITLE_MAX));
  if (description) params.set("description", clampOgText(description, OG_CARD_DESCRIPTION_MAX));
  if (kicker) params.set("kicker", clampOgText(kicker, OG_CARD_KICKER_MAX));
  if (accent && accent !== "cyan") params.set("accent", accent);

  return `${OG_CARD_PATH}?${params.toString()}`;
}
