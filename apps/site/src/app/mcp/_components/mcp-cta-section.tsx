import { Button } from "@prisma/eclipse";

export function McpCtaSection({ docsHref }: { docsHref: string }) {
  return (
    <section className="bg-radial from-background-ppg/50 from-0% to-background-default to-70% px-4 py-12">
      <div className="mx-auto max-w-360 rounded-2xl bg-[url('/illustrations/homepage/footer_grid.svg')] bg-cover bg-center px-4 py-12">
        <div className="flex min-h-77 items-center justify-center p-4 md:p-8">
          <div className="flex w-full max-w-[495px] flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <h3 className="stretch-display font-sans-display text-[30px] leading-10 font-black text-foreground-neutral">
                Start Building with AI
              </h3>
              <p className="max-w-[463px] text-base leading-6 text-foreground-neutral-weak">
                Join thousands of developers, and agents, already using Prisma MCP
                for faster, more intuitive database workflows.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full flex-col items-center justify-center gap-4 min-[720px]:flex-row min-[720px]:gap-6">
                <Button
                  href={docsHref}
                  variant={"ppg"}
                  size={"3xl"}
                  className="gap-3"
                >
                  Add MCP Server
                  <i
                    className="fa-regular fa-arrow-right shrink-0 text-[16px]"
                    aria-hidden
                  />
                </Button>
                <Button
                  href={docsHref}
                  variant={"default-stronger"}
                  size={"3xl"}
                  className="gap-3"
                >
                  Read Docs
                  <i
                    className="fa-regular fa-book-open shrink-0 text-[16px]"
                    aria-hidden
                  />
                </Button>
              </div>

              <p className="text-xs text-foreground-neutral-weaker">
                2-minute setup &bull; Works with all MCP tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
