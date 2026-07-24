// @ts-nocheck
import { BiSolidStar } from "react-icons/bi";

type ImageProps = {
  src: string;
  alt?: string;
};

type Testimonial = {
  quote: string;
  avatar: ImageProps;
  name: string;
  position: string;
  companyName: string;
  numberOfStars: number;
};

type Props = {
  heading: string;
  description: string;
  testimonials: Testimonial[];
};

export type Testimonial26Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial26 = (props: Testimonial26Props) => {
  const { heading, description, testimonials } = {
    ...Testimonial26Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="columns-1 gap-x-8 after:block md:columns-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="mb-8 flex w-full break-inside-avoid flex-col items-start justify-between border border-border-primary p-6 md:p-8"
            >
              <div className="mb-5 flex md:mb-6">
                {Array(testimonial.numberOfStars)
                  .fill(null)
                  .map((_, starIndex) => (
                    <BiSolidStar key={starIndex} className="size-6" />
                  ))}
              </div>
              <blockquote className="md:text-md">{testimonial.quote}</blockquote>
              <div className="mt-5 flex w-full flex-col items-start md:mt-6 md:w-fit md:flex-row md:items-center">
                <div>
                  <img
                    src={testimonial.avatar.src}
                    alt={testimonial.avatar.alt}
                    className="mb-4 size-12 min-h-12 min-w-12 rounded-full object-cover md:mb-0 md:mr-4"
                  />
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p>
                    <span>{testimonial.position}</span>, <span>{testimonial.companyName}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonial1 = {
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial avatar 1",
  },
  name: "Name Surname",
  position: "Position",
  companyName: "Company name",
  numberOfStars: 5,
};

const testimonial2 = {
  quote:
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."',
  avatar: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Testimonial avatar 1",
  },
  name: "Name Surname",
  position: "Position",
  companyName: "Company name",
  numberOfStars: 5,
};

export const Testimonial26Defaults: Props = {
  heading: "Customer testimonials",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  testimonials: [
    testimonial1,
    testimonial1,
    testimonial1,
    testimonial2,
    testimonial2,
    testimonial1,
  ],
};
