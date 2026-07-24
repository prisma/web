// @ts-nocheck
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, easeInOut, easeOut } from "framer-motion";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Project = {
  heading: string;
  imageCenter: ImageProps;
  imageLeft: ImageProps;
  imageRight: ImageProps;
  tags: string[];
};

type Props = {
  projects: Project[];
};

export type Portfolio21Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Portfolio21 = (props: Portfolio21Props) => {
  const { projects } = {
    ...Portfolio21Defaults,
    ...props,
  };

  const transformRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: transformRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
  });

  const computedStyles = projects.map((_, index) => {
    const blockOffset = projects.length ? index / projects.length : 0;
    return {
      headerStyles: {
        opacity: useTransform(
          smoothProgress,
          [0.0045 + blockOffset, 0.022 + blockOffset, 0.06 + blockOffset, 0.082 + blockOffset],
          [0, 1, 1, 0],
          { ease: easeInOut },
        ),
        scale: useTransform(
          smoothProgress,
          [0 + blockOffset, 0.022 + blockOffset, 0.06 + blockOffset, 0.082 + blockOffset],
          [0.9, 1, 1, 0.9],
          { ease: easeInOut },
        ),
      },
      imageLeftStyles: {
        y: useTransform(
          smoothProgress,
          [0.17 + blockOffset, 0.25 + blockOffset],
          ["0vh", "-200vh"],
          { ease: easeOut },
        ),
      },
      imageRightStyles: {
        y: useTransform(
          smoothProgress,
          [0.2 + blockOffset, 0.28 + blockOffset],
          ["0vh", "-200vh"],
          { ease: easeOut },
        ),
      },
    };
  });

  return (
    <section id="relume" className="relative px-[5%]">
      <div ref={transformRef} className="container">
        <div className="py-12 md:py-16 lg:py-20">
          {projects.map((project, index) => {
            return (
              <div
                key={index}
                className={clsx("relative flex h-[500vh] flex-col", {
                  "mt-[-40vh]": index > 0,
                })}
              >
                <motion.div
                  className="sticky top-0 flex h-[150vh] justify-center"
                  style={computedStyles[index].headerStyles}
                >
                  <div className="absolute top-[50vh] -z-10 flex w-full max-w-lg flex-col items-center text-center">
                    <h3 className="text-5xl font-bold md:text-7xl lg:text-8xl">
                      {project.heading}
                    </h3>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <li key={tagIndex} className="flex">
                          <div className="inline-flex border border-neutral-lightest bg-background-secondary px-2 py-1 text-sm font-semibold text-text-primary">
                            {tag}
                          </div>
                        </li>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <div className="sticky top-0 z-10 flex h-screen items-center justify-center overflow-hidden">
                  <a href="#" className="inline-block max-w-full">
                    <div className="flex h-screen w-full max-w-lg items-center justify-center overflow-hidden">
                      <img
                        src={project.imageCenter.src}
                        alt={project.imageCenter.alt}
                        className="size-full object-contain"
                      />
                    </div>
                  </a>
                  <div className="absolute inset-y-0 left-0 right-auto z-20 hidden h-screen w-full max-w-xxs lg:flex">
                    <motion.div
                      className="relative w-full pt-[100vh]"
                      style={computedStyles[index].imageLeftStyles}
                    >
                      <img
                        src={project.imageLeft.src}
                        alt={project.imageLeft.alt}
                        className="w-full object-contain"
                      />
                    </motion.div>
                  </div>
                  <div className="absolute inset-y-0 left-auto right-0 z-20 hidden h-screen w-full max-w-xxs lg:flex">
                    <motion.div
                      className="relative w-full pt-[100vh]"
                      style={computedStyles[index].imageRightStyles}
                    >
                      <img
                        src={project.imageRight.src}
                        alt={project.imageRight.alt}
                        className="w-full object-contain"
                      />
                    </motion.div>
                  </div>
                </div>

                <div className="absolute inset-0 -z-10 mt-[100vh]" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-screen" />
    </section>
  );
};

export const Portfolio21Defaults: Props = {
  projects: [
    {
      heading: "Project name",
      tags: ["Tag one", "Tag two", "Tag three"],
      imageCenter: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image center",
      },
      imageLeft: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image left",
      },
      imageRight: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image right",
      },
    },
    {
      heading: "Project name",
      tags: ["Tag one", "Tag two", "Tag three"],
      imageCenter: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image center",
      },
      imageLeft: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image left",
      },
      imageRight: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image right",
      },
    },
    {
      heading: "Project name",
      tags: ["Tag one", "Tag two", "Tag three"],
      imageCenter: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image center",
      },
      imageLeft: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image left",
      },
      imageRight: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image right",
      },
    },
  ],
};
