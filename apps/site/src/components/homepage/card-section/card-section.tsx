"use client";

import { LogoGrid } from "./logo-grid";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "../../../lib/cn";
import { useTheme } from "@prisma-docs/ui/components/theme-provider";

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
}

interface CardSectionProps {
  cardSection: TwoColumnItem[];
}

export const CardSection = ({ cardSection }: CardSectionProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-[1232px] mx-auto mt-8 px-4 overflow-visible">
      {cardSection.map((item, index) => (
        <section
          key={`card-section-${index}-${item.visualType}-${item.visualPosition}`}
          className="py-6 md:py-8 lg:py-12 my-6 md:my-8 lg:my-12 w-full overflow-visible"
        >
          <div
            className={cn(
              "[&_h2]:mt-0 flex gap-8 lg:gap-12 md:gap-8 sm:gap-6 items-center overflow-visible",
              item.visualPosition === "left" && "lg:flex-row-reverse flex-col",
              item.visualPosition === "right" && "lg:flex-row flex-col",
              item.alignItems,
            )}
          >
            <div
              className={cn(
                "flex-1 min-w-0 overflow-visible text-center lg:text-left max-w-160",
                item.visualType === "logoGrid" ? "lg:max-w-full" : "lg:w-full",
                item.visualPosition === "left" ? "lg:ml-12" : "lg:mr-12",
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
                <LogoGrid />
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
          {item.footer && <>{item.footer}</>}
        </section>
      ))}
    </div>
  );
};
