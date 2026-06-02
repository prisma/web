import { createPageMetadata } from "@/lib/page-metadata";
import { createCollectionPageStructuredData } from "@/lib/structured-data";
import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/site-metadata";
import { Button } from "@prisma/eclipse";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import Image from "next/image";
import { CardSection } from "@/components/homepage/card-section/card-section";
import LogoParade from "@/components/logo-parade";
import review from "../../data/homepage.json";
import Testimonials from "../../components/homepage/testimonials";
// Antigravity is a purely decorative particle animation — skip SSR to keep
// the 300 inline <g> elements out of the initial HTML payload (~36 KB).
// The actual next/dynamic({ ssr: false }) call lives in the client wrapper
// because ssr:false is only valid inside Client Components in the App Router.
import Antigravity from "../../components/homepage/antigravity-client";

const twoCol = [
  {
    content: (
      <>
        <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider block mb-4">
          Prisma ORM
        </span>
        <h2 className="text-foreground-neutral text-left stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Type-safe queries, generated from your schema.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Prisma ORM gives TypeScript developers a schema-first workflow with a generated client,
          autocomplete, and compile-time guarantees.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    color: "ppg" as const,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "logoGrid" as const,
  },
  {
    content: (
      <>
        <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider block mb-4">
          Prisma Postgres
        </span>
        <h2 className="text-foreground-neutral text-left stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Managed Postgres for modern deployments.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Prisma Postgres gives you standard PostgreSQL with built-in pooling and support for modern
          deployment environments. Use it on its own, or pair it with Prisma ORM and Prisma Compute
          for a more integrated experience.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    other: (
      <div className=" box-visible border border-stroke rounded-lg flex h-full min-h-[320px] flex-col justify-between gap-6 bg-cover bg-center bg-no-repeat p-6 md:p-8">
        <ThemeFillIllustration
          lightSrc="/illustrations/homepage/managed-postgres_light.svg"
          darkSrc="/illustrations/homepage/managed-postgres.svg"
          className="inset-0"
          imageClassName="object-fill object-bottom-right"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    ),
    useDefaultLogos: false,
    visualPosition: "left" as const,
    visualType: "other" as const,
  },
  {
    content: (
      <>
        <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider block mb-4">
          Prisma Compute
        </span>
        <h2 className="text-foreground-neutral text-left stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Run TypeScript the way it actually works.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Prisma Compute is built for APIs, background jobs, AI agents, and other long-lived
          workloads. No cold starts, no timeouts, and no extra infrastructure to stitch together.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    other: (
      <div className="box box-visible flex h-full min-h-[320px] flex-col justify-between gap-6 bg-cover bg-center bg-no-repeat p-6 md:p-8">
        <ThemeFillIllustration
          lightSrc="/illustrations/homepage/compute-illustration-cropped-light.svg"
          darkSrc="/illustrations/homepage/compute-illustration-cropped.svg"
          className="pointer-events-none absolute inset-0"
          imageClassName="object-fill object-bottom-right"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-stroke-ppg/40 bg-background-ppg/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground-ppg">
            <i className="fa-regular fa-microchip" aria-hidden="true" />
            Long-lived compute
          </div>
          <ul className="mx-0 mt-4 space-y-3 pl-5 text-sm text-foreground-neutral-weak list-disc">
            <li>No cold starts</li>
            <li>No execution timeouts</li>
            <li>Great for APIs, jobs, and AI agents</li>
            <li>Co-locates with Prisma Postgres by default</li>
          </ul>
        </div>
        <div className="relative z-10">
          <Button asChild variant="ppg" size="lg">
            <a href="/compute">
              Explore Prisma Compute
              <i className="fa-regular fa-arrow-right ml-2" />
            </a>
          </Button>
        </div>
      </div>
    ),
    useDefaultLogos: false,
    visualPosition: "right" as const,
    visualType: "other" as const,
  },
];

function StoreDatabaseIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="6" rx="6.5" ry="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 6v5.5C5.5 12.9 8.41 14 12 14s6.5-1.1 6.5-2.5V6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 11.5V17c0 1.4 2.91 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="12" cy="11.5" rx="6.5" ry="2.5" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="12" cy="17" rx="6.5" ry="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ThemeFillIllustration({
  lightSrc,
  darkSrc,
  className,
  imageClassName,
  sizes = "100vw",
}: {
  lightSrc: string;
  darkSrc: string;
  className: string;
  imageClassName: string;
  sizes?: string;
}) {
  return (
    <div aria-hidden="true" className={className}>
      <Image
        src={lightSrc}
        alt=""
        fill
        sizes={sizes}
        className={`block dark:hidden ${imageClassName}`}
      />
      <Image
        src={darkSrc}
        alt=""
        fill
        sizes={sizes}
        className={`hidden dark:block ${imageClassName}`}
      />
    </div>
  );
}

export const metadata = createPageMetadata({
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
  path: "/",
  ogImage: "/og/og-index.png",
});

const homeStructuredData = createCollectionPageStructuredData({
  path: "/",
  name: "A Database Platform for TypeScript Developers",
  description: SITE_HOME_DESCRIPTION,
  items: [
    {
      name: "Prisma ORM",
      url: "/orm",
      description:
        "A type-safe ORM for TypeScript and Node.js with a schema-first workflow and generated client.",
    },
    {
      name: "Prisma Postgres",
      url: "/postgres",
      description: "Managed PostgreSQL with built-in pooling for modern deployment environments.",
    },
    {
      name: "Prisma Compute",
      url: "/compute",
      description:
        "Production compute for APIs, background jobs, and AI agents without cold starts or timeouts.",
    },
  ],
});

const sectionSpacing = "py-16 md:py-20";
const insetSectionSpacing = `px-4 ${sectionSpacing}`;

export default function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <JsonLd id="home-structured-data" data={homeStructuredData} />
      <section className="hero h-full relative -mt-24 flex items-end justify-center px-4 pt-40 pb-16 md:pb-20">
        <div className="w-screen h-full absolute inset-0">
          <Antigravity
            count={300}
            magnetRadius={16}
            ringRadius={15}
            waveSpeed={2.6}
            waveAmplitude={2.6}
            particleSize={0.9}
            lerpSpeed={0.02}
            color="#14b8a6"
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={2.6}
            pulseSpeed={4.9}
            particleShape="capsule"
            fieldStrength={15.3}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center text-center">
            <h1 className="mb-0 text-center mt-0 type-title-6xl text-foreground-neutral max-w-4xl mx-auto">
              A Database Platform for
              <br />
              TypeScript Developers
            </h1>
          </div>
          <p className="text-center text-foreground-neutral-weak max-w-4xl mx-auto text-xl">
            Prisma gives TypeScript and Node.js teams a type-safe ORM, managed Postgres, and
            production-ready compute. Prisma ORM, Prisma Postgres, and Prisma Compute take you from
            schema to production.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button asChild variant="ppg" size="3xl" className="font-sans-display! font-[650]">
              <a href="/orm">
                <span>Explore Prisma ORM</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </a>
            </Button>
            <Button asChild variant="default-strong" size="3xl">
              <a href="/postgres">
                <span>Explore Prisma Postgres</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </a>
            </Button>
            <Button asChild variant="default-strong" size="3xl">
              <a href="/compute">
                <span>Explore Prisma Compute</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className={insetSectionSpacing}>
        <LogoParade />
      </section>

      {/* One Platform for the Full TypeScript Path */}
      <section className={insetSectionSpacing}>
        <div className="mx-auto max-w-[1200px]">
          <h2 className="m-0 text-center text-4xl md:text-[36px] font-black text-foreground-neutral font-sans-display stretch-display tracking-[-0.015em]">
            One platform for the full TypeScript path.
          </h2>

          <div className="mx-auto mt-10 grid max-w-[1200px] gap-4 lg:grid-cols-3">
            <div className="relative h-[300px] overflow-hidden rounded-[12px] border border-stroke bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="relative z-10 flex h-full flex-col p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="m-0 font-sans-display text-base font-extrabold text-foreground-neutral">
                      Schema to client
                    </h3>
                    <p className="m-0 text-sm leading-5 text-foreground-neutral-weak">
                      Define once, generate the primitives
                      <br />
                      your app uses every day.
                    </p>
                  </div>
                  <div className="inline-flex h-6 items-center gap-2 rounded-[3px] bg-background-ppg-strong px-2 py-1 text-xs font-medium uppercase text-foreground-ppg">
                    <i className="fa-regular fa-code text-[11px]" aria-hidden="true" />
                    <span className="font-mono tracking-wide">MODEL</span>
                  </div>
                </div>
              </div>
              <ThemeFillIllustration
                lightSrc="/illustrations/homepage/model-illustration-light.svg"
                darkSrc="/illustrations/homepage/model-illustration.svg"
                className="pointer-events-none absolute inset-0"
                imageClassName="object-fill"
                sizes="(min-width: 1024px) 400px, 100vw"
              />
            </div>

            <div className="relative h-[300px] overflow-hidden rounded-[12px] border border-stroke bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="relative z-10 flex h-full flex-col p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="m-0 font-sans-display text-base font-extrabold text-foreground-neutral">
                      Postgres for modern deploys
                    </h3>
                    <p className="m-0 text-sm leading-5 text-foreground-neutral-weak">
                      Standard PostgreSQL, pooling included,
                      <br />
                      ready for production.
                    </p>
                  </div>
                  <div className="inline-flex h-6 items-center gap-2 rounded-[3px] bg-background-ppg-strong px-2 py-1 text-xs font-medium uppercase text-foreground-ppg">
                    <StoreDatabaseIcon className="size-[11px]" />
                    <span className="font-mono tracking-wide">STORE</span>
                  </div>
                </div>
              </div>

              <ThemeFillIllustration
                lightSrc="/illustrations/homepage/store-illustration-light.svg"
                darkSrc="/illustrations/homepage/store-illustration.svg"
                className="pointer-events-none absolute bottom-3 left-0 right-0 mx-auto h-[180px] w-[80%]"
                imageClassName="object-contain"
                sizes="(min-width: 1024px) 320px, 80vw"
              />
            </div>

            <div className="relative h-[300px] overflow-hidden rounded-[12px] border border-stroke bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="relative z-10 flex h-full flex-col p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="m-0 font-sans-display text-base font-extrabold text-foreground-neutral">
                      Compute for real workloads
                    </h3>
                    <p className="m-0 text-sm leading-5 text-foreground-neutral-weak">
                      APIs, jobs, and agents without the usual
                      <br />
                      runtime constraints.
                    </p>
                  </div>
                  <div className="inline-flex h-6 items-center gap-2 rounded-[3px] bg-background-ppg-strong px-2 py-1 text-xs font-medium uppercase text-foreground-ppg">
                    <i className="fa-regular fa-microchip text-[11px]" aria-hidden="true" />
                    <span className="font-mono tracking-wide">RUN</span>
                  </div>
                </div>
              </div>
              <ThemeFillIllustration
                lightSrc="/illustrations/homepage/run-illustration-light.svg"
                darkSrc="/illustrations/homepage/run-illustration.svg"
                className="pointer-events-none absolute inset-0"
                imageClassName="object-cover"
                sizes="(min-width: 1024px) 400px, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={insetSectionSpacing}>
        <div className="mx-auto flex max-w-[860px] flex-col gap-4 text-center">
          <h2 className="m-0 text-3xl font-black! font-sans-display text-foreground-neutral stretch-display">
            A modern platform for TypeScript applications
          </h2>
          <p className="mx-auto max-w-[760px] text-base leading-7 text-foreground-neutral-weak md:text-lg">
            Start with{" "}
            <a className="text-foreground-neutral underline underline-offset-2" href="/orm">
              Prisma ORM
            </a>{" "}
            for type-safe database access, add{" "}
            <a className="text-foreground-neutral underline underline-offset-2" href="/postgres">
              Prisma Postgres
            </a>{" "}
            for managed PostgreSQL, and run APIs, background jobs, and AI agents on{" "}
            <a className="text-foreground-neutral underline underline-offset-2" href="/compute">
              Prisma Compute
            </a>
            .
          </p>
        </div>
      </section>

      {/* Card Sections */}
      <section className={`w-screen ${sectionSpacing}`}>
        <CardSection cardSection={twoCol} />
      </section>

      {/* Pricing CTA Section */}
      <section
        className={`bg-background-default px-6 ${sectionSpacing} shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] bg-[linear-gradient(180deg,var(--color-background-default)_-177.75%,var(--color-background-ppg)_100%)] md:px-8`}
      >
        <div className="web-cta mx-auto flex w-fit flex-col items-center gap-3 md:flex-row md:gap-12 lg:p-4">
          <h3 className="text-2xl text-center font-sans-display font-bold text-foreground-neutral md:text-left">
            Run TypeScript
            <br />
            the way it actually works.
          </h3>
          <div className="content flex flex-col items-center gap-3 md:items-start lg:flex-row lg:items-center lg:gap-12">
            <p className="max-w-94 w-full text-center text-md text-foreground-neutral-weak md:text-left">
              Prisma Compute is built for APIs, background jobs, AI agents, and other long-lived
              workloads. No cold starts, no timeouts, and no extra infrastructure to stitch
              together.
            </p>
            <Button asChild variant="ppg" size="2xl">
              <a href="/docs">
                Read the docs
                <i className="fa-regular fa-arrow-right" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {review?.testimonials?.length > 0 && (
        <section className={sectionSpacing}>
          <div className="px-4">
            <div className="max-w-[1240px] mx-auto">
              <p
                className="[&>b]:text-background-ppg-reverse-strong font-sans-display stretch-display text-center text-base mb-12"
                dangerouslySetInnerHTML={{ __html: review.title }}
              />
              <Testimonials
                noShadow
                list={review.testimonials}
                mask="linear-gradient(to right, transparent, black 12%, black 88%, transparent)"
              />
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA Section */}
      <section
        className={`bg-radial from-background-ppg/50 from-0% to-background-default to-70% px-4 ${sectionSpacing}`}
      >
        <div className="mx-auto rounded-2xl bg-[url('/illustrations/homepage/footer_grid.svg')] bg-cover bg-center px-4 py-14 md:py-16">
          <div className="p-4 md:p-8">
            <div className="mx-auto flex max-w-[580px] flex-col items-center gap-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                  Start with Prisma.
                  <br /> Expand when you need more.
                </h2>
                <p className="text-foreground-neutral-weak">
                  Begin with Prisma ORM, add Prisma Postgres when you need managed infrastructure,
                  and deploy on Prisma Compute when you're ready to run in production.
                </p>
              </div>
              <div className="flex flex-col gap-6 md:flex-row">
                <Button asChild variant="ppg" size="2xl">
                  <a href="/orm">
                    Explore Prisma ORM
                    <i className="fa-regular fa-arrow-right ml-2" />
                  </a>
                </Button>
                <Button asChild variant="default-strong" size="2xl">
                  <a href="/postgres">
                    Explore Prisma Postgres
                    <i className="fa-regular fa-arrow-right" />
                  </a>
                </Button>
                <Button asChild variant="default-strong" size="2xl">
                  <a href="/compute">
                    Explore Prisma Compute
                    <i className="fa-regular fa-arrow-right" />
                  </a>
                </Button>
              </div>
              <p className="mb-0! -mt-4 text-xs text-foreground-neutral-weaker">
                Free to get started, no credit card needed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
