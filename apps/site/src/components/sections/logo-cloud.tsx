import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type CompanyLogo = {
  name: string;
  /** File in /public/logos/companies, in official brand colors. */
  src: string;
  /** Rendered height in px. Every file's viewBox is cropped to its ink
      (Accenture excepted: its box is extended below the wordmark so the
      wordmark, not the ">" symbol above it, sits on the row's centerline),
      so height alone controls optical size. Heights are chosen so each mark
      covers roughly the same ink area — equal visual mass, not equal height. */
  height: number;
};

// Companies verified as Prisma users: customer stories on /blog and the
// showcase (Cal.com, Gamma, Elsevier, Grover, Rapha, Formbricks), confirmed
// in Slack (Cursor, ClickHouse), well-known open-source Prisma codebases
// (Dub, Documenso, Papermark, Inbox Zero), and the customer wall of the
// previous prisma.io homepage (Reddit, Okta, Accenture, Lush, Kapa.ai — those
// assets are the old wall's own files, recolored from white to ink).
const companies: CompanyLogo[] = [
  { name: "Cursor", src: "/logos/companies/cursor.svg", height: 20 },
  { name: "Reddit", src: "/logos/companies/reddit.svg", height: 26 },
  { name: "Okta", src: "/logos/companies/okta.svg", height: 26 },
  { name: "Lush", src: "/logos/companies/lush.svg", height: 26 },
  { name: "ClickHouse", src: "/logos/companies/clickhouse.svg", height: 20 },
  { name: "Cal.com", src: "/logos/companies/cal.svg", height: 23 },
  { name: "Accenture", src: "/logos/companies/accenture.svg", height: 38 },
  { name: "Dub", src: "/logos/companies/dub.svg", height: 24 },
  { name: "Rapha", src: "/logos/companies/rapha.svg", height: 30 },
  { name: "Gamma", src: "/logos/companies/gamma.svg", height: 20 },
  { name: "Kapa.ai", src: "/logos/companies/kapa.svg", height: 26 },
  { name: "Documenso", src: "/logos/companies/documenso.svg", height: 18 },
  { name: "Elsevier", src: "/logos/companies/elsevier.svg", height: 26 },
  { name: "Grover", src: "/logos/companies/grover.svg", height: 26 },
  { name: "Formbricks", src: "/logos/companies/formbricks.svg", height: 19 },
  { name: "Papermark", src: "/logos/companies/papermark.svg", height: 23 },
  { name: "Inbox Zero", src: "/logos/companies/inboxzero.svg", height: 18 },
];

/* The row is rendered twice per track (and the track twice) so the strip is
   wider than any viewport and the -50% marquee loop is seamless. */
function CompanyTrack({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-x-14 pr-14 lg:gap-x-20 lg:pr-20"
      aria-hidden={hidden || undefined}
    >
      {[0, 1].map((copy) =>
        companies.map((company) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${copy}-${company.name}`}
            src={company.src}
            alt={hidden || copy === 1 ? "" : company.name}
            className="w-auto shrink-0"
            style={{ height: company.height }}
            loading="lazy"
            draggable={false}
          />
        )),
      )}
    </div>
  );
}

/**
 * A tiled logo, for pages that hand the marquee their own roster (/customers
 * runs it over all 44 community projects). The homepage's default track above
 * renders bare wordmarks instead; these sit on white tiles.
 */
export type Logo = {
  name: string;
  /** File in /public/logos. Omit to render a text wordmark fallback. */
  src?: string;
  /** Where the tile links out to. Omit to render an unlinked tile. */
  href?: string;
  /** Visual size correction so every mark reads at the same optical weight:
      "sm" reins in dense/wide marks, "lg" boosts small-drawn icons. */
  fit?: "sm" | "lg";
};

const FIT_CLASS = {
  sm: "max-h-6 w-auto max-w-10 object-contain",
  md: "max-h-8 w-auto max-w-12 object-contain",
  lg: "max-h-12 w-auto max-w-14 object-contain",
};

function LogoTile({ logo, wide = false }: { logo: Logo; wide?: boolean }) {
  const tile = cn(
    "spectrum-border flex h-24 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-white",
    wide ? "w-44 px-6" : "w-24 p-4",
  );
  const mark = logo.src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.src}
      alt={logo.name}
      className={wide ? "max-h-10 w-auto max-w-[8rem] object-contain" : FIT_CLASS[logo.fit ?? "md"]}
      loading="lazy"
      draggable={false}
    />
  ) : (
    <span className="select-none text-center text-[0.7rem] font-semibold leading-tight tracking-tight text-foreground">
      {logo.name}
    </span>
  );

  if (!logo.href) {
    return <div className={tile}>{mark}</div>;
  }

  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={logo.name}
      className={cn(
        tile,
        "transition-[transform,border-color] duration-500 ease-out hover:scale-[0.97] hover:border-transparent motion-reduce:hover:scale-100",
      )}
    >
      {mark}
    </a>
  );
}

function TileTrack({
  logos,
  wide,
  hidden = false,
}: {
  logos: Logo[];
  wide?: boolean;
  hidden?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-x-5 pr-5" aria-hidden={hidden || undefined}>
      {logos.map((logo) => (
        <LogoTile key={logo.name} logo={logo} wide={wide} />
      ))}
    </div>
  );
}

type LogoCloudProps = {
  /** A tiled roster in place of the homepage's company wordmarks. */
  logos?: Logo[];
  /** Defaults to the homepage's small uppercase kicker. */
  heading?: React.ReactNode;
  /**
   * Landscape tiles for wordmark logos. The square tile is sized for icon
   * marks; customer logos are nearly all wordmarks, and squeezing those into
   * a 48px box renders them unreadably small.
   */
  wide?: boolean;
  /**
   * Seconds for one full loop. The keyframe duration is per-loop, not
   * per-pixel, so a longer list covers more ground in the same time and drifts
   * proportionally faster. Set it to hold px/s steady across differently sized
   * sets.
   */
  durationSeconds?: number;
  className?: string;
};

// The marquee is shared: the homepage runs it over the company wordmarks, and
// /customers runs it over all 44 community projects under its own heading.
export function LogoCloud({
  logos,
  heading,
  wide,
  durationSeconds,
  className,
}: LogoCloudProps = {}) {
  return (
    <section className={cn("px-6 py-16 lg:px-8 lg:py-24", className)}>
      <div className="mx-auto max-w-site">
        <Reveal>
          {heading ?? (
            <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Trusted by leading companies
            </p>
          )}
        </Reveal>

        <Reveal
          delay={0.1}
          className="group relative mt-12 overflow-hidden motion-reduce:overflow-x-auto"
        >
          {/* Edge fades so wordmarks dissolve rather than clip at the margins */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

          <div
            className="flex w-max animate-logo-marquee items-center hover:[animation-play-state:paused] motion-reduce:animate-none"
            style={durationSeconds ? { animationDuration: `${durationSeconds}s` } : undefined}
          >
            {logos ? (
              <>
                <TileTrack logos={logos} wide={wide} />
                <TileTrack logos={logos} wide={wide} hidden />
              </>
            ) : (
              <>
                <CompanyTrack />
                <CompanyTrack hidden />
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
