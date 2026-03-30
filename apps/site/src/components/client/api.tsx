"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

import { apiItems } from "./api-data";
import {
  CodeBlock,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@prisma/eclipse";
import { prisma_highlighter as getHighlighter } from "@/lib/shiki_prisma";

const langOptions = [
  {
    value: "ts",
    label: "TypeScript",
  },
  {
    value: "js",
    label: "JavaScript",
  },
];

const CurvedArrow = (props: any) => (
  <svg
    width="83"
    height="58"
    viewBox="0 0 83 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.1931 57.3302C0.867673 28.5257 34.0246 -6.62876 80.5571 10.7968M80.5571 10.7968L69.7148 15.6517M80.5571 10.7968L73.128 1.06228"
      stroke="var(--color-foreground-orm-strong)"
      strokeWidth="2"
    />
  </svg>
);

const icons: any = {
  js: <i className="fa-brands fa-js w-4.75 h-4.75" />,
  ts: <i className="fa-brands fa-typescript w-4.75 h-4.75" />,
};

const renderItem = (item: any) => {
  return (
    <div className="flex font-barlow text-base font-bold leading-6 items-center">
      {icons[item.value]}&nbsp;&nbsp;
      <span>{item.label}</span>
    </div>
  );
};

const API = () => {
  const [funcSelected, setFuncSelected]: any = useState(
    apiItems[0].functions[0],
  );

  const [selectedAPIItem, setSelectedAPIItem] = useState(apiItems[0]);

  const [selectedLang, setSelectedLang] = useState(langOptions[0]);
  const [highlightedCode, setHighlightedCode] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (item: any) => {
    setSelectedLang(item);
  };

  const blockType =
    selectedLang.value === "js" ? "jsCodeBlocks" : "tsCodeBlocks";

  const codeBlockSelected = funcSelected[blockType];

  // Load highlighted code when funcSelected or selectedLang changes
  useEffect(() => {
    let isMounted = true;

    const loadHighlightedCode = async () => {
      setIsLoading(true);
      try {
        const highlighter = await getHighlighter();
        const codeBlocks: string[] = [];

        if ("prismaCodeBlock" in funcSelected) {
          const html = await highlighter.codeToHtml(
            funcSelected["prismaCodeBlock"],
            {
              lang: "prisma",
              theme: "prisma-dark",
            },
          );
          codeBlocks.push(html);
        }

        if (codeBlockSelected && !("prismaCodeBlock" in funcSelected)) {
          for (let index = 0; index < codeBlockSelected.length; index++) {
            const html = await highlighter.codeToHtml(
              codeBlockSelected[index],
              {
                lang: "typescript",
                theme: "prisma-dark",
              },
            );
            codeBlocks.push(html);
          }
        }

        if (isMounted) {
          setHighlightedCode(codeBlocks);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to highlight code:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHighlightedCode();

    return () => {
      isMounted = false;
    };
  }, [funcSelected, selectedLang, blockType, codeBlockSelected]);

  const contentBlocks = highlightedCode.map((html, index) => (
    <CodeBlock
      key={index}
      keepBackground={true}
      className={cn(
        "[&_pre]:bg-transparent [&_pre]:overflow-hidden [&_pre]:relative [&_pre]:rounded-lg md:[&_pre]:w-full my-0! [&_.diff-add]:text-background-success-reverse-strong [&>.absolute]:text-foreground-neutral-reverse-weak [&>.absolute]:hover:text-foreground-neutral px-4",
      )}
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-400">Loading...</div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </CodeBlock>
  ));

  const CodeUIItems = ({ item, blockType }: any) => {
    const labelToDisplay = item.functions.filter(
      (i: any) => i[blockType] && i[blockType].length > 0,
    );
    return (
      <ul className="flex flex-wrap my-5 mx-0 gap-2 list-none p-0">
        {labelToDisplay.map((func: any, fIndex: number) => {
          const setNewBlocks = () => setFuncSelected(func);
          return (
            <li key={fIndex}>
              <div
                className={cn(
                  "rounded-full px-3 py-2 bg-background-default border border-stroke-neutral text-base uppercase font-sans-display font-bold tracking-wide leading-4 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-foreground-orm text-foreground-neutral hover:text-foreground-neutral-reverse",
                  funcSelected === func &&
                    "bg-foreground-orm text-foreground-reverse-neutral",
                )}
                onClick={() => setNewBlocks()}
              >
                {func.name}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const handleCodeBlockChange = (item: any) => {
    setSelectedAPIItem(item);
    setFuncSelected(item.functions[0]);
  };

  return (
    <div className="text-white grid gap-20 md:gap-10 lg:grid-cols-[1fr_2fr] grid-rows-[auto_auto]">
      <div className="w-full lg:max-w-100 mt-10 md:mt-12 relative [&>ul]:list-none [&>ul]:p-0 max-md:*:text-left max-md:[&>p]:text-left">
        <div className="hidden lg:inline-block">
          <CurvedArrow className="absolute right-0 -top-8" />
        </div>
        <h2 className="mt-2 text-foreground-neutral text-4xl stretch-display leading-13">
          Explore the <br /> Prisma Client API
        </h2>
        <p className="mt-6 text-foreground-neutral-weak text-base">
          From simple reads to complex nested writes, the Prisma Client supports
          a wide range of operations to help you make the most of your data.
        </p>
        <div className="my-6 mb-4 flex items-center flex-wrap relative gap-4">
          <div className="min-w-50 relative w-full sm:w-auto">
            <Select
              value={selectedLang.value}
              onValueChange={(value: string | null) => {
                if (value) {
                  handleChange(
                    langOptions.find((lang: any) => lang.value === value),
                  );
                }
              }}
            >
              <SelectTrigger className="bg-border-primary text-foreground-neutral hover:border-surface-brand-darker w-full h-[unset]! p-1.5">
                <SelectValue>
                  {selectedLang.label && renderItem(selectedLang)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {langOptions.map((lang: any) => (
                  <SelectItem value={lang.value} key={lang.value}>
                    {renderItem(lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="2xl"
            variant="orm"
            href={"https://www.prisma.io/docs/orm/prisma-client"}
            className="w-full sm:w-auto"
          >
            Get Started
          </Button>
        </div>
        <div className="min-w-50 relative mt-0.5">
          <Select
            value={selectedAPIItem.value}
            onValueChange={(value: string | null) => {
              if (value) {
                handleCodeBlockChange(
                  apiItems.find((item: any) => item.value === value),
                );
              }
            }}
          >
            <SelectTrigger className="bg-border-primary text-foreground-neutral-weak hover:border-surface-brand-darker w-full font-sans-display">
              <SelectValue>
                {selectedAPIItem.label && <span>{selectedAPIItem.label}</span>}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {apiItems.map((item: any) => (
                <SelectItem value={item.value} key={item.value}>
                  <span>{item.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {<CodeUIItems item={selectedAPIItem} blockType={blockType} />}
      </div>
      <div className="w-full min-w-0 top-0 -mt-7.5 md:p-0 md:w-full lg:max-w-180 lg:mt-10 flex flex-col gap-4">
        {contentBlocks}
      </div>
    </div>
  );
};

export default API;
