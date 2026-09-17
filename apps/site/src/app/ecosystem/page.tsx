import { createPageMetadata } from "@/lib/page-metadata";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PrismButton } from "@/components/brand/prism-button";
import ecosystem from "@/data/ecosystem.json";

const PAGE_TITLE = "Prisma ORM Ecosystem";
const PAGE_DESCRIPTION =
  "Explore the variety of tools (from generators, to middleware, to CLIs) created by the Prisma community.";

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/ecosystem",
  ogKicker: "Ecosystem",
});

type EcosystemPackage = {
  name: string;
  description: string;
  npmUrl: string;
  packageName: string;
  githubRepo: string;
  type: string;
};

const CATEGORIES = [
  { type: "generator", label: "Generators" },
  { type: "middleware", label: "Middleware" },
  { type: "other", label: "Other" },
] as const;

const packages = ecosystem.list as EcosystemPackage[];

function PackageCard({ pkg }: { pkg: EcosystemPackage }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)]">
      <h3 className="break-words text-lg leading-snug">{pkg.name}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
      <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-2">
        <a
          href={pkg.npmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
        >
          View on npm
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden
          />
        </a>
        <a
          href={`https://github.com/${pkg.githubRepo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
        >
          GitHub
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden
          />
        </a>
      </div>
    </div>
  );
}

export default function EcosystemPage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[16rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(52% 60% at 50% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 16%, transparent), transparent 70%)",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-cyan-400" className="justify-center">
                Ecosystem
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Prisma ecosystem
              </h1>
              <p className="mt-6 max-w-[48ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Explore the wide variety of tools created by the Prisma community.
              </p>
              <div className="mt-8">
                <PrismButton href="https://pris.ly/submit-your-package">
                  Submit your package
                </PrismButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          <h2 className="mx-auto max-w-[28ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Dedicated ORM support options
          </h2>
          <p className="mx-auto mt-4 max-w-[56ch] text-center text-[0.9375rem] leading-relaxed text-muted-foreground">
            Focus on core competencies of your team, rather than building and managing complex
            infrastructure components.
          </p>

          <div className="mt-14 flex flex-col gap-14">
            {CATEGORIES.map((category) => (
              <div key={category.type}>
                <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15]">
                  {category.label}
                </h3>
                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {packages
                    .filter((pkg) => pkg.type === category.type)
                    .map((pkg) => (
                      <PackageCard key={pkg.name} pkg={pkg} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
