// @ts-nocheck
import { BiSolidStar } from "react-icons/bi";

type ImageProps = {
  src: string;
  alt?: string;
};

type Testimonial = {
  numberOfStars: number;
  quote: string;
  avatar: ImageProps;
  name: string;
  position: string;
  logo: ImageProps;
};

type Props = {
  heading: string;
  description: string;
  testimonials: Testimonial[];
};

export type Testimonial5Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial5 = (props: Testimonial5Props) => {
  const { heading, description, testimonials } = {
    ...Testimonial5Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 w-full md:mb-18 lg:mb-20">
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 lg:gap-16">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonial = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex h-full max-w-lg flex-col items-start justify-start text-left">
    <div className="mb-6 flex md:mb-8">
      {Array(testimonial.numberOfStars)
        .fill(null)
        .map((_, starIndex) => (
          <BiSolidStar key={starIndex} className="size-6" />
        ))}
    </div>
    <blockquote className="text-md font-bold leading-[1.4] md:text-xl">
      {testimonial.quote}
    </blockquote>
    <div className="mt-6 flex w-full flex-col gap-3 md:mt-8 md:w-auto md:flex-row md:items-center md:gap-5">
      <div>
        <img
          src={testimonial.avatar.src}
          alt={testimonial.avatar.alt}
          className="size-14 min-h-14 min-w-14 rounded-full object-cover"
        />
      </div>
      <div className="mb-4 md:mb-0">
        <p className="font-semibold">{testimonial.name}</p>
        <p>{testimonial.position}</p>
      </div>
      <div className="hidden w-px self-stretch bg-black md:block" />
      <div>
        <img src={testimonial.logo.src} alt={testimonial.logo.alt} className="max-h-12" />
      </div>
    </div>
  </div>
);

export const Testimonial5Defaults: Props = {
  heading: "Customer testimonials",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  testimonials: [
    {
      numberOfStars: 5,
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 1",
      },
      name: "Name Surname",
      position: "Position, Company name",
      logo: {
        src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
        alt: "Webflow logo 1",
      },
    },
    {
      numberOfStars: 5,
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."',
      avatar: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
        alt: "Testimonial avatar 2",
      },
      name: "Name Surname",
      position: "Position, Company name",
      logo: {
        src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
        alt: "Webflow logo 2",
      },
    },
  ],
};
