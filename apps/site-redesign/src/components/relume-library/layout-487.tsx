// @ts-nocheck
"use client"

import { useRef, useState, useEffect } from "react";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

type ImageProps = {
  src: string;
  alt?: string;
};

type ContentBlockProps = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  contentBlocks: ContentBlockProps[];
};

export type Layout487Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout487 = (props: Layout487Props) => {
  const { tagline, heading, description, contentBlocks } = {
    ...Layout487Defaults,
    ...props,
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleVisibilityChange = (index: number, isVisible: boolean) => {
    if (isVisible) {
      setCurrentImageIndex(index);
    }
  };

  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 items-start gap-12 md:mt-0 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          <div className="relative flex w-full flex-col gap-12 md:pt-[60vh]">
            {contentBlocks.map((contentBlock, index) =>
              isMobile || index % 2 === 0 ? (
                <div key={index} className="md:h-svh">
                  <ContentBlock
                    {...contentBlock}
                    onVisibilityChange={(isVisible) => handleVisibilityChange(index, isVisible)}
                  />
                </div>
              ) : null,
            )}
          </div>
          <div className="sticky top-0 hidden h-screen w-full items-center justify-center md:flex">
            <div className="aspect-[2/3]">
              <img
                src={contentBlocks[currentImageIndex].image.src}
                alt={contentBlocks[currentImageIndex].image.alt}
                className="size-full object-cover"
              />
            </div>
          </div>
          <div className="relative hidden w-full flex-col gap-12 md:flex md:pt-[110vh]">
            {contentBlocks.map((contentBlock, index) =>
              index % 2 !== 0 ? (
                <div key={index} className="md:h-svh">
                  <ContentBlock
                    {...contentBlock}
                    onVisibilityChange={(isVisible) => handleVisibilityChange(index, isVisible)}
                  />
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContentBlock: React.FC<
  ContentBlockProps & { onVisibilityChange: (isVisible: boolean) => void }
> = (props) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.33, 0.5, 0.66, 0.83], [0, 0, 1, 1, 0]);

  useEffect(() => {
    const unsubscribe = opacity.on("change", (v) => {
      props.onVisibilityChange(v > 0.5);
    });
    return () => unsubscribe();
  }, [opacity, props.onVisibilityChange]);

  return (
    <motion.div
      ref={blockRef}
      animate={isMobile ? { opacity: 1 } : undefined}
      style={!isMobile ? ({ opacity } as { opacity: MotionValue<number> }) : undefined}
      className="flex flex-col items-start justify-center md:justify-start"
    >
      <div className="mb-8 md:hidden">
        <img src={props.image.src} alt={props.image.alt} />
      </div>
      <p className="mb-3 font-semibold md:mb-4">{props.tagline}</p>
      <h2 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
        {props.heading}
      </h2>
      <p className="md:text-md">{props.description}</p>
      <div className="mt-6 flex items-center gap-x-4 md:mt-8">
        {props.buttons.map((button, index) => (
          <Button key={index} {...button}>
            {button.title}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export const Layout487Defaults: Props = {
  tagline: "Tagline",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  contentBlocks: [
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      buttons: [
        { title: "Button", variant: "secondary" },
        { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg",
        alt: "Relume placeholder image 1",
      },
    },
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      buttons: [
        { title: "Button", variant: "secondary" },
        { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg",
        alt: "Relume placeholder image 2",
      },
    },
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      buttons: [
        { title: "Button", variant: "secondary" },
        { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg",
        alt: "Relume placeholder image 3",
      },
    },
    {
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      buttons: [
        { title: "Button", variant: "secondary" },
        { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-4.svg",
        alt: "Relume placeholder image 4",
      },
    },
  ],
};
