// @ts-nocheck
import React from "react";

type ImageProps = {
  src: string;
  alt?: string;
};

type Section = {
  title: string;
  image: ImageProps;
};

type Props = {
  sections: Section[];
};

export type Banner15Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner15 = (props: Banner15Props) => {
  const { sections } = {
    ...Banner15Defaults,
    ...props,
  };
  return (
    <section id="relume" className="flex w-screen max-w-full justify-end overflow-hidden">
      <div className="flex justify-end">
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="grid animate-marquee-right auto-cols-max grid-flow-col grid-cols-[max-content] items-center justify-around py-4"
            >
              {sections.map((section, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-center whitespace-nowrap px-8 text-center lg:text-left">
                    <h1 className="text-6xl font-bold md:text-9xl lg:text-10xl">{section.title}</h1>
                  </div>
                  <div className="relative aspect-[3/2] w-full overflow-hidden object-cover">
                    <img
                      src={section.image.src}
                      alt={section.image.alt}
                      className="aspect-[3/2] size-full h-16 max-h-24 object-cover md:h-auto"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          ))}
      </div>
    </section>
  );
};

export const Banner15Defaults: Props = {
  sections: [
    {
      title: "Relume Library",
      image: {
        src: "https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-image.svg",
        alt: "Relume Library",
      },
    },
    {
      title: "Relume Library",
      image: {
        src: "https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-image.svg",
        alt: "Relume Library",
      },
    },
    {
      title: "Relume Library",
      image: {
        src: "https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-image.svg",
        alt: "Relume Library",
      },
    },
    {
      title: "Relume Library",
      image: {
        src: "https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-image.svg",
        alt: "Relume Library",
      },
    },
  ],
};
