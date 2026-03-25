"use client";

import Image from "next/image";
import { useState, useEffect, memo } from "react";
import defaultLogosData from "./default-logos.json";
import { useTheme } from "@prisma-docs/ui/components/theme-provider";
import GlowCursor from "@/components/homepage/glow-cursor";

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
  mobileImageUrl?: string;
  link: string;
  alt: string;
}

interface LogoGridProps {
  logos?: Logo[];
  type?: "spotlight" | "track";
}

// ============================================================================
// LOGO IMAGE COMPONENT
// ============================================================================

const LogoImage = memo(({ logo, size }: { logo: Logo; size: number }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const imageUrl =
    mounted && resolvedTheme === "light" && logo.mobileImageUrl
      ? logo.mobileImageUrl
      : logo.imageUrl;

  const isSvg = imageUrl.endsWith(".svg");
  const ImageComponent = isSvg ? Image : "img";

  return (
    <ImageComponent
      src={imageUrl}
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

const SpotlightMode = memo(({ logos }: { logos: Logo[] }) => {
  const logoSize = 50;
  const visibleLogos = logos.slice(0, 21);

  return (
    <GlowCursor color="var(--color-background-ppg-strong)">
      <div className="relative w-full h-full overflow-visible">
        {/* Logo grid */}
        <div className="relative z-1 flex justify-center px-2 md:px-4">
          <div className="flex max-w-[760px] flex-wrap items-center justify-center gap-2 md:gap-3">
            {visibleLogos.map((logo, index) => (
              <a
                key={`${logo.alt}-${index}`}
                href={logo.link}
                className="w-[20%] sm:w-[12%] aspect-square rounded-xl z-1 bg-background-default border border-white/10 flex items-center justify-center p-3 md:p-2 transition-[transform_0.2s_ease,border-color_0.2s_ease] hover:border-[#16A394] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LogoImage logo={logo} size={logoSize} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </GlowCursor>
  );
});

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
  const logos =
    propLogos && propLogos.length > 0 ? propLogos : defaultLogosData;

  return (
    <>
      <AnimationStyles />
      {type === "track" ? (
        <TrackMode logos={logos} />
      ) : (
        <SpotlightMode logos={logos} />
      )}
    </>
  );
};
