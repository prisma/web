// @ts-nocheck
import { BiSolidStar } from "react-icons/bi";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Props = {
  numberOfStars: number;
  quote: string;
  avatar: ImageProps;
  name: string;
  position: string;
  logo: ImageProps;
};

export type Testimonial4Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial4 = (props: Testimonial4Props) => {
  const { numberOfStars, quote, avatar, name, position, logo } = {
    ...Testimonial4Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto w-full max-w-lg text-center">
          <div className="mb-6 flex items-center justify-center md:mb-8">
            {Array(numberOfStars)
              .fill(null)
              .map((_, starIndex) => (
                <BiSolidStar key={starIndex} className="size-6" />
              ))}
          </div>
          <blockquote className="text-xl font-bold md:text-2xl">{quote}</blockquote>
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 text-center md:mt-8 md:w-auto md:flex-row md:gap-5 md:text-left">
            <div>
              <img
                src={avatar.src}
                alt={avatar.alt}
                className="size-14 min-h-14 min-w-14 rounded-full object-cover"
              />
            </div>
            <div className="mb-4 md:mb-0">
              <p className="font-semibold">{name}</p>
              <p>{position}</p>
            </div>
            <div className="hidden w-px self-stretch bg-black md:block" />
            <div>
              <img src={logo.src} alt={logo.alt} className="max-h-12" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Testimonial4Defaults: Props = {
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
};
