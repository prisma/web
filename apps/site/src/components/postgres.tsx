"use client";

import parse from "html-react-parser";
import {
  CodeBlock,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@prisma/eclipse";

type HowSectionData = {
  tabs?: {
    defaultValue: string;
    head: Array<{
      title: string;
      icon: string;
      value: string;
    }>;
    body: Array<{
      value: string;
      title: string;
      content: string;
      image: string;
    }>;
  };
};

export function PostgresTabs({ data }: { data: HowSectionData }) {
  const hasTabs = Boolean(data.tabs && data.tabs.body.length > 0);

  return (
    <div className="my-12">
      <div className="px-4 md:px-8 py-12">
        {hasTabs && (
          <div className="max-w-249 mx-auto rounded-xl w-full overflow-hidden border border-stroke-neutral">
            <Tabs defaultValue={data.tabs!.defaultValue} className="my-0">
              <TabsList>
                {data.tabs!.head.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    className="py-3 text-foreground-neutral-weaker data-[state=active]:text-foreground-ppg data-[state=active]:border-stroke-ppg data-[state=inactive]:font-normal! data-[state=active]:[&>i]:text-foreground-ppg-strong"
                    value={tab.value}
                  >
                    {tab.icon && <i className={`${tab.icon} mr-1`}></i>}
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {data.tabs!.body.map((body) => (
                <TabsContent key={body.value} value={body.value}>
                  <div className="relative bg-background-default tabs-content p-4 border-t border-stroke-neutral [&>h4]:font-sans-display [&>h4]:text-foreground-neutral [&>h4]:text-xl [&>h4]:font-bold text-foreground-neutral-weak flex flex-col gap-6 p-4">
                    <div className="bg-[linear-gradient(0deg,var(--color-background-success)_0%,var(--color-background-default)_100%)] opacity-20 absolute inset-0 z-0 pointer-events-none" />
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
                      <div className="relative z-1 flex flex-col gap-4 md:gap-6 md:max-w-120 w-full text-center md:text-left">
                        <h2 className="text-base md:text-xl text-foreground-neutral font-sans-display">
                          {body.title}
                        </h2>
                        <p className="text-foreground-neutral-weak text-base">
                          {parse(body.content)}
                        </p>
                      </div>
                      {body.image && (
                        <>
                          {/* Dark mode images - only visible in dark mode */}
                          <img
                            src={`${body.image}.svg`}
                            alt={body.title}
                            className="hidden lg:dark:block md:max-h-83"
                          />
                          <img
                            src={`${body.image}_tablet.svg`}
                            alt={body.title}
                            className="hidden sm:dark:block lg:dark:hidden md:max-h-83"
                          />
                          <img
                            src={`${body.image}_mobile.svg`}
                            alt={body.title}
                            className="hidden dark:block sm:dark:hidden md:max-h-83"
                          />

                          {/* Light mode images - only visible in light mode */}
                          <img
                            src={`${body.image}_light.svg`}
                            alt={body.title}
                            className="hidden lg:block dark:hidden md:max-h-83"
                          />
                          <img
                            src={`${body.image}_tablet_light.svg`}
                            alt={body.title}
                            className="hidden sm:block lg:hidden dark:hidden md:max-h-83"
                          />
                          <img
                            src={`${body.image}_mobile_light.svg`}
                            alt={body.title}
                            className="block sm:hidden dark:hidden md:max-h-83"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
