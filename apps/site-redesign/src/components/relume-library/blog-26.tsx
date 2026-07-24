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

type FeaturedBlogPost = BlogPost;

type SmallFeaturedBlogPost = {
  url: string;
  image: ImageProps;
  category: string;
  readTime: string;
  title: string;
  button: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  featuredBlogIitle: string;
  featuredBlogPost: FeaturedBlogPost;
  smallFeaturedBlogPosts: SmallFeaturedBlogPost[];
  latestBlogTitle: string;
  blogPosts: BlogPost[];
};

export type Blog26Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog26 = (props: Blog26Props) => {
  const {
    tagline,
    heading,
    description,
    featuredBlogIitle,
    featuredBlogPost,
    smallFeaturedBlogPosts,
    latestBlogTitle,
    blogPosts,
  } = {
    ...Blog26Defaults,
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
          <h2 className="mb-6 text-xl font-bold md:mb-10 md:text-2xl">{featuredBlogIitle}</h2>
          <div className="rb-12 grid grid-cols-1 items-start gap-x-8 sm:gap-y-14 md:mb-16 lg:mb-20 lg:grid-cols-2">
            <div className="mb-8 md:mb-0">
              <a href={featuredBlogPost.url} className="w-full">
                <img
                  src={featuredBlogPost.image.src}
                  alt={featuredBlogPost.image.alt}
                  className="mb-6 aspect-[3/2] size-full object-cover"
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
                  <a className="mb-4" href={featuredBlogPost.url}>
                    <h3 className="text-2xl font-bold md:text-3xl md:leading-[1.3] lg:text-4xl">
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
            <div className="mb-8 grid grid-cols-1 gap-y-8 md:mb-0 md:gap-y-12 lg:gap-y-8">
              {smallFeaturedBlogPosts.map((post, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-[0.5fr_1fr] md:gap-y-4"
                >
                  <a href={post.url} className="w-full">
                    <img
                      src={post.image.src}
                      alt={post.image.alt}
                      className="aspect-square w-full object-cover"
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
                      <a className="mb-2" href={post.url}>
                        <h3 className="text-xl font-bold md:text-2xl">{post.title}</h3>
                      </a>
                      <Button
                        {...featuredBlogPost.button}
                        className="mt-2 flex items-center justify-center gap-x-2"
                      >
                        {featuredBlogPost.button.title}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <h2 className="mb-6 text-xl font-bold md:mb-10 md:text-2xl">{latestBlogTitle}</h2>
          <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 md:gap-y-16">
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
                <div className="rb-4 mb-4 flex w-full items-center justify-start">
                  <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                    {blogPost.category}
                  </p>
                  <p className="inline text-sm font-semibold">{blogPost.readTime}</p>
                </div>
                <a href={post.url} className="mb-2 block max-w-full">
                  <h5 className="text-xl font-bold md:text-2xl">{post.title}</h5>
                </a>
                <p>{post.description}</p>
                <Button
                  {...featuredBlogPost.button}
                  className="mt-6 flex items-center justify-center gap-x-2"
                >
                  {featuredBlogPost.button.title}
                </Button>
              </div>
            ))}
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
  button: { title: "Read more", variant: "link", size: "link", iconRight: <RxChevronRight /> },
};

export const Blog26Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  featuredBlogIitle: "Featured blog posts",
  featuredBlogPost: blogPost,
  smallFeaturedBlogPosts: [blogPost, blogPost, blogPost],
  latestBlogTitle: "Latest blog posts",
  blogPosts: [blogPost, blogPost, blogPost, blogPost],
};
