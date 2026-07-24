// @ts-nocheck
"use client"
import * as React from "react";
import { ButtonProps } from "@relume_io/relume-ui";
import { Button } from "@relume_io/relume-ui";
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

export type Blog56Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog56 = (props: Blog56Props) => {
  const { tagline, heading, description, blogPosts, button } = {
    ...Blog56Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="flex flex-col justify-start">
          <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:gap-y-16 lg:grid-cols-2">
            {blogPosts.map((post, index) => (
              <div key={index} className="grid gap-x-8 gap-y-6 md:grid-cols-[.75fr_1fr] md:gap-y-4">
                <a href={post.url} className="w-full">
                  <img
                    src={post.image.src}
                    alt={post.image.alt}
                    className="aspect-square w-full object-cover"
                  />
                </a>
                <div className="flex h-full flex-col items-start justify-start">
                  <div className="rb-4 mb-3 flex w-full items-center justify-start md:mb-4">
                    <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                      {post.category}
                    </p>
                    <p className="inline text-sm font-semibold">{post.readTime}</p>
                  </div>{" "}
                  <div className="flex w-full flex-col items-start justify-start">
                    <a className="mb-2" href={post.url}>
                      <h3 className="text-xl font-bold md:text-2xl">{post.title}</h3>
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
          <div className="flex items-center justify-end">
            <Button {...button} className="mt-10 md:mt-14 lg:mt-16">
              {button.title}
            </Button>
          </div>
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim...",
  button: {
    title: "Read more",
    variant: "link",
    size: "link",
    iconRight: <RxChevronRight />,
  },
};

export const Blog56Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [blogPost, blogPost, blogPost, blogPost],
};
