// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type ProjectProps = {
  title: string;
  description: string;
  image: ImageProps;
  url: string;
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  projects: ProjectProps[];
  button: ButtonProps;
};

export type Portfolio1Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Portfolio1 = (props: Portfolio1Props) => {
  const { tagline, heading, description, projects, button } = {
    ...Portfolio1Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <header className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </header>
        <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-20">
          {projects.map((project, index) => (
            <Project key={index} {...project} />
          ))}
        </div>
        <footer className="mt-12 flex justify-center md:mt-18 lg:mt-20">
          <Button {...button}>{button.title}</Button>
        </footer>
      </div>
    </section>
  );
};

const Project: React.FC<ProjectProps> = ({ title, description, image, url, button }) => (
  <article>
    <div>
      <a href={url}>
        <img src={image.src} className="w-full object-cover" alt={image.alt} />
      </a>
    </div>
    <div className="mt-5 grid grid-cols-1 items-start justify-between justify-items-start gap-x-12 gap-y-6 md:mt-6 md:grid-cols-[1fr_max-content] lg:gap-x-20">
      <div>
        <h3 className="mb-2 text-xl font-bold md:text-2xl">
          <a href={url}>{title}</a>
        </h3>
        <p>{description}</p>
      </div>
      <div>
        <Button {...button} asChild>
          <a href={url}>{button.title}</a>
        </Button>
      </div>
    </div>
  </article>
);

const project = {
  title: "Project name here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
  url: "#",
  button: {
    title: "View project",
    variant: "link",
    size: "link",
    iconRight: <RxChevronRight />,
  },
};

export const Portfolio1Defaults: Props = {
  tagline: "Portfolio",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  projects: [project, project],
  button: {
    title: "View all",
    variant: "secondary",
    size: "primary",
  },
};
