// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

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
  avatar: ImageProps;
  fullName: string;
  date: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  button: ButtonProps;
  blogPosts: BlogPost[];
};

export type Blog43Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog43 = (props: Blog43Props) => {
  const { tagline, heading, description, button, blogPosts } = {
    ...Blog43Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 grid grid-cols-1 items-start justify-start gap-y-8 md:mb-18 md:grid-cols-[1fr_max-content] md:items-end md:justify-between md:gap-x-12 md:gap-y-4 lg:mb-20 lg:gap-x-20">
          <div className="md:mr-12 lg:mr-0">
            <div className="w-full max-w-lg">
              <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
              <h2 className="mb-3 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl">{heading}</h2>
              <p className="md:text-md">{description}</p>
            </div>
          </div>
          <div className="hidden md:flex">
            <Button {...button}>{button.title}</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <div key={index} className="border border-border-primary">
              <a href={post.url} className="w-full max-w-full">
                <div className="w-full overflow-hidden">
                  <img
                    src={post.image.src}
                    alt={post.image.alt}
                    className="aspect-[3/2] size-full object-cover"
                  />
                </div>
              </a>
              <div className="px-5 py-6 sm:p-6">
                <a href={post.url} className="mb-2 flex text-sm font-semibold">
                  {post.category}
                </a>
                <a href={post.url} className="mb-2 block max-w-full">
                  <h5 className="text-xl font-bold md:text-2xl">{post.title}</h5>
                </a>
                <p>{post.description}</p>
                <div className="mt-6 flex items-center">
                  <div className="mr-4 shrink-0">
                    <img
                      src={post.avatar.src}
                      alt={post.avatar.alt}
                      className="size-12 min-h-12 min-w-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h6 className="text-sm font-semibold">{post.fullName}</h6>
                    <div className="flex items-center">
                      <p className="text-sm">{post.date}</p>
                      <span className="mx-2">•</span>
                      <p className="text-sm">{post.readTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button {...button} className="mt-10 md:hidden">
          {button.title}
        </Button>
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
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder avatar",
  },
  fullName: "Full name",
  date: "11 Jan 2022",
};

export const Blog43Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [blogPost, blogPost, blogPost],
};
