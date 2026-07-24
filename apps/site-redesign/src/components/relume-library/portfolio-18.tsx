// @ts-nocheck
import { useRef } from "react";
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion, useInView } from "framer-motion";

type ImageProps = {
  src: string;
  alt?: string;
};

type Tag = {
  label: string;
  url: string;
};

type Project = {
  heading: string;
  image: ImageProps;
  tags: Tag[];
  button: ButtonProps;
};

type Props = {
  projects: Project[];
};

export type Portfolio18Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Portfolio18 = (props: Portfolio18Props) => {
  const { projects } = {
    ...Portfolio18Defaults,
    ...props,
  };

  const refs = projects.map(() => useRef(null));

  const isInView = refs.map((ref) =>
    useInView(ref, {
      amount: 0.33,
      once: false,
    }),
  );

  const isLeavingView = useInView(refs[refs.length - 1], {
    amount: 0,
    once: false,
  });

  return (
    <section id="relume" className="relative">
      <div>
        {projects.map((project, index) => {
          const isLastItem = index === projects.length - 1;
          const shouldBeVisible =
            isInView[index] && (!isInView[index + 1] || (isLastItem && isLeavingView));

          return (
            <div
              key={index}
              ref={refs[index]}
              className="flex h-screen items-center justify-center"
            >
              <div className="absolute inset-0">
                <motion.div
                  className="sticky top-0 h-screen w-full overflow-hidden"
                  animate={{
                    opacity: shouldBeVisible ? 1 : 0,
                  }}
                  transition={{ duration: 0 }}
                >
                  <div className="absolute inset-0 z-10 bg-black/50" />
                  <img
                    src={project.image.src}
                    alt={project.image.alt}
                    className="absolute inset-0 size-full object-cover"
                  />
                </motion.div>
              </div>
              <div className="relative z-20 px-[5%]">
                <div className="mx-auto w-full max-w-xxl">
                  <div className="py-20">
                    <div className="relative z-[2] w-full max-w-lg">
                      <div className="text-center text-text-alternative">
                        <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                          {project.heading}
                        </h2>
                        <ul className="flex flex-wrap justify-center gap-2">
                          {project.tags.map((tag, tagIndex) => (
                            <li key={tagIndex} className="flex">
                              <a
                                href={tag.url}
                                className="inline-flex border border-neutral-lightest bg-background-secondary px-2 py-1 text-sm font-semibold text-text-primary"
                              >
                                {tag.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                        <Button {...project.button} className="mt-6 h-auto text-base md:mt-8">
                          {project.button.title}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const Portfolio18Defaults: Props = {
  projects: [
    {
      heading: "Project name",
      image: {
        src: "https://assets-global.website-files.com/624380709031623bfe4aee60/626c881e91068544651ccbd0_Placeholder Image-1.svg",
        alt: "Relume placeholder image 1",
      },
      tags: [
        {
          label: "Tag one",
          url: "#",
        },
        {
          label: "Tag two",
          url: "#",
        },
        {
          label: "Tag three",
          url: "#",
        },
      ],
      button: {
        variant: "secondary-alt",
        size: "primary",
        title: "View Project",
      },
    },
    {
      heading: "Project name",
      image: {
        src: "https://assets-global.website-files.com/624380709031623bfe4aee60/626c881e9106853aea1ccbcf_Placeholder Image-2.svg",
        alt: "Relume placeholder image 2",
      },
      tags: [
        {
          label: "Tag one",
          url: "#",
        },
        {
          label: "Tag two",
          url: "#",
        },
        {
          label: "Tag three",
          url: "#",
        },
      ],
      button: {
        variant: "secondary-alt",
        size: "primary",
        title: "View Project",
      },
    },
    {
      heading: "Project name",
      image: {
        src: "https://assets-global.website-files.com/624380709031623bfe4aee60/626c881e910685d5d81ccbcd_Placeholder Image-3.svg",
        alt: "Relume placeholder image 3",
      },
      tags: [
        {
          label: "Tag one",
          url: "#",
        },
        {
          label: "Tag two",
          url: "#",
        },
        {
          label: "Tag three",
          url: "#",
        },
      ],
      button: {
        variant: "secondary-alt",
        size: "primary",
        title: "View Project",
      },
    },
  ],
};

export default Portfolio18;
