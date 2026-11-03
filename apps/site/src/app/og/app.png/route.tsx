import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { OG_COLORS, OG_HEIGHT, OG_WIDTH, PrismaLockup } from "@prisma-docs/ui/components/og-image";
import { loadOgFonts } from "@prisma-docs/ui/lib/og-fonts";
import { authorBadge, templatePage, type GalleryTemplate } from "@/app/apps/_lib/catalog";
import { findTemplate } from "@/app/apps/_lib/manifest";

/**
 * The social card for an app page (/apps/{id}): the app's name, one line
 * about it, who built it, and its screenshot leaning in from the right, so
 * a link on X, LinkedIn, Slack or Discord shows the app itself rather than
 * a text card. Everything satori needs is embedded: fonts from disk, the
 * screenshot and the author's photo as data URIs.
 *
 * `?id=` names the template; `?v=` is the page's hash of the card's inputs,
 * so a copy change is a new URL and the platforms' caches refill on their own.
 */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const template = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ? await findTemplate(id) : null;
  if (!template) return new Response("Not found", { status: 404 });

  const page = templatePage(template);
  const [fonts, screenshot, avatar] = await Promise.all([
    loadOgFonts(),
    loadPublicImage(template.preview),
    loadAvatar(template),
  ]);

  return new ImageResponse(
    <AppCard
      template={template}
      title={page.ogTitle}
      tagline={page.tagline}
      screenshot={screenshot}
      avatar={avatar}
    />,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    },
  );
}

// A file under /public as a data URI, or null when the template has no
// screenshot yet (the card then gives the copy the whole width).
async function loadPublicImage(publicPath: string | null): Promise<string | null> {
  if (!publicPath || !publicPath.startsWith("/")) return null;
  try {
    const buffer = await readFile(path.join(process.cwd(), "public", publicPath));
    const type = publicPath.endsWith(".svg") ? "image/svg+xml" : "image/png";
    return `data:${type};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

// The byline mark, with the same rules as the gallery card: Prisma keeps its
// logomark, a community author gets their GitHub photo, and when the photo
// cannot be fetched in time the card prints their initial instead.
async function loadAvatar(template: GalleryTemplate): Promise<string | null> {
  const badge = authorBadge(template.author);
  if (badge.kind === "prisma") return loadPublicImage("/brand-kit/logo-mark/logo-mark.svg");
  if (badge.kind !== "photo") return null;
  try {
    const url = new URL(badge.src);
    if (url.hostname === "github.com") url.searchParams.set("size", "96");
    const response = await fetch(url, {
      signal: AbortSignal.timeout(4_000),
      next: { revalidate: 86_400 },
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "image/png";
    if (!type.startsWith("image/")) return null;
    return `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

const PADDING = 72;
// The copy column; the screenshot takes the rest and bleeds off the right edge.
const COPY_WIDTH = 540;
const SHOT_LEFT = 660;
const SHOT_WIDTH = 760;
const SHOT_TOP = 112;

function titleFontSize(title: string, wide: boolean) {
  if (wide) return title.length <= 40 ? 64 : 52;
  if (title.length <= 24) return 58;
  if (title.length <= 44) return 48;
  return 40;
}

function AppCard({
  template,
  title,
  tagline,
  screenshot,
  avatar,
}: {
  template: GalleryTemplate;
  title: string;
  tagline: string;
  screenshot: string | null;
  avatar: string | null;
}) {
  const wide = screenshot === null;
  const copyWidth = wide ? OG_WIDTH - PADDING * 2 : COPY_WIDTH;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: OG_COLORS.white,
        backgroundImage: `linear-gradient(180deg, ${OG_COLORS.white} 0%, ${OG_COLORS.paper} 100%)`,
        color: OG_COLORS.ink,
      }}
    >
      {/* Compute's red pools along the bottom edge, a little cyan at the top
          right, the same wash the /apps hero carries. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          backgroundImage:
            "radial-gradient(circle at 10% 104%, rgba(243, 74, 96, 0.2) 0%, rgba(243, 74, 96, 0) 46%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          backgroundImage:
            "radial-gradient(circle at 48% 110%, rgba(243, 195, 6, 0.14) 0%, rgba(243, 195, 6, 0) 36%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          backgroundImage:
            "radial-gradient(circle at 100% -4%, rgba(1, 215, 228, 0.16) 0%, rgba(1, 215, 228, 0) 38%)",
        }}
      />

      {/* Copy column */}
      <div
        style={{
          position: "absolute",
          top: PADDING,
          left: PADDING,
          width: copyWidth,
          height: OG_HEIGHT - PADDING * 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 10,
              height: 10,
              borderRadius: 10,
              backgroundColor: OG_COLORS.red,
            }}
          />
          <span style={{ color: "rgba(21, 21, 21, 0.72)" }}>Prisma Compute app</span>
          <span style={{ color: "rgba(21, 21, 21, 0.4)", fontWeight: 400 }}>
            {template.framework.label}
          </span>
        </div>

        <div
          style={{
            display: "block",
            marginTop: 28,
            fontFamily: "Sora, sans-serif",
            fontWeight: 500,
            fontSize: titleFontSize(title, wide),
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            color: OG_COLORS.ink,
            lineClamp: 3,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "block",
            marginTop: 20,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 24,
            lineHeight: 1.4,
            color: OG_COLORS.muted,
            lineClamp: wide ? 2 : 3,
          }}
        >
          {tagline}
        </div>

        {/* Byline sits on the baseline of the copy column; the lockup signs
            off beneath it. */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: "Inter, sans-serif",
              fontSize: 22,
              lineHeight: 1,
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                width={44}
                height={44}
                alt=""
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 44,
                  objectFit: "cover",
                  border: "1px solid rgba(21, 21, 21, 0.08)",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: 44,
                  backgroundColor: OG_COLORS.neutralTint,
                  border: "1px solid rgba(21, 21, 21, 0.08)",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 600,
                  fontSize: 20,
                  color: OG_COLORS.body,
                }}
              >
                {template.author.name.trim().charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ color: OG_COLORS.muted, fontWeight: 400 }}>by</span>
            <span style={{ color: OG_COLORS.ink, fontWeight: 600 }}>{template.author.name}</span>
          </div>
          <PrismaLockup />
        </div>
      </div>

      {/* The screenshot in a browser frame, leaning in from the right. */}
      {screenshot ? (
        <div
          style={{
            position: "absolute",
            top: SHOT_TOP,
            left: SHOT_LEFT,
            width: SHOT_WIDTH,
            display: "flex",
            flexDirection: "column",
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: OG_COLORS.white,
            border: "1px solid rgba(21, 21, 21, 0.12)",
            boxShadow: "0 24px 60px rgba(21, 21, 21, 0.18), 0 2px 6px rgba(21, 21, 21, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 40,
              padding: "0 18px",
              backgroundColor: OG_COLORS.neutralTint,
              borderBottom: "1px solid rgba(21, 21, 21, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: OG_COLORS.red,
              }}
            />
            <div
              style={{
                display: "flex",
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: OG_COLORS.yellow,
              }}
            />
            <div
              style={{
                display: "flex",
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: OG_COLORS.cyan,
              }}
            />
          </div>
          <img
            src={screenshot}
            width={SHOT_WIDTH}
            height={Math.round((SHOT_WIDTH * 10) / 16)}
            alt=""
            style={{
              width: SHOT_WIDTH,
              height: Math.round((SHOT_WIDTH * 10) / 16),
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
