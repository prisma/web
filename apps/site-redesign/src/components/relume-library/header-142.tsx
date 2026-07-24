// @ts-nocheck
"use client"

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import {
  motion,
  MotionStyle,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback } from "react";

type TransformStyles = {
  transform?: string;
  x?: MotionValue<string>;
  y?: MotionValue<string>;
  style?: MotionStyle;
};

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  group1Images: ImageProps[];
  group2Images: ImageProps[];
};

export type Header142Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

const imagePositions = {
  group1: [
    "bottom-[5%] left-[-8%] z-10 max-w-[18%] sm:bottom-[10%] lg:bottom-auto",
    "left-[30%] top-[8%] z-10 max-w-[18%] sm:top-[10%] sm:max-w-[12%] lg:left-[40%] lg:top-[5%]",
    "bottom-[-5%] right-[-5%] z-10 max-w-[25%] lg:max-w-[18%]",
    "bottom-[-2%] left-[20%] z-10 max-w-[18%] sm:bottom-[-5%] sm:max-w-[16%] lg:bottom-[-10%]",
  ],
  group2: [
    "left-[2%] top-[-5%] max-w-[30%] sm:left-[5%] sm:max-w-[18%] lg:left-[10%] lg:top-[-10%]",
    "right-[20%] top-[-2%] max-w-[25%] sm:top-[5%] sm:max-w-[16%] lg:right-[20%] lg:top-[-10%]",
    "right-[-5%] top-[10%] max-w-[20%] sm:max-w-[15%] lg:top-[25%]",
    "bottom-[5%] right-[32%] max-w-[18%] sm:right-[30%] sm:max-w-[15%] lg:bottom-[5%] lg:max-w-[12%]",
  ],
};

const useMouseMove = () => {
  const mouseX = useMotionValue(0.55);
  const mouseY = useMotionValue(0.55);

  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 500 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 500 });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY } = event;
      const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY],
  );

  return { smoothMouseX, smoothMouseY, handleMouseMove };
};

const getTransformStyles = (
  smoothMouseX: MotionValue<number>,
  smoothMouseY: MotionValue<number>,
  xRange: [string, string],
  yRange: [string, string],
): TransformStyles => {
  return {
    x: useTransform(smoothMouseX, [0, 1], xRange),
    y: useTransform(smoothMouseY, [0, 1], yRange),
  };
};

export const Header142 = (props: Header142Props) => {
  const { heading, description, buttons, group1Images, group2Images } = {
    ...Header142Defaults,
    ...props,
  };

  const { smoothMouseX, smoothMouseY, handleMouseMove } = useMouseMove();
  const isMobile = useMediaQuery("(max-width: 991px)");
  const Animate = isMobile ? "div" : motion.div;

  const canvasTransform = getTransformStyles(
    smoothMouseX,
    smoothMouseY,
    ["10vw", "-5vw"],
    ["10vh", "-5vh"],
  );

  const group1Transform = getTransformStyles(
    smoothMouseX,
    smoothMouseY,
    ["8%", "-8%"],
    ["8%", "-8%"],
  );

  const group2Transform = getTransformStyles(
    smoothMouseX,
    smoothMouseY,
    ["2%", "-2%"],
    ["2%", "-2%"],
  );

  const renderImages = (
    images: ImageProps[],
    positions: string[],
    transformStyles: TransformStyles,
  ) => (
    <Animate
      className="absolute inset-0 flex origin-bottom items-center justify-center"
      style={transformStyles}
    >
      {images.map((image, index) => (
        <div key={index} className={`absolute w-full ${positions[index]}`}>
          <img src={image.src} alt={image.alt} className="size-full" />
        </div>
      ))}
    </Animate>
  );

  return (
    <section
      id="relume"
      className="relative flex h-svh items-center justify-center overflow-hidden lg:h-screen"
      onMouseMove={handleMouseMove}
    >
      <div className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container max-w-lg">
          <div className="relative z-10 text-center">
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex items-center justify-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Animate className="absolute size-full" style={canvasTransform}>
        {renderImages(group1Images, imagePositions.group1, group1Transform)}
        {renderImages(group2Images, imagePositions.group2, group2Transform)}
      </Animate>
    </section>
  );
};

export const Header142Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  group1Images: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 1",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 2",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 3",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 4",
    },
  ],
  group2Images: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder image 5",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Relume placeholder image 6",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder image 7",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder image 8",
    },
  ],
};
