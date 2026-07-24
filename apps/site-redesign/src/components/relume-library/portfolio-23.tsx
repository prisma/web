// @ts-nocheck
import { useRef } from "react";
import { RxChevronRight } from "react-icons/rx";
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion, useTransform, useScroll, MotionValue } from "framer-motion";

type MotionStyleWithValues = {
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
};

type ImageProps = {
  src: string;
  alt?: string;
};

type Project = {
  heading: string;
  tags: string[];
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type Props = {
  tagline: string;
  title: string;
  description: string;
  projects: Project[];
};

export type Portfolio23Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Portfolio23 = (props: Portfolio23Props) => {
  const { tagline, title, description, projects } = {
    ...Portfolio23Defaults,
    ...props,
  };

  const refs = projects.map(() => useRef(null));

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <header className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{title}</h2>
          <p className="md:text-md">{description}</p>
        </header>
        <div className="grid grid-cols-1 gap-6 md:gap-12 lg:gap-20">
          {projects.map((project, index) => {
            const { scrollYProgress } = useScroll({
              target: refs[index],
              offset: ["start end", "end start"],
            });

            const scale = useTransform(
              scrollYProgress,
              [0, 0.2, 0.7, 0.9, 1],
              [0.9, 1, 1, 0.95, 0.9],
            );
            const opacity = useTransform(
              scrollYProgress,
              [0, 0.2, 0.7, 0.9, 0.95],
              [0, 1, 1, 0.5, 0],
            );

            const style: MotionStyleWithValues = {
              scale,
              opacity,
            };

            return (
              <motion.div
                key={index}
                ref={refs[index]}
                style={style}
                className="grid grid-cols-1 gap-x-20 gap-y-6 border border-border-primary p-6 md:grid-cols-[3fr_4fr] md:gap-y-20 md:p-8 lg:p-12"
              >
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">
                      {project.heading}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                      {project.tags.map((tag, tagIndex) => (
                        <li key={tagIndex} className="flex">
                          <div className="inline-flex border border-neutral-lightest bg-neutral-lightest px-2 py-1 text-sm font-semibold text-text-primary">
                            {tag}
                          </div>
                        </li>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 md:mt-8 md:text-md">{project.description}</div>
                  <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                    {project.buttons.map((button, index) => (
                      <Button key={index} {...button}>
                        {button.title}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <img
                    src={project.image.src}
                    alt={project.image.alt}
                    className="aspect-[3/2] w-full object-cover"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="h-screen" />
    </section>
  );
};

export const Portfolio23Defaults: Props = {
  tagline: "Portfolio",
  title: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  projects: [
    {
      heading: "Project name",
      tags: ["Tag one", "Tag two", "Tag three"],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        {
          title: "Button",
          variant: "secondary",
        },
        { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image center",
      },
    },
    {
      heading: "Project name",
      tags: ["Tag one", "Tag two", "Tag three"],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        {
          title: "Button",
          variant: "secondary",
        },
        { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image center",
      },
    },
    {
      heading: "Project name",
      tags: ["Tag one", "Tag two", "Tag three"],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        {
          title: "Button",
          variant: "secondary",
        },
        { title: "Button", variant: "link", size: "link", iconRight: <RxChevronRight /> },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image center",
      },
    },
  ],
};
