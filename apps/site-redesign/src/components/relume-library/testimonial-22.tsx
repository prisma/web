// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Testimonial = {
  logo: ImageProps;
  quote: string;
  avatar: ImageProps;
  name: string;
  position: string;
  companyName: string;
  button: ButtonProps;
};

type Props = {
  heading: string;
  description: string;
  testimonials: Testimonial[];
};

export type Testimonial22Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial22 = (props: Testimonial22Props) => {
  const { heading, description, testimonials } = {
    ...Testimonial22Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="flex w-full flex-col items-start justify-between border border-border-primary p-6 md:p-8">
      <div className="mb-8 md:mb-10 lg:mb-12">
        <img src={testimonial.logo.src} alt={testimonial.logo.alt} className="max-h-12" />
      </div>
      <blockquote className="md:text-md">{testimonial.quote}</blockquote>
      <div className="mt-5 flex w-full flex-col items-start gap-4 md:mt-6 md:w-auto md:flex-row md:items-center">
        <div>
          <img
            src={testimonial.avatar.src}
            alt={testimonial.avatar.alt}
            className="size-12 min-h-12 min-w-12 rounded-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          <p>
            <span>{testimonial.position}</span>, <span>{testimonial.companyName}</span>
          </p>
        </div>
      </div>
      <div className="mt-6 md:mt-8">
        <Button className="py-1" {...testimonial.button}>
          {testimonial.button.title}
        </Button>
      </div>
    </div>
  );
};

const testimonial1 = {
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
    alt: "Webflow logo 1",
  },
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial avatar 1",
  },
  name: "Name Surname",
  position: "Position",
  companyName: "Company name",
  button: {
    title: "Read case study",
    variant: "link",
    size: "link",
    iconRight: <RxChevronRight />,
  },
};

const testimonial2 = {
  logo: {
    src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
    alt: "Relume logo 2",
  },
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial avatar 2",
  },
  name: "Name Surname",
  position: "Position",
  companyName: "Company name",
  button: {
    title: "Read case study",
    variant: "link",
    size: "link",
    iconRight: <RxChevronRight />,
  },
};

export const Testimonial22Defaults: Props = {
  heading: "Customer testimonials",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  testimonials: [testimonial1, testimonial2, testimonial1],
};
