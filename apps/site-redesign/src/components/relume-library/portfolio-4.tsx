// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

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
  tags: Tag[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  projects: ProjectProps[];
  button: ButtonProps;
};

export type Portfolio4Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Portfolio4 = (props: Portfolio4Props) => {
  const { tagline, heading, description, projects, button } = {
    ...Portfolio4Defaults,
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

const Project: React.FC<ProjectProps> = ({ title, description, image, url, tags }) => (
  <article className="border border-border-primary">
    <div>
      <a href={url}>
        <img src={image.src} className="w-full object-cover" alt={image.alt} />
      </a>
    </div>
    <div className="grid grid-cols-1 items-start justify-between gap-6 px-5 py-6 sm:px-6 md:grid-cols-2 md:gap-12 lg:gap-20">
      <div>
        <h3 className="text-xl font-bold md:text-2xl">
          <a href={url}>{title}</a>
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2 md:mt-4">
          {tags.map((tag, index) => (
            <li key={index} className="flex">
              <a href={tag.url} className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                {tag.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p>{description}</p>
      </div>
    </div>
  </article>
);

const project = {
  title: "Project name here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
  url: "#",
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

export const Portfolio4Defaults: Props = {
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
