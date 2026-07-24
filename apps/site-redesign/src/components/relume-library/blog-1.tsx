// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
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
  avatar: ImageProps;
  fullName: string;
  date: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  categoryLink: string;
  blogPosts: BlogPost[];
};

export type Blog1Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog1 = (props: Blog1Props) => {
  const { tagline, heading, description, buttons, categoryLink, blogPosts } = {
    ...Blog1Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="flex flex-col justify-start">
          <div className="no-scrollbar mb-12 ml-[-5vw] flex w-screen items-center justify-start overflow-scroll pl-[5vw] md:mb-16 md:ml-0 md:w-full md:justify-center md:overflow-hidden md:pl-0">
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
              <div key={index}>
                <a href={post.url} className="mb-6 inline-block w-full max-w-full">
                  <div className="w-full overflow-hidden">
                    <img
                      src={post.image.src}
                      alt={post.image.alt}
                      className="aspect-[3/2] size-full object-cover"
                    />
                  </div>
                </a>
                <a
                  href={post.url}
                  className="mb-2 mr-4 inline-block max-w-full text-sm font-semibold"
                >
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Blog1Defaults: Props = {
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
  blogPosts: [
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 1",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 1",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 2",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 2",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 3",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 3",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 4",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 4",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 5",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 5",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder image 6",
      },
      category: "Category",
      title: "Blog title heading will go here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Relume placeholder avatar 6",
      },
      fullName: "Full name",
      date: "11 Jan 2022",
      readTime: "5 min read",
    },
  ],
};
