// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Tag = {
  label: string;
  url: string;
};

type ProjectProps = {
  title: string;
  description: string;
  image: ImageProps;
  url: string;
  button: ButtonProps;
  tags: Tag[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  projects: ProjectProps[];
  button: ButtonProps;
};

export type Portfolio15Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Portfolio15 = (props: Portfolio15Props) => {
  const { tagline, heading, description, projects, button } = {
    ...Portfolio15Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <header className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </header>
        <div>
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

const Project: React.FC<ProjectProps> = ({ title, description, image, url, button, tags }) => (
  <article className="grid grid-cols-1 items-center gap-x-12 gap-y-6 border-t border-border-primary py-8 md:grid-cols-2 md:gap-y-0 lg:gap-x-[4.9rem] lg:py-12">
    <div>
      <h3 className="mb-2 text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl">
        <a href={url}>{title}</a>
      </h3>
      <p>{description}</p>
      <ul className="mt-3 flex flex-wrap gap-2 md:mt-4">
        {tags.map((tag, index) => (
          <li key={index} className="flex">
            <a href={tag.url} className="bg-background-secondary px-2 py-1 text-sm font-semibold">
              {tag.label}
            </a>
          </li>
        ))}
      </ul>
      <Button {...button} asChild className="mt-6 md:mt-8">
        <a href={url}>{button.title}</a>
      </Button>
    </div>
    <div>
      <a href={url} className="flex aspect-[4/3] w-full">
        <img src={image.src} className="w-full object-cover" alt={image.alt} />
      </a>
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
};

export const Portfolio15Defaults: Props = {
  tagline: "Portfolio",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  projects: [project, project, project],
  button: {
    title: "View all",
    variant: "secondary",
    size: "primary",
  },
};
