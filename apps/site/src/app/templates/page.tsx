import { createPageMetadata } from "@/lib/page-metadata";
import { Badge, Button, Card } from "@prisma/eclipse";
import { z } from "zod";

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

export const metadata = createPageMetadata({
  title: "Prisma Compute templates",
  description:
    "Browse open-source TypeScript starters and deploy one with Prisma Postgres and Prisma Compute.",
  path: "/templates",
});

async function getTemplates() {
  try {
    const response = await fetch(TEMPLATE_MANIFEST_URL, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];

    const result = templateManifestSchema.safeParse(await response.json());
    return result.success ? result.data.templates : [];
  } catch {
    return [];
  }
}

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <main className="relative -mt-24 flex-1 overflow-hidden bg-background-default text-foreground-neutral">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_50%_0%,var(--color-background-ppg-strong),transparent_65%)] opacity-50"
        aria-hidden
      />

      <section className="relative px-4 pb-16 pt-48 md:pb-20 md:pt-56">
        <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-6 text-center">
          <Badge
            color="ppg"
            size="lg"
            label={
              <span className="flex items-center gap-2">
                <i className="fa-regular fa-sparkles text-xs" aria-hidden />
                PRISMA COMPUTE TEMPLATES
              </span>
            }
          />
          <h1 className="m-0 max-w-[760px] text-pretty font-sans-display text-4xl font-bold stretch-display sm:text-5xl md:text-6xl">
            Start with working code. Deploy in minutes.
          </h1>
          <p className="m-0 max-w-[660px] text-pretty text-lg leading-8 text-foreground-neutral-weak md:text-xl">
            Review the source, choose a framework, then let Prisma set up the GitHub repository,
            Postgres database, and first Compute deployment.
          </p>
          <ul className="m-0 grid w-full max-w-[760px] list-none grid-cols-2 gap-3 p-0 text-left md:grid-cols-4">
            {[
              ["fa-brands fa-github", "GitHub repository"],
              ["fa-regular fa-cube", "Prisma project"],
              ["fa-regular fa-database", "Postgres database"],
              ["fa-regular fa-rocket", "Compute deployment"],
            ].map(([icon, label]) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-square border border-stroke-neutral bg-background-default/70 px-3 py-2 text-xs font-medium text-foreground-neutral-weak shadow-box-low backdrop-blur"
              >
                <i className={`${icon} text-foreground-ppg`} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative px-4 pb-20 md:pb-28">
        <div className="mx-auto w-full max-w-[1184px]">
          <div className="mb-8 flex flex-col gap-2">
            <h2 className="m-0 font-sans-display text-3xl font-bold stretch-display">
              Choose your starting point
            </h2>
            <p className="m-0 text-foreground-neutral-weak">
              Every starter is open source. Inspect the code, then open the guided setup when it
              fits your project.
            </p>
          </div>

          {templates.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => {
                const deployUrl = new URL(`/templates/${template.id}`, "https://console.prisma.io");
                deployUrl.searchParams.set("utm_source", "website");
                deployUrl.searchParams.set("utm_medium", "templates");

                return (
                  <Card
                    key={template.id}
                    className="group min-h-[340px] justify-between gap-8 overflow-hidden border-stroke-ppg/30 bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_180%)] p-6"
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <span className="flex size-element-2xl items-center justify-center rounded-square border border-stroke-ppg/40 bg-background-default text-foreground-ppg shadow-box-low">
                          <i className="fa-regular fa-code text-base" aria-hidden />
                        </span>
                        <Badge color="neutral" label="COMPUTE READY" />
                      </div>

                      <div className="flex flex-col gap-3">
                        <h3 className="m-0 font-sans-display text-2xl font-bold stretch-display">
                          {template.name}
                        </h3>
                        <p className="m-0 text-sm leading-6 text-foreground-neutral-weak">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                      <Button asChild variant="ppg" size="xl" className="flex-1">
                        <a
                          href={deployUrl.toString()}
                          aria-label={`Use the ${template.name} template`}
                        >
                          Use template
                          <i className="fa-regular fa-arrow-right" aria-hidden />
                        </a>
                      </Button>
                      <Button asChild variant="default" size="xl">
                        <a
                          href={`https://github.com/prisma/prisma-examples/tree/latest/${template.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View the ${template.name} source`}
                        >
                          View source
                          <i className="fa-regular fa-arrow-up-right" aria-hidden />
                        </a>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="items-center gap-4 border-dashed px-6 py-12 text-center">
              <span className="flex size-element-3xl items-center justify-center rounded-square bg-background-neutral text-foreground-neutral-weak">
                <i className="fa-regular fa-grid-2" aria-hidden />
              </span>
              <h3 className="m-0 font-sans-display text-xl font-bold">Templates are unavailable</h3>
              <p className="m-0 max-w-[480px] text-sm text-foreground-neutral-weak">
                We could not load the template directory. Please try again in a few minutes.
              </p>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
