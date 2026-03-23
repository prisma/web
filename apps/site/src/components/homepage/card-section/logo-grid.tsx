"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import defaultLogosData from "./default-logos.json";
import { cn } from "../../../lib/cn";

// Inline keyframe animations
const AnimationStyles = () => (
  <style jsx global>{`
    @keyframes slideLeft {
      from {
        transform: translateX(0%);
      }
      to {
        transform: translateX(-100%);
      }
    }
    @keyframes slideRight {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0%);
      }
    }
  `}</style>
);

// Inline LogoBar component
const LogoBar = ({
  logos,
  direction = "right",
  pauseOnHover = false,
  duplicateCount = 3,
}: {
  logos: Logo[];
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  duplicateCount?: number;
}) => {
  const duplicatedLogos = Array.from(
    { length: duplicateCount },
    () => logos,
  ).flat();

  return (
    <div className="relative w-full overflow-hidden h-[85px] md:h-[60px]">
      <div
        className={`flex flex-nowrap items-center absolute w-max min-w-full ${direction === "left" ? "animate-[slideLeft_40s_linear_infinite]" : "animate-[slideRight_40s_linear_infinite]"} ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
      >
        {duplicatedLogos.map((logo, index) => (
          <a
            key={`${logo.alt}-${index}`}
            href={logo.link}
            className="w-[85px] h-[85px] md:w-[60px] md:h-[60px] flex-shrink-0 rounded-xl z-[1] bg-background-default border border-white/10 flex items-center justify-center p-3 md:p-2 transition-[opacity_0.2s_ease,filter_0.2s_ease,transform_0.2s_ease,background_0.2s_ease,border-color_0.2s_ease] cursor-pointer opacity-80 mr-6 md:mr-2  hover:border-[#16A394] hover:opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LogoImage logo={logo} size={60} />
          </a>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// TYPES
// ============================================================================

interface Logo {
  imageUrl: string;
  link: string;
  alt: string;
}

interface LogoGridProps {
  logos?: Logo[];
  type?: "spotlight" | "track";
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const SPOTLIGHT_RADIUS = 200; // Distance in pixels for spotlight effect
const SPOTLIGHT_POWER = 1.5; // Easing power for spotlight fade
const MOBILE_BREAKPOINT = 874;
const TABLET_BREAKPOINT = 1024;

// ============================================================================
// UTILITY HOOKS
// ============================================================================

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const updateResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width <= MOBILE_BREAKPOINT);
      setIsTablet(width <= TABLET_BREAKPOINT && width > MOBILE_BREAKPOINT);
    };

    updateResponsive();
    window.addEventListener("resize", updateResponsive);
    return () => window.removeEventListener("resize", updateResponsive);
  }, []);

  return { isMobile, isTablet };
};

// ============================================================================
// LOGO IMAGE COMPONENT
// ============================================================================

const LogoImage = memo(({ logo, size }: { logo: Logo; size: number }) => {
  const isSvg = logo.imageUrl.endsWith(".svg");
  const ImageComponent = isSvg ? Image : "img";

  return (
    <ImageComponent
      src={logo.imageUrl}
      alt={logo.alt}
      width={size}
      height={size}
      className="w-full aspect-square rounded-lg object-contain"
    />
  );
});

LogoImage.displayName = "LogoImage";

// ============================================================================
// SPOTLIGHT MODE COMPONENT
// ============================================================================

const SpotlightMode = memo(
  ({
    logos,
    isMobile,
    isTablet,
  }: {
    logos: Logo[];
    isMobile: boolean;
    isTablet: boolean;
  }) => {
    const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [logoOpacities, setLogoOpacities] = useState<number[]>([]);
    const [isHovering, setIsHovering] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const logoRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const rafRef = useRef<number | undefined>(undefined);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Calculate logo opacities based on mouse position
    const calculateLogoOpacities = useCallback(
      (mouseX: number, mouseY: number) => {
        return logoRefs.current.map((logoRef) => {
          if (!logoRef) return 0.2;

          const logoRect = logoRef.getBoundingClientRect();
          const dx = mouseX - (logoRect.left + logoRect.width / 2);
          const dy = mouseY - (logoRect.top + logoRect.height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const normalized = Math.min(distance / SPOTLIGHT_RADIUS, 1);
          const eased = Math.pow(normalized, SPOTLIGHT_POWER);

          return Math.max(0.2, 1 - eased * 0.8);
        });
      },
      [],
    );

    // Initialize default logo opacities (centered)
    useEffect(() => {
      if (
        !wrapperRef.current ||
        isHovering ||
        logoRefs.current.length === 0 ||
        isMobile ||
        isTablet
      ) {
        return;
      }

      const rect = wrapperRef.current.getBoundingClientRect();
      setLogoOpacities(
        calculateLogoOpacities(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
        ),
      );
    }, [isHovering, isMobile, isTablet, calculateLogoOpacities]);

    // Mouse enter handler
    const handleMouseEnter = useCallback(() => {
      if (isMobile || isTablet) return;
      setIsTransitioning(true);
      setIsHovering(true);
    }, [isMobile, isTablet]);

    // Mouse move handler with RAF optimization
    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!wrapperRef.current || isMobile || isTablet) return;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
          if (!wrapperRef.current) return;

          const rect = wrapperRef.current.getBoundingClientRect();
          setGradientPosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
          setLogoOpacities(calculateLogoOpacities(e.clientX, e.clientY));

          if (isTransitioning) {
            setTimeout(() => setIsTransitioning(false), 50);
          }
        });

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      },
      [isMobile, isTablet, isTransitioning, calculateLogoOpacities],
    );

    // Mouse leave handler
    const handleMouseLeave = useCallback(() => {
      if (isMobile) return;
      setIsTransitioning(true);
      setIsHovering(false);
      timeoutRef.current = setTimeout(() => {
        setGradientPosition({ x: 50, y: 50 });
      }, 100);
    }, [isMobile]);

    // Cleanup
    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    const logoSize = isMobile ? 50 : 75;

    return (
      <div
        ref={wrapperRef}
        className="relative w-full h-full overflow-visible"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient background - desktop/tablet only or static on mobile */}
        {!isMobile && !isTablet && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-z-0 w-[350px] h-[350px] md:w-[300px] md:h-[300px] rounded-full blur-[50px] bg-background-ppg-strong md:blur-[40px] pointer-events-none z-0 will-change-[top,left,transform] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [perspective:1000px] [-webkit-perspective:1000px] isolate"
            style={{
              left: `${gradientPosition.x}%`,
              top: `${gradientPosition.y}%`,
              transition: isTransitioning
                ? "top 0.3s ease-out, left 0.3s ease-out"
                : "none",
            }}
          />
        )}
        {(isMobile || isTablet) && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-z-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,#092A28_0%,#090A15_100%)] blur-[40px] pointer-events-none z-0 will-change-[top,left,transform] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [perspective:1000px] [-webkit-perspective:1000px] isolate"
            style={{ width: "100%", height: "100%" }}
          />
        )}

        {/* Logo grid */}
        <div className="grid grid-cols-6 md:grid-cols-7 lg:gap-2 gap-1 relative py-2 pr-0 pl-8 md:px-6 [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,black_30%,rgba(0,0,0,0.9)_50%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.2)_85%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,black_30%,rgba(0,0,0,0.9)_50%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.2)_85%,transparent_100%)] lg:[mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_25%,rgba(0,0,0,0.9)_50%,rgba(0,0,0,0.5)_75%,rgba(0,0,0,0.2)_90%,transparent_100%)] lg:[-webkit-mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_25%,rgba(0,0,0,0.9)_50%,rgba(0,0,0,0.5)_75%,rgba(0,0,0,0.2)_90%,transparent_100%)] z-[1]">
          {logos.map((logo, index) => {
            const opacity =
              isMobile || isTablet ? 1 : (logoOpacities[index] ?? 0.2);
            const brightness =
              isMobile || isTablet ? 1 : 0.7 + (opacity - 0.2) * 0.375;
            const grayscale =
              isMobile || isTablet ? 0 : 0.3 * (1 - (opacity - 0.2) / 0.8);

            // nth-child translations for mobile
            const getMobileTransform = () => {
              if (!isMobile) return "";
              const pos = index + 1;
              if (pos >= 21) return "hidden";
              if (pos >= 1 && pos <= 6) return "-translate-x-[20px]";
              if (pos >= 7 && pos <= 12) return "translate-x-[20px]";
              if (pos >= 13 && pos <= 18) return "-translate-x-[20px]";
              if (pos >= 19 && pos <= 21) return "translate-x-[190%]";
              return "";
            };

            // nth-child margin for desktop
            const getDesktopMargin = () => {
              if (isMobile) return "";
              const pos = index + 1;
              if (pos >= 8 && pos <= 14) return "md:-ml-[20px]";
              return "";
            };

            return (
              <a
                key={`${logo.alt}-${index}`}
                ref={(el) => {
                  logoRefs.current[index] = el;
                }}
                href={logo.link}
                className={cn(
                  "w-full aspect-square rounded-xl z-[1] bg-background-default border border-white/10 flex items-center justify-center p-4 md:p-3 transition-[opacity_0.2s_ease,filter_0.2s_ease,transform_0.2s_ease,background_0.2s_ease,border-color_0.2s_ease] cursor-pointer will-change-[opacity,filter]  hover:border-[#16A394] hover:-translate-y-0.5  active:translate-y-0 lg:opacity-100 lg:filter-none",
                  getMobileTransform(),
                  getDesktopMargin(),
                  index === 18 ? "md:ml-[calc(50%-1.grid-column-start:3]" : "",
                )}
                target="_blank"
                rel="noopener noreferrer"
                style={
                  isMobile || isTablet
                    ? undefined
                    : {
                        opacity,
                        filter: `grayscale(${grayscale}) brightness(${brightness})`,
                      }
                }
              >
                <LogoImage logo={logo} size={logoSize} />
              </a>
            );
          })}
        </div>
      </div>
    );
  },
);

SpotlightMode.displayName = "SpotlightMode";

// ============================================================================
// TRACK MODE COMPONENT
// ============================================================================

const TrackMode = memo(({ logos }: { logos: Logo[] }) => {
  // Split logos into 3 even groups
  const logosPerBar = Math.ceil(logos.length / 3);
  const logosBar1 = logos.slice(0, logosPerBar);
  const logosBar2 = logos.slice(logosPerBar, logosPerBar * 2);
  const logosBar3 = logos.slice(logosPerBar * 2);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "visible",
        gap: "10px",
        position: "relative",
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-z-0 w-[350px] h-[350px] md:w-[300px] md:h-[300px] rounded-full bg-[radial-gradient(circle,#092A28_0%,#090A15_100%)] blur-[50px] md:blur-[40px] pointer-events-none z-0 will-change-[top,left,transform] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [perspective:1000px] [-webkit-perspective:1000px] isolate" />
      <LogoBar logos={logosBar1} pauseOnHover={false} duplicateCount={3} />
      <LogoBar
        logos={logosBar2}
        direction="left"
        pauseOnHover={false}
        duplicateCount={3}
      />
      <LogoBar logos={logosBar3} pauseOnHover={false} duplicateCount={3} />
    </div>
  );
});

TrackMode.displayName = "TrackMode";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LogoGrid = ({
  logos: propLogos,
  type = "spotlight",
}: LogoGridProps) => {
  const { isMobile, isTablet } = useResponsive();
  const logos =
    propLogos && propLogos.length > 0 ? propLogos : defaultLogosData;

  return (
    <>
      <AnimationStyles />
      {type === "track" ? (
        <TrackMode logos={logos} />
      ) : (
        <SpotlightMode logos={logos} isMobile={isMobile} isTablet={isTablet} />
      )}
    </>
  );
};
