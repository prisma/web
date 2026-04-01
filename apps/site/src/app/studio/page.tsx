import type { Metadata } from "next";
import { Button } from "@prisma/eclipse";
import Image from "next/image";
import { CopyCode } from "@/components/homepage/copy-btn";
import { Youtube } from "@prisma-docs/ui/components/youtube";

const CONSOLE_URL =
  "https://console.prisma.io/login?utm_source=website&utm_medium=studio&utm_campaign=cta";
const STUDIO_DOCS_URL = "https://www.prisma.io/docs/studio";
const TRY_STUDIO_COMMAND = `npx try-prisma@latest --template orm/starter \\
&& cd hello-prisma \\
&& npx prisma studio`;

const featureCards = [
  {
    icon: "fa-regular fa-code-branch",
    title: "Instant Access to Your Database",
    description:
      "Connect to your Prisma Postgres database or bring your own in seconds. Prisma Studio now lives right in the Prisma Data Platform.",
  },
  {
    icon: "fa-regular fa-wand-magic-sparkles",
    title: "Zero Setup Required",
    description:
      "Skip installation and dive straight into your data. Your entire team can access and collaborate instantly.",
  },
  {
    icon: "fa-regular fa-people-line",
    title: "Real-Time Collaboration",
    description:
      "Work together on the same database in real time. No local setup, no configuration, just seamless teamwork.",
  },
] as const;

const featureRows = [
  {
    eyebrow: "Runs anywhere",
    title: "Local or collaborative",
    description:
      "Access your database anywhere. Work locally for rapid development or use Console for team collaboration. Switch seamlessly between solo and team workflows.",
    imageSrc: "/illustrations/studio/laptop.svg",
    imageAlt:
      "Prisma Studio interface showing local and collaborative workflows",
    imageWidth: 522,
    imageHeight: 295,
  },
  {
    eyebrow: "Data exploration",
    title: "Understand your data",
    description:
      "Browse your database visually with powerful filters and search. Spot patterns instantly and get insights for debugging or schema changes, no SQL needed.",
    imageSrc: "/illustrations/studio/explore.svg",
    imageAlt:
      "Prisma Studio data exploration interface with highlighted filters",
    imageWidth: 546,
    imageHeight: 275,
  },
  {
    eyebrow: "Advanced filtering",
    title: "Power through complexity",
    description:
      "Visualize complex data relationships with clickable model navigation. See your database architecture unfold naturally, helping teams understand how everything connects.",
    imageSrc: "/illustrations/studio/filter.svg",
    imageAlt: "Prisma Studio advanced filtering interface",
    imageWidth: 571,
    imageHeight: 235,
  },
  {
    eyebrow: "Multiple tabs",
    title: "Switch contexts instantly",
    description:
      "Find exactly what you need with powerful, precise filtering. Combine filters and operators to quickly surface insights from complex data.",
    imageSrc: "/illustrations/studio/tabs.svg",
    imageAlt: "Prisma Studio with multiple tabs open",
    imageWidth: 561,
    imageHeight: 215,
  },
  {
    eyebrow: "Amazing data editing UX",
    title: "Embed in your own apps",
    description:
      "When using Prisma Postgres, you can integrate Studio directly in your own applications to provide a polished data editing experience to your users.",
    imageSrc: "/illustrations/studio/embed.svg",
    imageAlt: "Embedded Prisma Studio experience inside an app",
    imageWidth: 582,
    imageHeight: 224,
  },
] as const;

export const metadata: Metadata = {
  title: "Studio | Prisma",
  description:
    "Explore and understand your data with Prisma Studio. Browse, filter, edit, and collaborate on your database in Prisma Console or locally.",
  alternates: {
    canonical: "https://www.prisma.io/studio",
  },
  openGraph: {
    title: "Studio | Prisma",
    description:
      "Explore and understand your data with Prisma Studio. Browse, filter, edit, and collaborate on your database in Prisma Console or locally.",
    url: "https://www.prisma.io/studio",
    images: [
      {
        url: "/og/og-studio.png",
        width: 1200,
        height: 630,
        alt: "Prisma Studio Open Graph image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio | Prisma",
    description:
      "Explore and understand your data with Prisma Studio. Browse, filter, edit, and collaborate on your database in Prisma Console or locally.",
    images: ["/og/og-studio.png"],
  },
};

export default function StudioPage() {
  return (
    <main className="flex-1 w-full -mt-24 bg-background-default text-foreground-neutral">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-background-orm)_0%,var(--color-background-default)_72%)] px-4 pt-28 pb-12">
        <div className="pointer-events-none absolute inset-x-1/2 top-20 h-[780px] w-[1664px] -translate-x-1/2 rounded-full bg-[repeating-radial-gradient(circle_at_top,rgba(99,102,241,0.28)_0,rgba(99,102,241,0.28)_2px,transparent_2px,transparent_42px)] opacity-45 mask-[linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_78%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(70%_65%_at_50%_5%,rgba(79,70,229,0.3),transparent_70%)]" />

        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-12">
          <div className="flex max-w-[766px] flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <p className="m-0 flex items-center gap-2 text-base uppercase tracking-[1.6px] text-foreground-orm-strong font-sans-display [font-variation-settings:'wght'_800]">
                <i className="fa-regular fa-table text-sm" aria-hidden="true" />
                Prisma Studio
              </p>
              <h1 className="m-0 text-5xl leading-none text-foreground-neutral font-sans-display md:text-6xl [font-variation-settings:'wght'_900]">
                Explore and
                <br />
                understand your data
              </h1>
            </div>

            <p className="m-0 max-w-[650px] text-lg leading-8 text-foreground-neutral md:text-xl">
              The ultimate tool for exploring and editing data in your Prisma
              project. Work locally or team up inside the Prisma Console.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Button
                variant="ppg"
                size="2xl"
                href={CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Explore Studio in Prisma Console</span>
                <i className="fa-regular fa-arrow-up-right ml-2" />
              </Button>
              <Button
                variant="default-stronger"
                size="2xl"
                href={STUDIO_DOCS_URL}
              >
                <span>Try locally</span>
                <i className="fa-regular fa-arrow-down ml-2" />
              </Button>
            </div>
          </div>

          <Image
            src="/illustrations/studio/hero.svg"
            alt="Prisma Studio Hero"
            width={1200}
            height={630}
          />
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-stroke-neutral bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)] p-4 shadow-box-low"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-md bg-background-orm p-3">
                  <i
                    className={`${card.icon} text-lg text-foreground-orm`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h2 className="m-0 text-xl leading-7 text-foreground-neutral font-sans-display [font-variation-settings:'wght'_800]">
                    {card.title}
                  </h2>
                  <p className="m-0 mt-3 text-base leading-6 text-foreground-neutral-weak">
                    {card.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-16">
          {featureRows.map((feature, index) => (
            <FeatureRow
              key={feature.title}
              eyebrow={feature.eyebrow}
              title={feature.title}
              description={feature.description}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
              imageWidth={feature.imageWidth}
              imageHeight={feature.imageHeight}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </section>

      {/* See how Studio works Section */}
      <section className="px-4 py-12">
        <div className="mx-auto flex max-w-[683px] flex-col gap-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[420px]">
              <h2 className="m-0 text-4xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
                See how Studio works
              </h2>
              <p className="m-0 mt-4 text-base leading-6 text-foreground-neutral-weak">
                Access Prisma Studio on your local machine during development,
                or in the Platform Console to collaborate on data with your
                team.
              </p>
            </div>

            <Button
              variant="ppg"
              size="xl"
              href={CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Explore Studio in Console</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-box-low">
            <Youtube
              videoId="s3NS9KBRMcQ"
              width="100%"
              height="400"
              title="See how Prisma Studio works"
            />
          </div>
        </div>
      </section>

      {/* Try Studio Section */}
      <section
        className="
      bg-radial from-background-orm/50 from-0% to-background-default to-70% px-4 py-12"
      >
        <div className="mx-auto rounded-2xl bg-[url('/illustrations/homepage/footer_grid.svg')] bg-cover bg-center px-4 py-12">
          <div className="p-4 md:p-8">
            <div className="mx-auto flex max-w-[580px] flex-col items-center gap-8 text-center">
              <div>
                <h2 className="m-0 text-4xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
                  Try it out!
                </h2>
                <p className="m-0 mt-4 text-base leading-6 text-foreground-neutral-weak">
                  Take Studio for a spin with a local pre-seeded database and
                  example project.
                </p>
              </div>

              <div className="relative w-full rounded-md border border-stroke-neutral bg-background-default p-5 text-left shadow-box-low">
                <div className="absolute right-3 top-3">
                  <CopyCode
                    text={TRY_STUDIO_COMMAND}
                    buttonSize="lg"
                    buttonClassName="h-8 min-w-8 rounded-md px-2 text-foreground-neutral-weaker hover:bg-background-neutral-weak hover:text-foreground-neutral"
                  >
                    <i className="fa-regular fa-copy" aria-hidden="true" />
                    <span className="sr-only">Copy command</span>
                  </CopyCode>
                </div>
                <pre className="m-0 overflow-x-auto pr-16 text-sm leading-7 text-foreground-neutral-weak font-mono">
                  <code>{TRY_STUDIO_COMMAND}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureRow({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  reverse,
}: {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="max-w-[546px]">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h2 className="m-0 mt-2 text-4xl leading-10 text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
          {title}
        </h2>
        <p className="m-0 mt-4 text-base leading-8 text-foreground-neutral-weak">
          {description}
        </p>
      </div>

      <StudioFeatureImage
        src={imageSrc}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
      />
    </div>
  );
}

function StudioFeatureImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="flex w-full items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full max-w-full"
      />
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 text-base uppercase tracking-[1.6px] text-foreground-orm-strong font-sans-display [font-variation-settings:'wght'_800]">
      {children}
    </p>
  );
}
