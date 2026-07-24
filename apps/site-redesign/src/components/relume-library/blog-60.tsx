// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type BlogPost = {
  url: string;
  image: ImageProps;
  category: string;
  readTime: string;
  title: string;
  description: string;
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  button: ButtonProps;
  blogPosts: BlogPost[];
};

export type Blog60Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog60 = (props: Blog60Props) => {
  const { tagline, heading, description, button, blogPosts } = {
    ...Blog60Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 grid grid-cols-1 items-start justify-start gap-y-8 md:mb-18 md:grid-cols-[1fr_max-content] md:items-end md:justify-between md:gap-x-12 md:gap-y-4 lg:mb-20 lg:gap-x-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-3 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
          <div className="hidden flex-wrap items-center justify-end md:block">
            <Button {...button}>{button.title}</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 lg:gap-x-12">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="flex size-full flex-col items-center justify-start border border-border-primary"
            >
              <a href={post.url} className="w-full">
                <img
                  src={post.image.src}
                  alt={post.image.alt}
                  className="aspect-video size-full object-cover"
                />
              </a>
              <div className="px-5 py-6 md:p-6">
                <div className="rb-4 mb-3 flex w-full items-center justify-start md:mb-4 ">
                  <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                    {post.category}
                  </p>
                  <p className="inline text-sm font-semibold">{post.readTime}</p>
                </div>
                <div className="flex w-full flex-col items-start justify-start">
                  <a className="mb-2" href={post.url}>
                    <h2 className="text-xl font-bold md:text-2xl">{post.title}</h2>
                  </a>
                  <p>{post.description}</p>
                  <Button
                    {...post.button}
                    className="mt-5 flex items-center justify-center gap-x-2 md:mt-6"
                  >
                    {post.button.title}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-end md:hidden">
          <Button {...button}>{button.title}</Button>
        </div>
      </div>
    </section>
  );
};

const blogPost: BlogPost = {
  url: "#",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
  category: "Category",
  readTime: "5 min read",
  title: "Blog title heading will go here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
  button: {
    title: "Read more",
    variant: "link",
    size: "link",
    iconRight: <RxChevronRight />,
  },
};

export const Blog60Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [blogPost, blogPost],
};
