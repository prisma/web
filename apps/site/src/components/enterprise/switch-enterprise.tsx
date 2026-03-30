"use client";
import React from "react";
import { cn } from "@/lib/cn";
import { Action, Button } from "@prisma/eclipse";

interface ContentBox {
  icon: string;
  title: string;
  description: string;
}

interface SwitchEnterpriseProps {
  content: ContentBox[][];
  tabs: { id: string; value: string }[];
}

const ContentCard = ({ box }: { box: ContentBox }) => (
  <div className="flex flex-col gap-4 relative z-2">
    <div className="flex gap-4 items-center">
      <Action color="orm" size="4xl">
        <i className={cn("text-foreground-orm-strong text-2xl", box.icon)} />
      </Action>
      <h3 className="text-foreground-neutral font-sans-display text-xl stretch-display mt-0 mb-1 font-bold line-clamp-2 hover:line-clamp-none">
        {box.title}
      </h3>
    </div>
    <p className="text-foreground-neutral dark:text-foreground-neutral-weak text-sm font-normal m-0">
      {box.description}
    </p>
  </div>
);

export const SwitchEnterprise = ({ content, tabs }: SwitchEnterpriseProps) => {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  return (
    <>
      <div className="gap-6 mx-auto justify-center items-center hidden md:flex">
        {tabs.map((tab, idx) => (
          <Button
            key={tab.id}
            size="4xl"
            variant={activeTab === idx ? "orm" : "default-stronger"}
            aria-pressed={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab.value}
          </Button>
        ))}
      </div>
      <div
        className={cn(
          "before:absolute before:content-[''] before:inset-0 before:opacity-20 before:z-1 before:rounded-square-high",
          "before:bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-orm)_100%)]",
          "relative rounded-square-high p-12 grid md:grid-cols-2 lg:grid-cols-3! gap-8",
        )}
      >
        <div className="hidden md:contents">
          {content[activeTab].map((box, idx) => (
            <ContentCard key={`${box.title}-${idx}`} box={box} />
          ))}
        </div>
        <div className="contents md:hidden">
          {tabs.map((tab, tabIdx) => (
            <React.Fragment key={tab.id}>
              {tabIdx > 0 && <div className="col-span-full" />}
              <h4 className="text-foreground-neutral font-sans-display text-3xl stretch-display mt-0 mb-10 font-bold z-2 relative mx-auto text-center col-span-full">
                {tab.value}
              </h4>
              {content[tabIdx].map((box, idx) => (
                <ContentCard key={`${box.title}-${idx}`} box={box} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};
