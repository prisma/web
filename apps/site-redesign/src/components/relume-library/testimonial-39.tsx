// @ts-nocheck
import clsx from "clsx";
import { BiSolidStar } from "react-icons/bi";

type ImageProps = {
  src: string;
  alt?: string;
};

type LogoCardProps = {
  logo: ImageProps;
};

type QuoteCardProps = {
  numberOfStars: number;
  quote: string;
  image: ImageProps;
  name: string;
  position: string;
  companyName: string;
};

type Props = {
  heading: string;
  description: string;
  testimonialCards: (
    | { component: "logo"; props: LogoCardProps }
    | { component: "quote"; props: QuoteCardProps }
  )[];
};

export type Testimonial39Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial39 = (props: Testimonial39Props) => {
  const { heading, description, testimonialCards } = {
    ...Testimonial39Defaults,
    ...props,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="gid-cols-1 grid gap-6 sm:grid-rows-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:grid-rows-2">
          {testimonialCards.map((card, index) =>
            card.component === "logo" ? (
              <LogoCard key={index} {...card.props} />
            ) : (
              <QuoteCard
                key={index}
                className={clsx({
                  "order-last lg:order-none": index === 2,
                })}
                {...card.props}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
};

const LogoCard = ({ logo }: LogoCardProps) => (
  <div className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6">
    <img src={logo.src} alt={logo.alt} className="max-h-12" />
  </div>
);

const QuoteCard = ({
  numberOfStars,
  quote,
  image,
  name,
  position,
  companyName,
  className,
}: QuoteCardProps & { className?: string }) => (
  <div
    className={clsx(
      "order-first flex flex-col items-start justify-between border border-border-primary p-6 sm:col-span-2 md:p-8 lg:order-none",
      className,
    )}
  >
    <div className="mb-5 flex md:mb-6">
      {Array(numberOfStars)
        .fill(null)
        .map((_, index) => (
          <BiSolidStar key={index} className="size-6" />
        ))}
    </div>
    <blockquote className="md:text-md">{quote}</blockquote>
    <div className="mt-5 flex w-full flex-col items-start md:mt-6 md:w-fit md:flex-row md:items-center">
      <div>
        <img
          src={image.src}
          alt={image.alt}
          className="mb-4 size-12 min-h-12 min-w-12 rounded-full object-cover md:mb-0 md:mr-4"
        />
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p>
          <span>{position}</span>, <span>{companyName}</span>
        </p>
      </div>
    </div>
  </div>
);

export const Testimonial39Defaults: Props = {
  heading: "Customer testimonials",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  testimonialCards: [
    {
      component: "logo",
      props: {
        logo: {
          src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
          alt: "Relume logo 1",
        },
      },
    },
    {
      component: "quote",
      props: {
        numberOfStars: 5,
        quote:
          '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Testimonial image 1",
        },
        name: "Name Surname",
        position: "Position",
        companyName: "Company name",
      },
    },
    {
      component: "logo",
      props: {
        logo: {
          src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
          alt: "Webflow logo 1",
        },
      },
    },
    {
      component: "logo",
      props: {
        logo: {
          src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
          alt: "Webflow logo 2",
        },
      },
    },
    {
      component: "logo",
      props: {
        logo: {
          src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
          alt: "Relume logo 2",
        },
      },
    },
    {
      component: "logo",
      props: {
        logo: {
          src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg",
          alt: "Webflow logo 3",
        },
      },
    },
    {
      component: "logo",
      props: {
        logo: {
          src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg",
          alt: "Relume logo 3",
        },
      },
    },
  ],
};
