import { getPageImage, source } from "@/lib/source";
import { getPageTitleText } from "@/lib/page-title";
import {
  OG_ACCENTS,
  OG_COLORS,
  OG_HEIGHT,
  OG_WIDTH,
  PrismaOgImage,
  type OgAccent,
} from "@prisma-docs/ui/components/og-image";
import { loadOgFonts } from "@prisma-docs/ui/lib/og-fonts";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const revalidate = false;

const API_PATH_SEGMENT_REGEX = /(\{[^}]+\})/;

/* Product accents from the redesigned site: ORM and Prisma 8 ride cyan,
   Postgres yellow, Compute red. Everything else takes the platform cyan. */
const SECTION_ACCENTS: Record<string, OgAccent> = {
  postgres: "yellow",
  compute: "red",
};

const SECTION_LABELS: Record<string, string> = {
  orm: "Prisma ORM",
  postgres: "Prisma Postgres",
  compute: "Prisma Compute",
  accelerate: "Prisma Accelerate",
  studio: "Prisma Studio",
  console: "Prisma Console",
  composer: "Prisma Composer",
  cli: "Prisma CLI",
  ai: "Prisma AI",
  "rest-api": "Management API",
  "query-insights": "Query Insights",
  "local-development": "Local development",
};

/* HTTP methods on the API reference pages, as tinted mono chips. */
const HTTP_METHOD_ACCENTS: Record<string, OgAccent> = {
  GET: "cyan",
  POST: "yellow",
  DELETE: "red",
};

type OpenApiMetadata = {
  method?: string;
  path?: string;
};

type PageFrontmatter = {
  _openapi?: OpenApiMetadata;
};

function getSectionLabel(section?: string) {
  if (!section) return "Prisma";
  return SECTION_LABELS[section] ?? capitalize(section.replace(/-/g, " "));
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getSectionAccent(section?: string): OgAccent {
  return (section && SECTION_ACCENTS[section]) || "cyan";
}

function ApiPath({ method, apiPath }: { method?: string; apiPath?: string }) {
  const methodAccent = method ? HTTP_METHOD_ACCENTS[method] : undefined;
  const chip = methodAccent
    ? { background: OG_ACCENTS[methodAccent].tint, color: OG_ACCENTS[methodAccent].deep }
    : { background: OG_COLORS.neutralTint, color: OG_COLORS.body };
  const segments = apiPath
    ? apiPath
        .split(API_PATH_SEGMENT_REGEX)
        .filter(Boolean)
        .map((text) => ({
          text,
          isParam: text.startsWith("{") && text.endsWith("}"),
        }))
    : [];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 14,
        fontFamily: "Mona Sans Mono, monospace",
        fontWeight: 500,
        fontSize: 26,
        lineHeight: 1.3,
        color: OG_COLORS.muted,
      }}
    >
      {method ? (
        <div
          style={{
            display: "flex",
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 22,
            lineHeight: 1,
            letterSpacing: "0.02em",
            backgroundColor: chip.background,
            color: chip.color,
          }}
        >
          {method}
        </div>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {segments.map((segment, index) => (
          <span
            key={`${segment.text}-${index}`}
            style={{ color: segment.isParam ? OG_COLORS.cyanDeep : OG_COLORS.muted }}
          >
            {segment.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export async function GET(_req: Request, { params }: RouteContext<"/og/[...slug]">) {
  const { slug } = await params;
  const pageSlug = slug.slice(0, -1);
  const page = source.getPage(pageSlug);
  if (!page) notFound();

  const openApiMetadata = (page.data as PageFrontmatter)._openapi;
  const fonts = await loadOgFonts();
  const title = getPageTitleText(page.data.title, page.slugs.at(-1) ?? "Prisma Docs");
  const section = page.slugs[0];
  const hasApiRow = Boolean(openApiMetadata?.method || openApiMetadata?.path);

  return new ImageResponse(
    <PrismaOgImage
      kicker={getSectionLabel(section)}
      kickerContext="Docs"
      accent={getSectionAccent(section)}
      title={title}
      description={page.data.description}
      detail={
        hasApiRow ? (
          <ApiPath method={openApiMetadata?.method} apiPath={openApiMetadata?.path} />
        ) : undefined
      }
    />,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
