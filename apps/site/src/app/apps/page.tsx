import { z } from "zod";
import { ArrowRight } from "@/components/icons/forma";
import { PrismButtonOutline } from "@/components/brand/prism-button";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { createPageMetadata } from "@/lib/page-metadata";

const TEMPLATE_MANIFEST_URL =
  "https://raw.githubusercontent.com/prisma/prisma-examples/latest/compute/templates.json";

const templateManifestSchema = z.object({
  version: z.literal(1),
  templates: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      name: z.string().trim().min(1),
      description: z.string().trim().min(1),
      path: z.string().regex(/^compute\/[a-z0-9]+(?:[/-][a-z0-9]+)*$/),
    }),
  ),
});

type Template = z.infer<typeof templateManifestSchema>["templates"][number];

export const metadata = createPageMetadata({
  title: "Prisma Compute apps",
  description:
    "Browse open-source TypeScript starters and deploy one with Prisma Postgres and Prisma Compute.",
  path: "/apps",
  ogKicker: "Prisma Compute",
  ogAccent: "red",
});

async function getTemplates() {
  try {
    const response = await fetch(TEMPLATE_MANIFEST_URL, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return [];

    const result = templateManifestSchema.safeParse(await response.json());
    return result.success ? result.data.templates : [];
  } catch {
    return [];
  }
}

function TemplateCard({ template }: { template: Template }) {
  const deployUrl = new URL(`/apps/${template.id}`, "https://console.prisma.io");
  deployUrl.searchParams.set("utm_source", "website");
  deployUrl.searchParams.set("utm_medium", "templates");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] bg-card p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)]">
      <h3 className="break-words text-lg leading-snug">{template.name}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{template.description}</p>
      <div className="mt-auto flex flex-col gap-4 pt-3">
        <PrismButtonOutline
          href={deployUrl.toString()}
          className="w-full"
          ctaLocation="templates-card"
        >
          Use this app
        </PrismButtonOutline>
        <a
          href={`https://github.com/prisma/prisma-examples/tree/latest/${template.path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
          aria-label={`View the ${template.name} source on GitHub`}
        >
          View source
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden
          />
        </a>
      </div>
    </div>
  );
}

export default async function AppsPage() {
  const templates = await getTemplates();

  return (
    <>
      <section className="bg-card px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-foreground/[0.06] bg-card">
          {/* compute-red wash — these apps deploy to Prisma Compute, so the
              hero carries its accent (same treatment as /ecosystem's cyan) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[16rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
              style={{
                background: "var(--paper)",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-transparent" />
          </div>
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-red-500" className="justify-center">
                Apps
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Start from an app
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Open-source TypeScript starters. Review the code, then deploy with Prisma Postgres
                and Prisma Compute.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card px-4 py-16 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          {templates.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="mx-auto flex max-w-[36rem] flex-col items-center gap-3 rounded-2xl border border-dashed border-foreground/[0.12] bg-card px-6 py-14 text-center">
              <h2 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15]">
                Apps are unavailable
              </h2>
              <p className="max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
                We could not load the app directory. Please try again in a few minutes.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
