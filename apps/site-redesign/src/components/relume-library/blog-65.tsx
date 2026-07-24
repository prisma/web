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

export type Blog65Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog65 = (props: Blog65Props) => {
  const { tagline, heading, description, button, blogPosts } = {
    ...Blog65Defaults,
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
                <div key={index}>
                  <a href={post.url} className="mb-5 inline-block md:mb-6">
                    <div className="w-full overflow-hidden">
                      <img
                        src={post.image.src}
                        alt={post.image.alt}
                        className="aspect-[3/2] size-full object-cover"
                      />
                    </div>
                  </a>
                  <a href={post.url} className="mb-2 inline-block">
                    <span className="text-sm font-semibold">{post.category}</span>
                  </a>
                  <a href={post.url} className="mb-2 block max-w-full">
                    <h5 className="text-xl font-bold md:text-2xl">{post.title}</h5>
                  </a>
                  <p>{post.description}</p>
                  <div className="mt-5 flex items-center md:mt-6">
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
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder avatar",
  },
  fullName: "Full name",
  date: "11 Jan 2022",
};

export const Blog65Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [blogPost, blogPost, blogPost, blogPost, blogPost, blogPost],
};
