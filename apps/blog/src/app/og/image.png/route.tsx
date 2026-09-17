import { BLOG_HOME_DESCRIPTION } from "@/lib/blog-metadata";
import { OG_HEIGHT, OG_WIDTH, PrismaOgImage } from "@prisma-docs/ui/components/og-image";
import { loadOgFonts } from "@prisma-docs/ui/lib/og-fonts";
import { ImageResponse } from "next/og";

export const revalidate = false;

export async function GET() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <PrismaOgImage
      kicker="Blog"
      title="Guides, announcements, and articles from Prisma"
      description={BLOG_HOME_DESCRIPTION}
    />,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
    },
  );
}
