import parse from "html-react-parser";
import { prisma_highlighter } from "../../lib/shiki_prisma";
import {
  CodeBlock,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@prisma/eclipse";

type HowSectionData = {
  title: string;
  description: string;
  tabs: {
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

export async function HowSection({
  data,
  codeExamples,
}: {
  data: HowSectionData;
  codeExamples: Record<string, string>;
}) {
  return (
    <div className="my-12">
      <div className="px-4 md:px-8 py-12 flex flex-col gap-12">
        <h2 className="stretch-display text-foreground-neutral text-4xl font-bold text-center font-sans-display max-w-106 mx-auto">
          {data.title}
        </h2>
        <p className="max-w-211 mx-auto text-foreground-neutral-weak">
          {data.description}
        </p>
        <div className="max-w-249 mx-auto rounded-xl w-full overflow-hidden border border-stroke-neutral">
          <Tabs defaultValue={data.tabs.defaultValue} className="my-0">
            <TabsList>
              {data.tabs.head.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  className="py-3 text-foreground-neutral-weak data-[state=active]:text-foreground-ppg data-[state=active]:border-stroke-ppg data-[state=inactive]:font-normal!"
                  value={tab.value}
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {await Promise.all(
              data.tabs.body.map(async (body) => {
                return (
                  <TabsContent key={body.value} value={body.value}>
                    <div className="bg-[linear-gradient(0deg,var(--color-background-success)_0%,var(--color-background-default)_100%)] tabs-content p-4 border-t border-stroke-neutral [&>h4]:font-sans-display [&>h4]:text-foreground-neutral [&>h4]:text-xl [&>h4]:font-bold text-foreground-neutral-weak flex flex-col gap-6 pt-8">
                      {parse(body.content)}
                      <div className="py-6 px-7 bg-background-neutral-weaker border rounded-[8px] overflow-hidden border-stroke-neutral [&>figure]:my-0 [&>figure>div]:py-0 [&>figure>div]:bg-transparent">
                        {codeExamples[body.value] && (
                          <CodeBlock
                            keepBackground={true}
                            className="border-none [&_pre]:bg-transparent"
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: await prisma_highlighter.codeToHtml(
                                  codeExamples[body.value],
                                  {
                                    lang: "typescript",
                                    theme: "prisma-dark",
                                  },
                                ),
                              }}
                            />
                          </CodeBlock>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                );
              }),
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
