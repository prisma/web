// @ts-nocheck
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

export type Blog62Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Blog62 = (props: Blog62Props) => {
  const { tagline, heading, description, blogPosts, button } = {
    ...Blog62Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 grid grid-cols-1 items-start justify-start gap-y-8 md:mb-18 md:grid-cols-[1fr_max-content] md:items-end md:justify-between md:gap-x-12 md:gap-y-4 lg:mb-20 lg:gap-x-20">
          <div className="md:mr-12 lg:mr-0">
            <div className="w-full max-w-lg">
              <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
              <h1 className="mb-3 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl">{heading}</h1>
              <p className="md:text-md">{description}</p>
            </div>
          </div>
          <div className="hidden md:flex md:justify-end">
            <Button {...button}>{button.title}</Button>
          </div>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 items-start gap-12 md:gap-y-16 lg:grid-cols-2">
          {blogPosts.map((post, index) => (
            <div key={index}>
              <div className="flex flex-col items-start gap-x-8 gap-y-6 md:flex-row md:gap-y-4">
                <a className="w-full flex-shrink-0 flex-grow basis-2/5 overflow-hidden">
                  <img
                    src={post.image.src}
                    alt={post.image.alt}
                    className="aspect-square size-full object-cover"
                  />
                </a>
                <div className="flex w-full flex-col justify-center">
                  <div className="rb-4 mb-3 flex w-full items-center justify-start md:mb-4">
                    <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                      {post.category}
                    </p>
                    <p className="text-sm font-semibold">{post.readTime}</p>
                  </div>
                  <a className="mb-2" href={post.url}>
                    <h3 className="text-xl font-bold md:text-2xl">{post.title}</h3>
                  </a>
                  <p className="line-clamp-2">{post.description}</p>
                  <div className="mt-5 md:mt-6">
                    <Button {...post.button}>{post.button.title}</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim...",
  button: {
    title: "Read more",
    variant: "link",
    size: "link",
    iconRight: <RxChevronRight />,
  },
};

export const Blog62Defaults: Props = {
  tagline: "Blog",
  heading: "Short heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "View all", variant: "secondary" },
  blogPosts: [blogPost, blogPost, blogPost, blogPost],
};
