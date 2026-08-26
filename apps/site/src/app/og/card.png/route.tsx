import { parseOgCardParams } from "@/lib/og-card";
import { OG_HEIGHT, OG_WIDTH, PrismaOgImage } from "@prisma-docs/ui/components/og-image";
import { loadOgFonts } from "@prisma-docs/ui/lib/og-fonts";
import { ImageResponse } from "next/og";

/**
 * Per-page Open Graph card for the marketing site. `createPageMetadata`
 * points every page here with its copy in the query string (see
 * `lib/og-card.ts`). Rendered on request and cached for a year: the inputs
 * are the URL, so a copy change is a new URL and a fresh image.
 */
export async function GET(request: Request) {
  const { title, description, kicker, accent } = parseOgCardParams(
    new URL(request.url).searchParams,
  );

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
      fonts: await loadOgFonts(),
      headers: { "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable" },
    },
  );
}
