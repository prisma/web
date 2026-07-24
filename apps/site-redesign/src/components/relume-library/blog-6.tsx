// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import clsx from "clsx";

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

type FeaturedBlogPost = BlogPost;

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  categoryLink: string;
  featuredBlogPost: FeaturedBlogPost;
  blogPosts: BlogPost[];
};

export type Blog6Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog6 = (props: Blog6Props) => {
  const { tagline, heading, description, buttons, categoryLink, featuredBlogPost, blogPosts } = {
    ...Blog6Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="flex flex-col justify-start">
          <div className="rb-12 mb-12 grid grid-cols-1 items-center gap-6 md:mb-16 md:grid-cols-2 md:gap-12">
            <a href={featuredBlogPost.url} className="w-full">
              <img
                src={featuredBlogPost.image.src}
                alt={featuredBlogPost.image.alt}
                className="aspect-[3/2] size-full object-cover"
              />
            </a>
            <div className="flex h-full flex-col items-start justify-center">
              <div className="rb-4 mb-4 flex w-full items-center justify-start">
                <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                  {featuredBlogPost.category}
                </p>
                <p className="inline text-sm font-semibold">{featuredBlogPost.readTime}</p>
              </div>
              <div className="flex w-full flex-col items-start justify-start">
                <a className="mb-2" href={featuredBlogPost.url}>
                  <h3 className="mb-2 text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl">
                    {featuredBlogPost.title}
                  </h3>
                </a>
                <p>{featuredBlogPost.description}</p>
                <Button
                  {...featuredBlogPost.button}
                  className="mt-6 flex items-center justify-center gap-x-2"
                >
                  {featuredBlogPost.button.title}
                </Button>
              </div>
            </div>
          </div>
          <div className="no-scrollbar mb-12 ml-[-5vw] flex w-screen items-center justify-start overflow-scroll py-1 pl-[5vw] md:mb-16 md:ml-0 md:w-full md:overflow-hidden md:pl-0">
            {buttons.map((button, index) => (
              <Button
                key={index}
                {...button}
                asChild
                className={clsx("border px-4 py-2", {
                  "border-border-primary": index === 0,
                  "border-transparent": index !== 0,
                })}
              >
                <a href={categoryLink}>{button.title}</a>
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <div key={index} className="flex size-full flex-col items-center justify-start">
                <a href={post.url} className="mb-6 w-full">
                  <img
                    src={post.image.src}
                    alt={post.image.alt}
                    className="aspect-[3/2] size-full object-cover"
                  />
                </a>
                <div className="rb-4 mb-4 flex w-full items-center justify-start">
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
                    className="mt-6 flex items-center justify-center gap-x-2"
                  >
                    {post.button.title}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Blog6Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  buttons: [
    { title: "View all", variant: "secondary" },
    { title: "Category one", variant: "link" },
    { title: "Category two", variant: "link" },
    { title: "Category three", variant: "link" },
    { title: "Category four", variant: "link" },
  ],
  categoryLink: "#",
  featuredBlogPost: {
    url: "#",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
      alt: "Relume placeholder featured image",
    },
    category: "Category",
    readTime: "5 min read",
    title: "Blog title heading will go here",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    button: { title: "Read more", variant: "link", size: "link", iconRight: <RxChevronRight /> },
  },
  blogPosts: [
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 1",
      },
      category: "Category",
      readTime: "5 min read",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "Read more", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 2",
      },
      category: "Category",
      readTime: "5 min read",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "Read more", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 3",
      },
      category: "Category",
      readTime: "5 min read",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "Read more", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 4",
      },
      category: "Category",
      readTime: "5 min read",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "Read more", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 5",
      },
      category: "Category",
      readTime: "5 min read",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "Read more", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 6",
      },
      category: "Category",
      readTime: "5 min read",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      button: { title: "Read more", variant: "link", size: "link", iconRight: <RxChevronRight /> },
    },
  ],
};
