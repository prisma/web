"use client";

import { LogoGrid } from "./logo-grid";
import { ReactNode, useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "../../../lib/cn";
import { useTheme } from "@prisma-docs/ui/components/theme-provider";
import { Action } from "@prisma/eclipse";

interface TwoColumnItem {
  content: ReactNode;
  imageUrl: string | null;
  imageAlt: string | null;
  mobileImageUrl: string | null;
  mobileImageAlt: string | null;
  logos: any[] | null;
  alignItems?: "items-end" | "items-start" | "items-center";
  footer?: ReactNode;
  color?: "orm" | "ppg";
  other?: ReactNode;
  useDefaultLogos: boolean;
  visualPosition: "left" | "right";
  visualType: "logoGrid" | "image" | "other";
  noShadow?: boolean;
  step?: string;
}

interface CardSectionProps {
  cardSection: TwoColumnItem[];
}

export const CardSection = ({ cardSection }: CardSectionProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Safe guard against empty array
  const hasSteps = Boolean(cardSection[0]?.step);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!hasSteps || !containerRef.current) return;

    const scrollWatcher = () => {
      requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const position =
          container.getBoundingClientRect().y * -1 + window.innerHeight * 0.8;

        setProgressHeight(position);

        // Find the section closest to the center of the viewport
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let minDistance = Infinity;

        sectionRefs.current.forEach((section, index) => {
          if (!section) return;

          const rect = section.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        setActive(closestIndex);
      });
    };

    window.addEventListener("scroll", scrollWatcher);
    scrollWatcher();

    return () => window.removeEventListener("scroll", scrollWatcher);
  }, [cardSection]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "max-w-[1232px] mx-auto mt-8 px-4 overflow-visible",
        hasSteps && "flex-col md:flex-row items-start gap-6! relative",
      )}
    >
      {hasSteps && (
        <div
          className="max-h-full absolute top-0 left-8.5 md:left-12 w-[2px] bg-[linear-gradient(180deg,var(--color-background-default)_25%,var(--color-stroke-ppg-weak)_50%,var(--color-background-default)_75%)] z-[1]"
          style={{ height: `${progressHeight}px` }}
        />
      )}
      {cardSection.map((item, index) => {
        return (
          <section
            key={`card-section-${index}-${item.visualType}-${item.visualPosition}`}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className={
              "py-6 md:py-8 lg:py-12 my-6 md:my-8 lg:my-12 w-full overflow-visible"
            }
          >
            <div
              className={cn(
                "[&_h2]:mt-0 flex gap-6 md:gap-8 lg:gap-12 sm:gap-6 items-center overflow-visible",
                item.visualPosition === "left" &&
                  "lg:flex-row-reverse flex-col",
                item.visualPosition === "right" && "md:flex-row flex-col",
                item.alignItems,
                item.step && "items-start! flex-row! justify-between",
              )}
            >
              {item.step && (
                <Action
                  size="5xl"
                  color={active === index ? "ppg" : "neutral"}
                  className={cn(
                    "relative z-[2] transition-all md:size-element-5xl! size-element-3xl!",
                    active === index
                      ? "border border-stroke-ppg shadow-[0_-7px_80px_0_rgba(45,212,191,0.16),0_-2.924px_33.422px_0_rgba(45,212,191,0.12),0_-1.564px_17.869px_0_rgba(45,212,191,0.10),0_-0.877px_10.017px_0_rgba(45,212,191,0.08),0_-0.466px_5.32px_0_rgba(45,212,191,0.06),0_-0.194px_2.214px_0_rgba(45,212,191,0.04)]"
                      : "border border-stroke-neutral bg-background-neutral-weaker",
                  )}
                >
                  <i
                    className={cn(
                      item.step,
                      "text-xl md:text-3xl",
                      active === index
                        ? "text-foreground-ppg"
                        : "text-background-neutral-strong",
                    )}
                  />
                </Action>
              )}
              <div className="md:contents">
                <div
                  className={cn(
                    "flex-1 min-w-0 overflow-visible text-center lg:text-left max-w-160",
                    item.visualType === "logoGrid"
                      ? "lg:max-w-full"
                      : "lg:w-full",
                    item.visualPosition === "left" ? "lg:ml-12" : "lg:mr-12",
                    item.step && "text-left",
                  )}
                >
                  {item.content}
                </div>
                <div
                  className={cn(
                    "flex-1 min-w-0 overflow-visible w-full lg:max-w-unset max-w-137",
                    item.visualType === "logoGrid" ? "max-w-full" : "lg:w-full",
                  )}
                >
                  {item.other && item.visualType === "other" && item.other}
                  {item.visualType === "logoGrid" && item.useDefaultLogos && (
                    <LogoGrid color={item.color} />
                  )}
                  {item.visualType === "image" && item.imageUrl && (
                    <div key={`images-${index}`}>
                      <img
                        key={`desktop-img-${index}`}
                        className={cn(
                          "hidden sm:block w-full h-auto",
                          !item.noShadow &&
                            "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]",
                        )}
                        src={
                          mounted && resolvedTheme === "light"
                            ? `${item.imageUrl}_light.svg`
                            : `${item.imageUrl}.svg`
                        }
                        alt={item.imageAlt || ""}
                      />
                      {item.mobileImageUrl && (
                        <img
                          key={`mobile-img-${index}`}
                          className={cn(
                            "w-full h-auto sm:hidden",
                            !item.noShadow &&
                              "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]",
                          )}
                          src={
                            mounted && resolvedTheme === "light"
                              ? `${item.mobileImageUrl}_light.svg`
                              : `${item.mobileImageUrl}.svg`
                          }
                          alt={item.mobileImageAlt || ""}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {item.footer && <>{item.footer}</>}
          </section>
        );
      })}
    </div>
  );
};
