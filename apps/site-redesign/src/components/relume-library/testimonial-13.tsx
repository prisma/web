// @ts-nocheck
import React from "react";
import { BiSolidStar } from "react-icons/bi";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  numberOfStars: number;
  quote: string;
  image: ImageProps;
  name: string;
  position: string;
  logo: ImageProps;
};

export type Testimonial13Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial13 = (props: Testimonial13Props) => {
  const { numberOfStars, quote, image, name, position, logo } = {
    ...Testimonial13Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid w-full auto-cols-fr grid-cols-1 items-center justify-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-x-20">
          <div className="order-last md:order-first">
            <img src={image.src} alt={image.alt} className="aspect-square w-full object-cover" />
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-6 flex md:mb-8">
              {Array(numberOfStars)
                .fill(null)
                .map((_, starIndex) => (
                  <BiSolidStar key={starIndex} className="size-6" />
                ))}
            </div>
            <blockquote className="text-xl font-bold md:text-2xl">{quote}</blockquote>
            <div className="mt-6 flex flex-nowrap items-center gap-5 md:mt-8">
              <div>
                <p className="font-semibold">{name}</p>
                <p>{position}</p>
              </div>
              <div className="mx-4 w-px self-stretch bg-background-alternative sm:mx-0" />
              <div>
                <img src={logo.src} alt={logo.alt} className="max-h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Testimonial13Defaults: Props = {
  numberOfStars: 5,
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."',
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial image 1",
  },
  name: "Name Surname",
  position: "Position, Company name",
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
    alt: "Webflow logo 1",
  },
};
