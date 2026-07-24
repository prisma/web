// @ts-nocheck
"use client"

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type HoverLinkProps = {
  url: string;
  heading: string;
  tag: string;
  image: ImageProps;
};

type Props = {
  tagline: string;
  hoverLinks: HoverLinkProps[];
};
export type Portfolio19Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

const getDirection = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, obj: HTMLElement) => {
  const { width: w, height: h, left, top } = obj.getBoundingClientRect();

  const centerX = left + w / 2;
  const centerY = top + h / 2;

  const xOffset = ev.clientX - centerX;
  const yOffset = ev.clientY - centerY;

  const angleDegrees = Math.atan2(yOffset, xOffset) * (180 / Math.PI);

  const adjustedAngle = angleDegrees < 0 ? angleDegrees + 360 : angleDegrees;

  if (adjustedAngle >= 315 || adjustedAngle < 45) {
    return "right";
  } else if (adjustedAngle >= 45 && adjustedAngle < 135) {
    return "bottom";
  } else if (adjustedAngle >= 135 && adjustedAngle < 225) {
    return "left";
  } else {
    return "top";
  }
};

export const Portfolio19 = (props: Portfolio19Props) => {
  const { tagline, hoverLinks } = {
    ...Portfolio19Defaults,
    ...props,
  };
  const ref = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);
  const [direction, setDirection] = useState<"top" | "bottom" | "left" | "right" | string>(
    "initial",
  );
  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    setDirection(getDirection(event, ref.current));
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const imageVariants = {
    initial: {
      x: 0,
      y: 0,
    },
    top: {
      y: 50,
      transition: {
        type: "spring",
        duration: 1,
        bounce: 0,
      },
    },
    bottom: {
      y: -50,
      transition: {
        type: "spring",
        duration: 1,
        bounce: 0,
      },
    },
    left: {
      x: 50,
      transition: {
        type: "spring",
        duration: 1,
        bounce: 0,
      },
    },
    right: {
      x: -50,
      transition: {
        type: "spring",
        duration: 1,
        bounce: 0,
      },
    },
  };
  const translateTopInverse = direction === "top" ? -50 : 0;
  const translateBottomInverse = direction === "bottom" ? 50 : 0;
  const translateLeftInverse = direction === "left" ? -50 : 0;
  const translateRightInverse = direction === "right" ? 50 : 0;
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28" onMouseMove={handleMouseMove}>
      <div className="container max-w-xl text-center">
        <p className="mb-6 font-semibold md:mb-8">{tagline}</p>
        <motion.div
          initial="initial"
          whileHover={direction}
          ref={ref}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {hoverLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              onMouseEnter={() => setHoveredIndex(index)}
              className="flex flex-col items-center justify-center gap-2 p-4 sm:flex-row sm:gap-4 md:gap-8"
            >
              <h3
                className={clsx(
                  "text-6xl font-bold transition-colors duration-300 md:text-9xl lg:text-10xl",
                  {
                    "lg:text-black/20": hoveredIndex !== index && hoveredIndex !== null,
                    "lg:text-black": hoveredIndex === index || hoveredIndex === null,
                  },
                )}
              >
                {link.heading}
              </h3>
              <div className="bg-back border border-neutral-lightest bg-neutral-lightest px-2 py-1 text-sm font-semibold">
                {link.tag}
              </div>
              <motion.div
                className={`pointer-events-none fixed inset-0 -z-10 hidden size-[600px] lg:block
                ${hoveredIndex === index ? "opacity-100" : "opacity-0"}
              `}
                style={{
                  translateX: cursorPosition.x - 300 + translateLeftInverse + translateRightInverse,
                  translateY: cursorPosition.y - 300 + translateTopInverse + translateBottomInverse,
                }}
              >
                <motion.img
                  className="size-full max-w-md"
                  variants={imageVariants}
                  src={link.image.src}
                  alt={link.image.alt}
                />
              </motion.div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export const Portfolio19Defaults: Props = {
  tagline: "Tagline",
  hoverLinks: [
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
        alt: "Relume placeholder image 2",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
        alt: "Relume placeholder image 3",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4.svg",
        alt: "Relume placeholder image 4",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-5.svg",
        alt: "Relume placeholder image 5",
      },
    },
    {
      url: "#",
      heading: "Project name",
      tag: "Tag",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-6.svg",
        alt: "Relume placeholder image 6",
      },
    },
  ],
};
