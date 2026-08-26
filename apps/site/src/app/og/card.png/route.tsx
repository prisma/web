import {
  clampOgText,
  OG_CARD_ACCENTS,
  OG_CARD_DESCRIPTION_MAX,
  OG_CARD_KICKER_MAX,
  OG_CARD_TITLE_MAX,
} from "@/lib/og-card";
import { SITE_NAME } from "@/lib/site-metadata";
import {
  OG_HEIGHT,
  OG_WIDTH,
  PrismaOgImage,
  type OgAccent,
} from "@prisma-docs/ui/components/og-image";
import { loadOgFonts } from "@prisma-docs/ui/lib/og-fonts";
import { ImageResponse } from "next/og";

/**
 * Per-page Open Graph card for the marketing site. Pages point at this route
 * through `createPageMetadata`, which encodes their title and description in
 * the query string (see `lib/og-card.ts`), so no page needs a hand-made PNG.
 * Rendered on request and cached at the edge for a year: the inputs are in
 * the URL, so a copy change produces a new URL and a fresh image.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clampOgText(searchParams.get("title") ?? "", OG_CARD_TITLE_MAX) || SITE_NAME;
  const description = clampOgText(searchParams.get("description") ?? "", OG_CARD_DESCRIPTION_MAX);
  const kicker = clampOgText(searchParams.get("kicker") ?? "", OG_CARD_KICKER_MAX) || SITE_NAME;
  const requestedAccent = searchParams.get("accent");
  const accent = OG_CARD_ACCENTS.find((value) => value === requestedAccent) ?? ("cyan" as OgAccent);
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <PrismaOgImage
      kicker={kicker}
      accent={accent}
      title={title}
      description={description || undefined}
    />,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    },
  );
}
