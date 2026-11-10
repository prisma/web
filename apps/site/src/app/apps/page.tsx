import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { CtaBurst } from "@/components/sections/cta-burst";
import { createPageMetadata } from "@/lib/page-metadata";
import { TemplateGallery } from "./_components/template-gallery";
import { loadTemplates } from "./_lib/manifest";

export const metadata = createPageMetadata({
  title: "Prisma Compute apps",
  description:
    "Browse open-source TypeScript templates by framework, preview what each one looks like, and deploy it with Prisma Postgres and Prisma Compute.",
  path: "/apps",
  ogKicker: "Prisma Compute",
  ogAccent: "red",
});

export default async function AppsPage() {
  const templates = await loadTemplates();

  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          {/* compute-red wash — these apps deploy to Prisma Compute, so the
              hero carries its accent (same treatment as /ecosystem's cyan) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[16rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(52% 60% at 50% 100%, color-mix(in srgb, var(--color-prism-red-400) 14%, transparent), transparent 70%)",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />
          {/* Compact on purpose: the gallery is the page, so the hero states
              the premise in two lines and gets out of the way. */}
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-10 pt-24 text-center md:pb-12 md:pt-28">
              <RoleKicker color="bg-prism-red-500" className="justify-center">
                Apps
              </RoleKicker>
              <h1 className="isolate mt-3 max-w-[20ch] text-balance text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.08]">
                Start from an app
              </h1>
              <p className="mt-4 max-w-[62ch] text-pretty leading-relaxed text-muted-foreground md:text-lg">
                Open-source templates on the Prisma Stack. Each one deploys to Prisma Compute in one
                click, with a Prisma Postgres database of its own. Preview one, check its stack,
                make it yours.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Built a template on the Prisma Stack?{" "}
                <a
                  href="#apps-contribute"
                  className="spectrum-underline font-semibold text-foreground"
                >
                  Add it here
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {templates.length > 0 ? (
        <TemplateGallery templates={templates} />
      ) : (
        <section className="bg-white px-4 py-16 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto flex max-w-[36rem] flex-col items-center gap-3 rounded-2xl border border-dashed border-black/[0.12] bg-white px-6 py-14 text-center">
            <h2 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15]">
              Apps are unavailable
            </h2>
            <p className="max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
              We could not load the app directory. Please try again in a few minutes.
            </p>
          </div>
        </section>
      )}

      <CtaBurst
        headline="Bring your own app"
        headlineMaxWidth="max-w-[18ch]"
        body="Not starting from a template? Prisma Compute runs Node.js and Bun apps straight from a GitHub repository, with the same database and deploy flow."
        checks={[
          { label: "Prisma Postgres provisioned on first deploy", color: "text-prism-yellow-400" },
          { label: "Every push to the connected branch deploys", color: "text-prism-red-500" },
          { label: "A preview with its own database per branch", color: "text-prism-cyan-500" },
        ]}
        primaryCta={{ label: "Read the Compute docs", href: "/docs/compute" }}
        secondaryCta={{ label: "How Prisma Compute works", href: "/compute" }}
      />
    </>
  );
}
