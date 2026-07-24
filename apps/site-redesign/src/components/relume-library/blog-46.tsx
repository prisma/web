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
  blogPosts: BlogPost[];
  button: ButtonProps;
};

export type Blog46Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog46 = (props: Blog46Props) => {
  const { tagline, heading, description, button, blogPosts } = {
    ...Blog46Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 lg:gap-x-12">
          {blogPosts.map((post, index) => (
            <div key={index} className="flex size-full flex-col items-center justify-start">
              <a href={post.url} className="mb-5 block sm:mb-6">
                <img
                  src={post.image.src}
                  alt={post.image.alt}
                  className="aspect-video size-full object-cover"
                />
              </a>
              <div className="rb-4 mb-3 flex w-full items-center justify-start sm:mb-4">
                <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                  {post.category}
                </p>
                <p className="text-sm font-semibold">{post.readTime}</p>
              </div>
              <div className="flex w-full flex-col items-start justify-start">
                <a className="mb-2" href={post.url}>
                  <h2 className="text-xl font-bold md:text-2xl">{post.title}</h2>
                </a>
                <p>{post.description}</p>
                <Button
                  {...post.button}
                  className="mt-5 flex items-center justify-center gap-x-2 sm:mt-6"
                >
                  {post.button.title}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-center md:mt-20">
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
  button: { title: "Read more", variant: "link", size: "link", iconRight: <RxChevronRight /> },
};

export const Blog46Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [blogPost, blogPost],
};
