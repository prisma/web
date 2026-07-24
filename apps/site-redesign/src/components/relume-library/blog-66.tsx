// @ts-nocheck
"use client"

import React from "react";
import { useState, useEffect } from "react";
import type { ButtonProps, CarouselApi } from "@relume_io/relume-ui";
import clsx from "clsx";
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
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

export type Blog66Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog66 = (props: Blog66Props) => {
  const { tagline, heading, description, button, blogPosts } = {
    ...Blog66Defaults,
    ...props,
  };

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section id="relume" className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28">
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
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="ml-0">
            {blogPosts.map((post, index) => (
              <CarouselItem
                key={index}
                className="basis-[95%] pl-0 pr-6 sm:basis-[80%] md:basis-1/3 md:pr-8"
              >
                <div key={index} className="flex size-full flex-col items-center justify-start">
                  <a href={post.url} className="mb-5 inline-block md:mb-6">
                    <img
                      src={post.image.src}
                      alt={post.image.alt}
                      className="aspect-[3/2] size-full object-cover"
                    />
                  </a>
                  <div className="rb-4 mb-3 flex w-full items-center justify-start md:mb-4">
                    <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                      {post.category}
                    </p>
                    <p className="text-sm font-semibold">{post.readTime}</p>
                  </div>
                  <div className="flex w-full flex-col items-start justify-start">
                    <a href={post.url} className="mb-2">
                      <h2 className="text-xl font-bold md:text-2xl">{post.title}</h2>
                    </a>
                    <p>{post.description}</p>
                    <div className="mt-5 flex items-center justify-center gap-2 md:mt-6">
                      <Button {...post.button}>{post.button.title}</Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="rt-8 mt-12 flex items-center justify-between md:mt-20">
            <div className="mt-5 flex w-full items-start justify-start">
              {blogPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={clsx("mx-[3px] inline-block size-2 rounded-full", {
                    "bg-neutral-black": current === index + 1,
                    "bg-neutral-light": current !== index + 1,
                  })}
                />
              ))}
            </div>
            <div className="flex items-end justify-end gap-2 md:gap-4">
              <CarouselPrevious className="static right-0 top-0 size-12 -translate-y-0" />
              <CarouselNext className="static right-0 top-0 size-12 -translate-y-0" />
            </div>
          </div>
        </Carousel>
        <div className="mt-12 flex justify-end md:hidden">
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

export const Blog66Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [blogPost, blogPost, blogPost, blogPost, blogPost, blogPost],
};
