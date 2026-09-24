import parse from "html-react-parser";
import { prisma_highlighter } from "../../lib/shiki_prisma";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type HowSectionData = {
  title: string;
  description: string;
  tabs?: {
    id?: string;
    defaultValue: string;
    head: Array<{
      title: string;
      value: string;
    }>;
    body: Array<{
      value: string;
      content: string;
    }>;
  };
};

// Usage patterns with tabbed, shiki-highlighted code — the code sits on an
// ink card (the one sanctioned dark surface), matching the site's code blocks.
export async function HowSection({
  data,
  codeExamples,
}: {
  data: HowSectionData;
  codeExamples: Record<string, string>;
}) {
  const hasTabs = Boolean(data.tabs && data.tabs.body.length > 0);

  return (
    <section className="scroll-mt-20 bg-white px-4 py-20 sm:px-8" id={data.tabs?.id}>
      <div className="mx-auto max-w-site">
        <h2 className="mx-auto max-w-[26ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          {data.title}
        </h2>
        <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-4 text-center text-[0.9375rem] leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-prism-cyan-700 [&>ul]:mx-auto [&>ul]:flex [&>ul]:list-disc [&>ul]:flex-col [&>ul]:gap-2 [&>ul]:pl-5 [&>ul]:text-left">
          {parse(data.description)}
        </div>
        {hasTabs && (
          <div className="mx-auto mt-12 w-full max-w-5xl">
            <Tabs defaultValue={data.tabs!.defaultValue}>
              <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-[#eef4f3] p-1.5">
                {data.tabs!.head.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-xl px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-[0_1px_2px_rgba(21,21,21,0.06)]"
                  >
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {await Promise.all(
                data.tabs!.body.map(async (body) => (
                  <TabsContent key={body.value} value={body.value} className="mt-4">
                    <div className="flex flex-col gap-6 rounded-2xl border border-black/[0.06] bg-white p-6 text-[0.9375rem] leading-relaxed text-muted-foreground shadow-[0_1px_2px_rgba(21,21,21,0.04)] sm:p-8 [&_a]:font-semibold [&_a]:text-prism-cyan-700 [&>h4]:text-lg [&>h4]:leading-snug [&>h4]:text-foreground">
                      {parse(body.content)}
                      {codeExamples[body.value] && (
                        <div className="overflow-x-auto rounded-xl bg-[#151515] p-5 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: await (
                                await prisma_highlighter()
                              ).codeToHtml(codeExamples[body.value], {
                                lang: "typescript",
                                theme: "prisma-dark",
                              }),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )),
              )}
            </Tabs>
          </div>
        )}
      </div>
    </section>
  );
}
