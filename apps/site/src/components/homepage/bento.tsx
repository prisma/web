"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Action } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";
import { useTheme } from "@prisma-docs/ui/components/theme-provider";
// Inline Icon component
const Icon = ({
  icon,
  size,
  color,
}: {
  icon: string;
  size: string;
  color: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill={color}
      fontSize="14"
    >
      {icon}
    </text>
  </svg>
);

// Dynamic SVG component that imports and renders SVG files directly
const DynamicSVG = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  const [SvgComponent, setSvgComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Extract the SVG path (e.g., "/illustrations/home-page/image.svg")
    // and convert it to a dynamic import path
    const loadSvg = async () => {
      try {
        // Remove leading slash and file extension
        const svgPath = src.replace(/^\//, "").replace(/\.svg$/, "");

        // Try to import the SVG as a React component
        // This assumes SVGs are in the public folder or imported as modules
        const module = await import(`@/../public/${svgPath}.svg`);
        setSvgComponent(() => module.default);
      } catch (err) {
        console.warn(`Could not load SVG as component: ${src}`, err);
        setError(true);
      }
    };

    loadSvg();
  }, [src]);

  // Fallback to img tag if dynamic import fails
  if (error || !SvgComponent) {
    return <img src={src} alt="" className={className} />;
  }

  return <SvgComponent className={className} />;
};

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  icon: string;
  row: "top" | "center";
}

interface BentoBox {
  title: string;
  subtitle: string;
  imageUrl: string;
  icon: string;
  imageAlt: string | null;
  link: string;
}

interface BentoProps {
  bentoSection: {
    boxes: BentoBox[];
  };
}

const HeroContent = ({ className = "" }: { className?: string }) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center text-center opacity-0 scale-95 mx-auto mb-10",
      className,
    )}
  >
    <h2 className="text-center m-0 mb-4 text-4xl md:text-[36px] font-black text-foreground-neutral font-sans-display stretch-display">
      Your database, right in your workflow
    </h2>
  </div>
);

const useResponsiveLayout = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 960);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isDesktop };
};

const useCardAnimation = () => {
  const [visibleBoxes, setVisibleBoxes] = useState<Set<string>>(new Set());
  const [heroVisible, setHeroVisible] = useState(false);

  const startAnimations = useCallback(() => {
    setHeroVisible(true);

    const rippleOrder = [
      { ids: ["1"] as const, delay: 100 },
      { ids: ["2"] as const, delay: 200 },
      { ids: ["3"] as const, delay: 300 },
      { ids: ["4"] as const, delay: 400 },
      { ids: ["5"] as const, delay: 500 },
    ] as const;

    rippleOrder.forEach(({ ids, delay }) => {
      setTimeout(() => {
        setVisibleBoxes((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.add(id));
          return next;
        });
      }, delay);
    });
  }, []);

  return { visibleBoxes, heroVisible, startAnimations };
};

export const Bento = ({ bentoSection }: BentoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useResponsiveLayout();
  const { visibleBoxes, heroVisible, startAnimations } = useCardAnimation();

  // Transform Sanity data to internal CardData format
  const CARDS: CardData[] = bentoSection.boxes.map((box, index) => ({
    id: (index + 1).toString(),
    title: box.title,
    subtitle: box.subtitle,
    image: box.imageUrl,
    icon: box.icon,
    link: box.link,
    row: index < 3 ? "top" : "center",
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && startAnimations(),
      { threshold: 0.1 },
    );

    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [startAnimations]);

  const centerCards = CARDS.filter((card) => card.row === "center");
  const [firstCenterCard, secondCenterCard] = centerCards;

  return (
    <div
      ref={containerRef}
      className="max-w-[1240px] mx-auto w-full z-10 px-6 pt-4 pb-0"
    >
      {/* Desktop Layout (961+): Original 3-row layout with text in middle */}
      <HeroContent
        className={
          heroVisible
            ? "opacity-100 scale-100 transition-[opacity_0.8s_cubic-bezier(0.16,1,0.3,1),transform_0.8s_cubic-bezier(0.16,1,0.3,1)]"
            : ""
        }
      />
      {isDesktop ? (
        <>
          <div className="hidden lg:grid grid-cols-3 gap-4 mb-4">
            {CARDS.filter((card) => card.row === "top").map((card) => (
              <Card
                key={card.id}
                card={card}
                isVisible={visibleBoxes.has(card.id)}
              />
            ))}
          </div>

          <div className="hidden lg:flex gap-8 mb-4 items-center justify-between">
            {firstCenterCard && (
              <Card
                key={firstCenterCard.id}
                card={firstCenterCard}
                isVisible={visibleBoxes.has(firstCenterCard.id)}
              />
            )}

            {secondCenterCard && (
              <Card
                key={secondCenterCard.id}
                card={secondCenterCard}
                isVisible={visibleBoxes.has(secondCenterCard.id)}
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex lg:hidden gap-4 flex-wrap justify-center md:grid md:grid-cols-2 sm:grid-cols-1">
          {CARDS.map((card) => (
            <Card
              key={card.id}
              card={card}
              isVisible={visibleBoxes.has(card.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CardProps {
  card: CardData;
  isVisible: boolean;
}

const Card = ({ card, isVisible }: CardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const isCenterCard = ["4", "5"].includes(card.id);
  const { resolvedTheme } = useTheme();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const angle = Math.atan2(mouseY - centerY, mouseX - centerX);

      const degrees = ((angle * 180) / Math.PI + 90 + 360) % 360;

      cardRef.current.style.setProperty("--angle", `${degrees}deg`);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--angle", "0deg");
    }
  }, []);

  return (
    <Link
      ref={cardRef}
      href={card.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "box",
        "md:w-[32%] sm:w-full",
        isCenterCard && "w-full md:order-none",
        isVisible && "box-visible",
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-4 text-xs py-4 px-0 mx-4 w-[calc(100%-2rem)]">
        <Action color="ppg" size="4xl">
          <i className={cn("text-xl", card.icon)} />
        </Action>
        <div className="z-2">
          <h2 className="text-foreground-neutral font-sans-display text-base mt-0 mb-1 font-bold">
            {card.title}
          </h2>
          <p className="text-foreground-neutral-weak text-sm font-normal m-0">
            {card.subtitle}
          </p>
        </div>
      </div>
      {card.image && (
        <img
          src={
            resolvedTheme === "light"
              ? `${card.image}_light.svg`
              : `${card.image}.svg`
          }
          alt={card.title}
          className="px-4 z-2 pt-0 pb-0 min-w-full min-h-[60%] object-contain object-[top_left] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_60%,transparent_90%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_60%,transparent_90%)]"
        />
      )}
    </Link>
  );
};
