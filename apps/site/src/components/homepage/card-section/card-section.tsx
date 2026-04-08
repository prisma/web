"use client";

import { LogoGrid } from "./logo-grid";
import { ReactNode, useEffect, useState, useRef } from "react";
import { cn } from "../../../lib/cn";
import { Action } from "@prisma/eclipse";
import Image from "next/image";

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

const imageShadowClass = "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]";
const sectionClass =
  "py-6 md:py-8 lg:py-12 my-6 md:my-8 lg:my-12 w-full overflow-visible px-4 sm:px-0";

const getCardSectionItemKey = (item: TwoColumnItem) =>
  [
    item.visualType,
    item.visualPosition,
    item.step,
    item.imageUrl,
    item.mobileImageUrl,
    item.imageAlt,
    item.mobileImageAlt,
    item.color,
    item.useDefaultLogos ? "default-logos" : null,
  ]
    .filter(Boolean)
    .join("-");

interface StepIndicatorProps {
  icon: string;
  isActive: boolean;
}

const StepIndicator = ({ icon, isActive }: StepIndicatorProps) => (
  <Action
    size="5xl"
    color={isActive ? "ppg" : "neutral"}
    className={cn(
      "relative z-2 transition-all md:size-element-5xl! size-element-3xl!",
      isActive
        ? "border border-stroke-ppg shadow-[0_-7px_80px_0_rgba(45,212,191,0.16),0_-2.924px_33.422px_0_rgba(45,212,191,0.12),0_-1.564px_17.869px_0_rgba(45,212,191,0.10),0_-0.877px_10.017px_0_rgba(45,212,191,0.08),0_-0.466px_5.32px_0_rgba(45,212,191,0.06),0_-0.194px_2.214px_0_rgba(45,212,191,0.04)]"
        : "border border-stroke-neutral bg-background-neutral-weaker",
    )}
  >
    <i
      className={cn(
        icon,
        "text-xl md:text-3xl",
        isActive ? "text-foreground-ppg" : "text-background-neutral-strong",
      )}
    />
  </Action>
);

interface ThemeImagePairProps {
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
  priority: boolean;
  fetchPriority: "high" | "low" | "auto";
  loading: "eager" | "lazy";
  noShadow?: boolean;
  wrapperClassName: string;
}

const ThemeImagePair = ({
  imageUrl,
  alt,
  width,
  height,
  priority,
  fetchPriority,
  loading,
  noShadow,
  wrapperClassName,
}: ThemeImagePairProps) => (
  <div className={wrapperClassName}>
    <Image
      className={cn("hidden dark:block w-full h-auto", !noShadow && imageShadowClass)}
      src={`${imageUrl}.svg`}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      fetchPriority={fetchPriority}
      loading={loading}
    />
    <Image
      className={cn("block dark:hidden w-full h-auto", !noShadow && imageShadowClass)}
      src={`${imageUrl}_light.svg`}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      fetchPriority={fetchPriority}
      loading={loading}
    />
  </div>
);

interface ImageVisualProps {
  item: TwoColumnItem;
  isLcpImage: boolean;
}

const ImageVisual = ({ item, isLcpImage }: ImageVisualProps) => {
  if (!item.imageUrl) return null;

  const imageAlt = item.imageAlt || "";
  const mobileImageAlt = item.mobileImageAlt || "";
  const imageLoading = isLcpImage ? "eager" : "lazy";
  const imagePriority = isLcpImage;
  const imageFetchPriority = isLcpImage ? "high" : "low";

  return (
    <div className="relative w-full">
      <ThemeImagePair
        imageUrl={item.imageUrl}
        alt={imageAlt}
        width={1200}
        height={800}
        priority={imagePriority}
        fetchPriority={imageFetchPriority}
        loading={imageLoading}
        noShadow={item.noShadow}
        wrapperClassName="hidden sm:block"
      />
      {item.mobileImageUrl && (
        <ThemeImagePair
          imageUrl={item.mobileImageUrl}
          alt={mobileImageAlt}
          width={800}
          height={600}
          priority={imagePriority}
          fetchPriority={imageFetchPriority}
          loading={imageLoading}
          noShadow={item.noShadow}
          wrapperClassName="sm:hidden"
        />
      )}
    </div>
  );
};

const SectionVisual = ({
  item,
  isLcpImage,
}: {
  item: TwoColumnItem;
  isLcpImage: boolean;
}) => {
  if (item.visualType === "other") {
    return item.other ? <>{item.other}</> : null;
  }

  if (item.visualType === "logoGrid" && item.useDefaultLogos) {
    return <LogoGrid color={item.color} />;
  }

  if (item.visualType === "image") {
    return <ImageVisual item={item} isLcpImage={isLcpImage} />;
  }

  return null;
};

const CardSectionItem = ({
  item,
  isLcpImage,
  isActive,
  onRef,
}: {
  item: TwoColumnItem;
  isLcpImage: boolean;
  isActive: boolean;
  onRef: (element: HTMLElement | null) => void;
}) => (
  <section ref={onRef} className={sectionClass}>
    <div
      className={cn(
        "[&_h2]:mt-0 flex gap-6 md:gap-8 lg:gap-12 sm:gap-6 items-center overflow-visible",
        item.visualPosition === "left" && "lg:flex-row-reverse flex-col",
        item.visualPosition === "right" && "md:flex-row flex-col",
        item.alignItems,
        item.step && "items-start! flex-row! justify-between",
      )}
    >
      {item.step && <StepIndicator icon={item.step} isActive={isActive} />}
      <div className="md:contents">
        <div
          className={cn(
            "flex-1 min-w-0 overflow-visible text-center lg:text-left max-w-160 mx-auto",
            item.visualType === "logoGrid" ? "lg:max-w-full" : "lg:w-full",
            item.visualPosition === "left" ? "lg:ml-12" : "lg:mr-12",
            item.step && "text-left",
          )}
        >
          {item.content}
        </div>
        <div
          className={cn(
            "flex-1 min-w-0 overflow-visible w-full lg:max-w-unset max-w-137 mt-3 mx-auto",
            item.visualType === "logoGrid" ? "max-w-full" : "lg:w-full",
          )}
        >
          <SectionVisual item={item} isLcpImage={isLcpImage} />
        </div>
      </div>
    </div>
    {item.footer && <>{item.footer}</>}
  </section>
);

export const CardSection = ({ cardSection }: CardSectionProps) => {
  const [active, setActive] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstImageIndex = cardSection.findIndex(
    (item) => item.visualType === "image" && item.imageUrl,
  );

  // Safe guard against empty array
  const hasSteps = Boolean(cardSection[0]?.step);

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

    window.addEventListener("scroll", scrollWatcher, { passive: true });
    scrollWatcher();

    return () => window.removeEventListener("scroll", scrollWatcher);
  }, [cardSection, hasSteps]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "max-w-[1232px] mx-auto mt-8 px-0 sm:px-4 overflow-visible",
        hasSteps && "flex-col md:flex-row items-start gap-6! relative",
      )}
    >
      {hasSteps && (
        <div
          className="max-h-full absolute top-0 left-8.5 md:left-12 w-[2px] bg-[linear-gradient(180deg,var(--color-background-default)_25%,var(--color-stroke-ppg-weak)_50%,var(--color-background-default)_75%)] z-1"
          style={{ height: `${progressHeight}px` }}
        />
      )}
      {cardSection.map((item, index) => (
        <CardSectionItem
          key={getCardSectionItemKey(item)}
          item={item}
          isLcpImage={index === firstImageIndex}
          isActive={active === index}
          onRef={(element) => {
            sectionRefs.current[index] = element;
          }}
        />
      ))}
    </div>
  );
};
