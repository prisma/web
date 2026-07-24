// @ts-nocheck
"use client"

import { useRef } from "react";
import { MotionStyle, MotionValue, motion, useScroll, useTransform } from "framer-motion";

type ImageProps = {
  src: string;
  alt?: string;
};

type FeatureSectionProps = {
  icon: ImageProps;
  title: string;
  description: string;
};

type Props = {
  heading: string;
  featureSections: FeatureSectionProps[];
};

export type Layout418Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout418 = (props: Layout418Props) => {
  const { heading, featureSections } = {
    ...Layout418Defaults,
    ...props,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  return (
    <section id="relume" ref={containerRef}>
      <div className="container">
        <div className="relative h-[300svh] lg:h-[300vh]">
          <div className="sticky top-0 grid h-svh grid-cols-1 content-center items-center justify-center px-[5%] md:flex md:content-normal md:px-0 lg:h-screen">
            <div className="absolute left-0 right-0 top-0 flex w-full justify-center overflow-hidden pt-20 md:inset-auto md:pt-0">
              <h1 className="whitespace-nowrap text-9xl font-bold sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem]">
                {heading}
              </h1>
            </div>
            <div className="sticky top-0 mx-auto mt-12 flex min-h-[24.5rem] w-full max-w-sm flex-col items-center justify-center sm:mt-24 md:relative lg:mt-0">
              {featureSections.map((section, index) => (
                <FeatureSection
                  key={index}
                  section={section}
                  index={index}
                  totalSections={featureSections.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 mt-[100vh]" />
    </section>
  );
};

const FeatureSection = ({
  section,
  index,
  totalSections,
  scrollYProgress,
}: {
  section: FeatureSectionProps;
  index: number;
  totalSections: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const sectionScrollStart = index / totalSections;
  const sectionScrollEnd = (index + 1) / totalSections;

  const rotate = useTransform(
    scrollYProgress,
    [sectionScrollStart, sectionScrollEnd],
    [0 + index * 3, -30],
  );

  const translateY = useTransform(
    scrollYProgress,
    [sectionScrollStart, sectionScrollEnd],
    ["0vh", "-120vh"],
  );

  const translateX = useTransform(
    scrollYProgress,
    [sectionScrollStart, sectionScrollEnd],
    ["0vw", "-10vw"],
  );

  return (
    <motion.div
      className="absolute mx-6 flex flex-col justify-between border border-border-primary bg-background-primary p-8 md:mx-0"
      style={
        {
          rotate: index === totalSections - 1 ? "6deg" : rotate,
          translateY: index === totalSections - 1 ? undefined : translateY,
          translateX: index === totalSections - 1 ? undefined : translateX,
          zIndex: totalSections - index,
        } as MotionStyle
      }
    >
      <div className="rb-6 mb-6 md:mb-8">
        <img src={section.icon.src} alt={section.icon.alt} className="size-12" />
      </div>
      <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">{section.title}</h3>
      <p>{section.description}</p>
    </motion.div>
  );
};

export const Layout418Defaults: Props = {
  heading: "Heading here",
  featureSections: [
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume logo 1",
      },
      title: "Subheading one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume logo 2",
      },
      title: "Subheading two",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Relume logo 3",
      },
      title: "Subheading three",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    },
  ],
};
