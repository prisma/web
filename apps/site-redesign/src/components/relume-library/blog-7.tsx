// @ts-nocheck
"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
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

type FeaturedBlogPost = BlogPost;

type Tab = {
  value: string;
  trigger: string;
  content: BlogPost[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  featuredBlogPost: FeaturedBlogPost;
  defaultValue: string;
  tabs: Tab[];
};

export type Blog7Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog7 = (props: Blog7Props) => {
  const { tagline, heading, description, featuredBlogPost, tabs, defaultValue } = {
    ...Blog7Defaults,
    ...props,
  };
  const [activeTab, setActiveTab] = useState<string>(defaultValue);
  const MotionTabsContent = motion.create(TabsContent);

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
          <div className="rb-12 mb-12 grid grid-cols-1 items-center border border-border-primary md:mb-16 md:grid-cols-2">
            <a href={featuredBlogPost.url} className="size-full">
              <img
                src={featuredBlogPost.image.src}
                alt={featuredBlogPost.image.alt}
                className="aspect-[8/6] size-full object-cover"
              />
            </a>
            <div className="flex h-full flex-col items-start justify-between px-5 py-6 md:p-8 lg:p-12">
              <div>
                <p className="mb-2 text-sm font-semibold">{featuredBlogPost.category}</p>
                <div className="flex w-full flex-col items-start justify-start">
                  <a className="mb-2" href={featuredBlogPost.url}>
                    <h3 className="mb-2 text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl">
                      {featuredBlogPost.title}
                    </h3>
                  </a>
                  <p>{featuredBlogPost.description}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <div className="mr-4 shrink-0">
                  <img
                    src={featuredBlogPost.avatar.src}
                    alt={featuredBlogPost.avatar.alt}
                    className="size-12 min-h-12 min-w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h6 className="text-sm font-semibold">{featuredBlogPost.fullName}</h6>
                  <div className="flex items-center">
                    <p className="text-sm">{featuredBlogPost.date}</p>
                    <span className="mx-2">•</span>
                    <p className="text-sm">{featuredBlogPost.readTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col justify-start"
          >
            <TabsList className="no-scrollbar mb-12 ml-[-5vw] flex w-screen items-center overflow-auto pl-[5vw] md:mb-16 md:ml-0 md:w-full md:overflow-hidden md:pl-0">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  className="px-4 data-[state=active]:border data-[state=active]:border-border-primary data-[state=inactive]:border-transparent data-[state=active]:bg-transparent data-[state=active]:text-neutral-black"
                >
                  {tab.trigger}
                </TabsTrigger>
              ))}
            </TabsList>
            <AnimatePresence initial={false}>
              {tabs.map((tab) => {
                return (
                  <MotionTabsContent
                    key={tab.value}
                    value={tab.value}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeTab === tab.value ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
                      {tab.content.map((post, index) => (
                        <div
                          key={index}
                          className="flex size-full flex-col items-center justify-start border border-border-primary"
                        >
                          <a href={post.url} className="w-full">
                            <img
                              src={post.image.src}
                              alt={post.image.alt}
                              className="aspect-[3/2] size-full object-cover"
                            />
                          </a>
                          <div className="flex w-full flex-1 flex-col justify-between px-5 py-6 md:p-6 lg:p-6">
                            <p className="mb-2 text-sm font-semibold">{post.category}</p>
                            <div className="flex w-full flex-col items-start justify-start">
                              <a className="mb-2" href={post.url}>
                                <h2 className="text-xl font-bold md:text-2xl">{post.title}</h2>
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
                        </div>
                      ))}
                    </div>
                  </MotionTabsContent>
                );
              })}
            </AnimatePresence>
          </Tabs>
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

export const Blog7Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  featuredBlogPost: blogPost,
  tabs: [
    {
      value: "view-all",
      trigger: "View all",
      content: [blogPost, blogPost, blogPost, blogPost, blogPost, blogPost],
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
    {
      value: "category-four",
      trigger: "Category four",
      content: [blogPost, blogPost, blogPost],
    },
  ],
  defaultValue: "view-all",
};
