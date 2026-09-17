import { Reveal } from "@/components/motion/reveal";

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
function Track({ hidden = false }: { hidden?: boolean }) {
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

export function LogoCloud() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-site">
        <Reveal>
          <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by leading companies
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="group relative mt-12 overflow-hidden motion-reduce:overflow-x-auto"
        >
          {/* Edge fades so wordmarks dissolve rather than clip at the margins */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

          <div className="flex w-max animate-logo-marquee items-center hover:[animation-play-state:paused] motion-reduce:animate-none">
            <Track />
            <Track hidden />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
