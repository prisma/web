// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Project = {
  heading: string;
  description: string;
  image: ImageProps;
  button: ButtonProps;
};

type Props = {
  projects: Project[];
};

export type Portfolio17Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Portfolio17 = (props: Portfolio17Props) => {
  const { projects } = {
    ...Portfolio17Defaults,
    ...props,
  };

  return (
    <section id="relume">
      {projects.map((project, index) => (
        <div key={index} className="sticky top-0 flex h-screen items-center justify-center px-[5%]">
          <div className="absolute inset-0">
            <img
              src={project.image.src}
              alt={project.image.alt}
              className="size-full object-cover"
            />
            <span className="absolute inset-0 z-10 bg-black/50" />
          </div>
          <div className="relative z-20 mx-auto flex max-w-lg flex-col items-center text-center text-text-alternative md:text-md">
            <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">{project.heading}</h2>
            <p className="mt-5 md:mt-6">{project.description}</p>
            <Button {...project.button} className="mt-6 h-12 text-base md:mt-8">
              {project.button.title}
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
};

export const Portfolio17Defaults: Props = {
  projects: [
    {
      heading: "Project name here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image: {
        src: "https://assets-global.website-files.com/624380709031623bfe4aee60/626c881e91068544651ccbd0_Placeholder Image-1.svg",
        alt: "Relume placeholder image 1",
      },
      button: {
        variant: "secondary-alt",
        size: "primary",
        title: "View project",
      },
    },
    {
      heading: "Project name here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image: {
        src: "https://assets-global.website-files.com/624380709031623bfe4aee60/626c881e9106853aea1ccbcf_Placeholder Image-2.svg",
        alt: "Relume placeholder image 2",
      },
      button: {
        variant: "secondary-alt",
        size: "primary",
        title: "View project",
      },
    },
    {
      heading: "Project name here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image: {
        src: "https://assets-global.website-files.com/624380709031623bfe4aee60/626c881e910685d5d81ccbcd_Placeholder Image-3.svg",
        alt: "Relume placeholder image 3",
      },
      button: {
        variant: "secondary-alt",
        size: "primary",
        title: "View project",
      },
    },
  ],
};
