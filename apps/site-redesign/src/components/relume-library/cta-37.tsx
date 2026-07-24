// @ts-nocheck
"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type HoverLinkProps = {
  url: string;
  heading: string;
  image: ImageProps;
};

type Props = {
  tagline: string;
  hoverLinks: HoverLinkProps[];
};
export type Cta37Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

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

export const Cta37 = (props: Cta37Props) => {
  const { tagline, hoverLinks } = {
    ...Cta37Defaults,
    ...props,
  };

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);
  const [direction, setDirection] = useState<"top" | "bottom" | "left" | "right" | string>(
    "initial",
  );

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = event.currentTarget;
    if (!element) return;
    setDirection(getDirection(event, element));
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {hoverLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              onMouseEnter={() => setHoveredIndex(index)}
              className="flex items-center justify-center p-4"
            >
              <h3
                className={clsx(
                  "text-5xl font-bold transition-colors duration-300 md:text-9xl lg:text-10xl",
                  {
                    "lg:text-black/20": hoveredIndex !== index && hoveredIndex !== null,
                    "lg:text-black": hoveredIndex === index || hoveredIndex === null,
                  },
                )}
              >
                {link.heading}
              </h3>
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

export const Cta37Defaults: Props = {
  tagline: "Tagline",
  hoverLinks: [
    {
      url: "#",
      heading: "Hover over link one",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      url: "#",
      heading: "Hover over link two",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
        alt: "Relume placeholder image 2",
      },
    },
    {
      url: "#",
      heading: "Hover over link three",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
        alt: "Relume placeholder image 3",
      },
    },
    {
      url: "#",
      heading: "Hover over link four",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4.svg",
        alt: "Relume placeholder image 4",
      },
    },
  ],
};
