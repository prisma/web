// @ts-nocheck
"use client"

import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";

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

type BlogSelect = {
  value: string;
  trigger: string;
  content: BlogPost[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  defaultValue: string;
  selects: BlogSelect[];
};

export type Blog31Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog31 = (props: Blog31Props) => {
  const { tagline, heading, description, selects, defaultValue } = {
    ...Blog31Defaults,
    ...props,
  };

  const [activeSelect, setActiveSelect] = useState<string>(defaultValue);

  const currentSelect = selects.find((select) => select.value === activeSelect);

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container flex max-w-lg flex-col">
        <div className="mb-12 text-center md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="flex flex-col justify-start">
          <div className="mb-10">
            <Select value={activeSelect} onValueChange={setActiveSelect}>
              <SelectTrigger className="min-w-[12.5rem] px-4 py-2 md:w-auto">
                {currentSelect ? currentSelect.trigger : "Select Category"}
              </SelectTrigger>

              <SelectContent>
                {selects.map((select, index) => (
                  <SelectItem key={index} value={select.value}>
                    {select.trigger}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AnimatePresence mode="wait">
            {currentSelect && (
              <motion.div
                key={currentSelect.value}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:gap-y-16">
                  {currentSelect.content.map((post, index) => (
                    <div
                      key={index}
                      className="grid gap-x-8 gap-y-6 md:grid-cols-[.5fr_1fr] md:gap-x-10 md:gap-y-4"
                    >
                      <a href={post.url} className="w-full">
                        <img
                          src={post.image.src}
                          alt={post.image.alt}
                          className="aspect-square w-full object-cover"
                        />
                      </a>
                      <div className="flex h-full flex-col items-start justify-center">
                        <p className="mb-2 text-sm font-semibold">{post.category}</p>
                        <div className="flex w-full flex-col items-start justify-start">
                          <a className="mb-2" href={post.url}>
                            <h3 className="text-xl font-bold md:text-2xl">{post.title}</h3>
                          </a>
                          <p>{post.description}</p>
                          <div className="mt-4 flex items-center">
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
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder avatar",
  },
  fullName: "Full name",
  date: "11 Jan 2022",
};

export const Blog31Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  selects: [
    {
      value: "all-posts",
      trigger: "All Posts",
      content: [blogPost, blogPost, blogPost],
    },
    {
      value: "category-one",
      trigger: "Category one",
      content: [blogPost, blogPost, blogPost],
    },
    {
      value: "category-two",
      trigger: "Category two",
      content: [blogPost, blogPost, blogPost],
    },
    {
      value: "category-three",
      trigger: "Category three",
      content: [blogPost, blogPost, blogPost],
    },
    {
      value: "category-four",
      trigger: "Category four",
      content: [blogPost, blogPost, blogPost],
    },
  ],
  defaultValue: "all-posts",
};
