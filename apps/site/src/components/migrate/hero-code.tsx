"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, CardHeader, CodeBlock } from "@prisma/eclipse";
import { cn } from "@/lib/cn";
import { prisma_highlighter as getHighlighter } from "@/lib/shiki_prisma";

export interface HeroCodeStep {
  title: string;
  schema: string;
  migrateFileName: string;
  migrateFileContents: string;
  arrowOffset: {
    x: number;
    y: number;
    rotation: number;
  };
}

interface HeroCodeProps {
  steps: HeroCodeStep[];
}

const HeroCode: React.FC<HeroCodeProps> = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [highlightedSchema, setHighlightedSchema] = useState<string>("");
  const [highlightedMigration, setHighlightedMigration] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Guard: Return early if steps array is empty
  if (!steps || steps.length === 0) {
    return (
      <div className="inline-flex w-full relative items-start justify-center flex-col mt-22.5 gap-12.75 lg:gap-4 lg:flex-row">
        <Card className="flex-1 relative max-w-full w-full bg-background-default gap-0!">
          <CardHeader>
            <span className="mb-0 text-foreground-neutral-weak text-xs font-bold">
              No steps available
            </span>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Clamp activeStep to valid range
  const safeActiveStep = Math.min(activeStep, steps.length - 1);
  const currentStep = steps[safeActiveStep];

  // Load highlighted code when activeStep changes
  useEffect(() => {
    let isMounted = true;

    const loadHighlightedCode = async () => {
      setIsLoading(true);
      try {
        const highlighter = await getHighlighter();

        const [schemaHtml, migrationHtml] = await Promise.all([
          highlighter.codeToHtml(currentStep?.schema || "", {
            lang: "prisma",
            theme: "prisma-dark",
          }),
          highlighter.codeToHtml(currentStep?.migrateFileContents || "", {
            lang: "sql",
            theme: "prisma-dark",
          }),
        ]);

        // Post-process to add diff styling for lines starting with +
        const processedSchemaHtml = schemaHtml.replace(
          /<span class="line">([\s\S]*?)(<\/span>)/g,
          (match, content, closing) => {
            // Check if line starts with + (accounting for any leading spans)
            const startsWithPlus =
              /<span[^>]*>\+/.test(content) || content.trim().startsWith("+");
            if (startsWithPlus) {
              return `<span class="line diff-add">${content}${closing}`;
            }
            return match;
          },
        );

        if (isMounted) {
          setHighlightedSchema(processedSchemaHtml);
          setHighlightedMigration(migrationHtml);
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
  }, [activeStep, steps, currentStep]);

  // cycle across steps and go back to if we're at the end
  const cycleActiveStep = () => {
    if (steps.length === 0) return;
    activeStep === steps.length - 1
      ? setActiveStep(0)
      : setActiveStep(activeStep + 1);
  };

  return (
    <div className="inline-flex w-full relative items-start justify-center flex-col mt-22.5 gap-12.75 lg:gap-4 lg:flex-row">
      {/* First Code Card - schema.prisma */}
      <Card
        className={cn(
          // Base styles
          "flex-1 relative max-w-full w-full transition-[margin-right] duration-300 ease-in-out z-2 bg-background-default gap-0!",
          // Desktop styles
          "lg:mt-15.5 lg:z-0 lg:max-w-[calc(50%-8px)]",
          // Open card state
          activeStep !== 0 && "lg:max-w-[calc(50%-8px+124px)] lg:-mr-31 lg:z-0",
        )}
      >
        {/* Card Header */}
        <CardHeader className="flex justify-between flex-row! items-center">
          <span className="mb-0 text-foreground-neutral-weak text-xs font-bold">
            schema.prisma
          </span>
          <Button
            variant="default"
            size="lg"
            onClick={() => cycleActiveStep()}
            className={cn(
              "w-fit transition-all duration-300",
              activeStep !== 0 && "lg:mr-26",
            )}
            disabled={isLoading}
          >
            {currentStep?.title || "No title"}
          </Button>
        </CardHeader>
        <CodeBlock
          keepBackground={true}
          className={cn(
            "border-none [&_pre]:bg-transparent my-0! [&_.diff-add]:text-background-success-reverse-strong [&>.absolute]:duration-300 [&>.absolute]:transition-all",
            activeStep !== 0 && "[&>.absolute]:lg:mr-23",
          )}
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: highlightedSchema,
              }}
            />
          )}
        </CodeBlock>
      </Card>

      {/* Second Code Card - Migration file */}
      <Card
        className={cn(
          // Base styles
          "flex-1 relative max-w-full w-full border border-transparent transition-[margin-right] duration-300 ease-in-out z-2 bg-[linear-gradient(180deg,var(--color-background-orm)_0%,var(--color-background-orm-strong)_100%)] gap-0!",
          // After pseudo-element (gradient background)
          "after:content-[''] after:bg-background-default after:absolute after:z-1 after:inset-0.25 after:rounded-square",
          // Desktop styles
          "lg:mt-0 lg:z-0 lg:max-w-[calc(50%-8px)]",
        )}
      >
        {/* Card Header */}
        <CardHeader className="flex justify-between flex-row! items-center relative z-2">
          <span className="mb-0 text-foreground-neutral text-xs font-bold">
            {currentStep?.migrateFileName || "migration.sql"}
          </span>
        </CardHeader>
        <CodeBlock
          data-line-numbers
          keepBackground={true}
          className="border-none [&_pre]:bg-transparent relative z-2 my-0!"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: highlightedMigration,
              }}
            />
          )}
        </CodeBlock>
      </Card>

      {/* Arrow SVG */}
      <svg
        width="102"
        height="81"
        viewBox="0 0 102 81"
        fill="none"
        className="absolute bottom-[56%] z-1 left-[40%] lg:left-[46%] lg:block lg:z-100 lg:bottom-0"
        style={{
          transform: `translate(${currentStep?.arrowOffset?.x || 0}px, ${currentStep?.arrowOffset?.y || 0}px) rotate(${currentStep?.arrowOffset?.rotation || 0}deg)`,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.81326 1.15614C3.34721 0.154705 2.15757 -0.279308 1.15614 0.186743C0.154705 0.652795 -0.279308 1.84243 0.186743 2.84386L3.81326 1.15614ZM101.414 67.4142C102.195 66.6332 102.195 65.3668 101.414 64.5858L88.6863 51.8579C87.9052 51.0768 86.6389 51.0768 85.8579 51.8579C85.0768 52.6389 85.0768 53.9052 85.8579 54.6863L97.1716 66L85.8579 77.3137C85.0768 78.0948 85.0768 79.3611 85.8579 80.1421C86.6389 80.9232 87.9052 80.9232 88.6863 80.1421L101.414 67.4142ZM0.186743 2.84386C10.2779 24.5274 44.3226 68 100 68V64C46.5328 64 13.5785 22.1393 3.81326 1.15614L0.186743 2.84386Z"
          fill="url(#paint0_linear_4084_6375)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_4084_6375"
            x1="51"
            y1="2"
            x2="51"
            y2="66"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--color-background-orm)" />
            <stop offset="1" stopColor="var(--color-background-orm-strong)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default HeroCode;
