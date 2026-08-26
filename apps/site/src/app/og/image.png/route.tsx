import { SITE_HOME_DESCRIPTION, SITE_HOME_TAGLINE, SITE_NAME } from "@/lib/site-metadata";
import { OG_HEIGHT, OG_WIDTH, PrismaOgImage } from "@prisma-docs/ui/components/og-image";
import { loadOgFonts } from "@prisma-docs/ui/lib/og-fonts";
import { ImageResponse } from "next/og";

export const revalidate = false;

export async function GET() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <PrismaOgImage
      kicker={SITE_NAME}
      title={SITE_HOME_TAGLINE}
      description={SITE_HOME_DESCRIPTION}
    />,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
    },
  );
}
