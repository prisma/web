// @ts-nocheck
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@relume_io/relume-ui";
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

export type Blog22Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog22 = (props: Blog22Props) => {
  const { tagline, heading, description, tabs } = {
    ...Blog22Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="rb-12 mb-12 grid grid-cols-1 items-center gap-6 md:mb-16 md:grid-cols-2 md:gap-12">
          <a href={blogPost.url} className="w-full">
            <img
              src={blogPost.image.src}
              alt={blogPost.image.alt}
              className="aspect-[3/2] size-full object-cover"
            />
          </a>
          <div className="flex h-full flex-col items-start justify-center">
            <div className="rb-4 mb-4 flex w-full items-center justify-start">
              <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                {blogPost.category}
              </p>
              <p className="inline text-sm font-semibold">{blogPost.readTime}</p>
            </div>
            <div className="flex w-full flex-col items-start justify-start">
              <a className="mb-2" href={blogPost.url}>
                <h3 className="mb-2 text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl">
                  {blogPost.title}
                </h3>
              </a>
              <p>{blogPost.description}</p>
              <Button
                {...blogPost.button}
                className="mt-6 flex items-center justify-center gap-x-2"
              >
                {blogPost.button.title}
              </Button>
            </div>
          </div>
        </div>
        <Tabs defaultValue={tabs[0].value} className="flex flex-col justify-center">
          <TabsList className="no-scrollbar mb-12 flex w-full items-center justify-start overflow-auto md:mb-16 md:ml-0 md:w-full md:overflow-hidden md:pl-0">
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
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:animate-tabs"
            >
              <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-2">
                {tab.content.map((post, index) => (
                  <div key={index}>
                    <a href={post.url} className="mb-6 inline-block w-full max-w-full">
                      <div className="w-full overflow-hidden">
                        <img
                          src={post.image.src}
                          alt={post.image.alt}
                          className="aspect-video size-full object-cover"
                        />
                      </div>
                    </a>
                    <div className="rb-4 mb-4 flex w-full items-center justify-start">
                      <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                        {post.category}
                      </p>
                      <p className="inline text-sm font-semibold">{post.readTime}</p>
                    </div>
                    <a href={post.url} className="mb-2 block max-w-full">
                      <h5 className="text-xl font-bold md:text-2xl">{post.title}</h5>
                    </a>
                    <p>{post.description}</p>
                    <Button
                      {...post.button}
                      className="mt-6 flex items-center justify-center gap-x-2"
                    >
                      {post.button.title}
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
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

export const Blog22Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  featuredBlogPost: blogPost,
  tabs: [
    {
      value: "view-all",
      trigger: "View all",
      content: [blogPost, blogPost, blogPost, blogPost],
    },
    {
      value: "category-one",
      trigger: "Category one",
      content: [blogPost, blogPost, blogPost, blogPost],
    },
    {
      value: "category-two",
      trigger: "Category two",
      content: [blogPost, blogPost, blogPost, blogPost],
    },
    {
      value: "category-three",
      trigger: "Category three",
      content: [blogPost, blogPost, blogPost, blogPost],
    },
    {
      value: "category-four",
      trigger: "Category four",
      content: [blogPost, blogPost, blogPost, blogPost],
    },
  ],
  defaultValue: "view-all",
};
