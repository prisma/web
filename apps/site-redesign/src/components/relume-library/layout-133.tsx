// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type SectionProps = {
  url: string;
  image: ImageProps;
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
};

type Props = {
  sections: SectionProps[];
};

export type Layout133Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout133 = (props: Layout133Props) => {
  const { sections } = { ...Layout133Defaults, ...props };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid gap-x-12 gap-y-12 md:gap-16 lg:grid-cols-2">
          {sections.map((post, index) => (
            <div key={index} className="grid grid-cols-[.5fr_1fr] gap-x-8 gap-y-6 md:gap-y-4">
              <a href={post.url} className="w-full">
                <img
                  src={post.image.src}
                  alt={post.image.alt}
                  className="aspect-square w-full object-cover"
                />
              </a>
              <div className="flex h-full flex-col items-start justify-start">
                <div className="flex w-full flex-col items-start justify-start">
                  <p className="mb-2 font-semibold">{post.tagline}</p>
                  <a className="mb-2" href={post.url}>
                    <h3 className="text-xl font-bold md:text-2xl">{post.heading}</h3>
                  </a>
                  <p>{post.description}</p>
                  {post.buttons.map((button, buttonIndex) => (
                    <Button
                      key={buttonIndex}
                      {...button}
                      className="mt-5 flex items-center justify-center gap-x-2 md:mt-6"
                    >
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Layout133Defaults: Props = {
  sections: [
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 1",
      },
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description: "Caption goes here",
      buttons: [
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
    {
      url: "#",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image 2",
      },
      tagline: "Tagline",
      heading: "Medium length section heading goes here",
      description: "Caption goes here",
      buttons: [
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
    },
  ],
};
