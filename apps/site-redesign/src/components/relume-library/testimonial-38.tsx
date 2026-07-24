// @ts-nocheck
import { Button, ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import { BiSolidStar } from "react-icons/bi";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type BackgroundImageCardProps = {
  backgroundImage: ImageProps;
  heading: string;
  button: ButtonProps;
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
    | { component: "background"; props: BackgroundImageCardProps }
    | { component: "logo"; props: LogoCardProps }
    | { component: "quote"; props: QuoteCardProps }
  )[];
};

export type Testimonial38Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Testimonial38 = (props: Testimonial38Props) => {
  const { heading, description, testimonialCards } = {
    ...Testimonial38Defaults,
    ...props,
  };

  let backgroundImageCardCount = 0;
  let logoCardCount = 0;

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-rows-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:grid-rows-3">
          {testimonialCards.map((card, index) => {
            if (card.component === "background") {
              backgroundImageCardCount++;
              return (
                <BackgroundImageCard
                  key={index}
                  backgroundImageCardCount={backgroundImageCardCount}
                  {...card.props}
                />
              );
            } else if (card.component === "logo") {
              logoCardCount++;
              return <LogoCard key={index} logoCardCount={logoCardCount} {...card.props} />;
            } else if (card.component === "quote") {
              return <QuoteCard key={index} {...card.props} />;
            }
            return null;
          })}
        </div>
      </div>
    </section>
  );
};

const BackgroundImageCard = ({
  backgroundImage,
  heading,
  button,
  backgroundImageCardCount,
}: BackgroundImageCardProps & { backgroundImageCardCount: number }) => (
  <div
    className={clsx(
      "relative p-6 md:p-8 lg:p-6",
      backgroundImageCardCount === 2 && "sm:col-start-2 sm:row-start-2 lg:col-auto lg:row-auto",
      backgroundImageCardCount === 3 && "sm:col-start-1 sm:row-start-5 lg:col-auto lg:row-auto",
    )}
  >
    <div className="relative z-10 flex h-full flex-col items-start justify-between">
      <h3 className="text-2xl font-bold text-text-alternative md:text-3xl md:leading-[1.3] lg:text-4xl">
        {heading}
      </h3>
      <div className="mt-6 md:mt-8">
        <Button {...button}>{button.title}</Button>
      </div>
    </div>
    <div className="absolute inset-0 z-0">
      <img src={backgroundImage.src} className="size-full object-cover" alt={backgroundImage.alt} />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  </div>
);

const LogoCard = ({ logo, logoCardCount }: LogoCardProps & { logoCardCount: number }) => (
  <div
    className={clsx(
      "flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6",
      logoCardCount === 3 && "sm:col-start-1 sm:row-start-4 lg:col-auto lg:row-auto",
    )}
  >
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
}: QuoteCardProps) => (
  <div className="flex flex-col items-start justify-between border border-border-primary p-6 sm:col-span-2 md:p-8">
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

export const Testimonial38Defaults: Props = {
  heading: "Customer testimonials",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  testimonialCards: [
    {
      component: "background",
      props: {
        backgroundImage: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Relume placeholder image 1",
        },
        heading: "Short heading goes here",
        button: {
          title: "Button",
          variant: "link-alt",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      },
    },
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
      component: "background",
      props: {
        backgroundImage: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Relume placeholder image 2",
        },
        heading: "Short heading goes here",
        button: {
          title: "Button",
          variant: "link-alt",
          size: "link",
          iconRight: <RxChevronRight />,
        },
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
      component: "quote",
      props: {
        numberOfStars: 5,
        quote:
          '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."',
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Testimonial image 2",
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
      component: "background",
      props: {
        backgroundImage: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Relume placeholder image 4",
        },
        heading: "Short heading goes here",
        button: {
          title: "Button",
          variant: "link-alt",
          size: "link",
          iconRight: <RxChevronRight />,
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
    {
      component: "background",
      props: {
        backgroundImage: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "Relume placeholder image 3",
        },
        heading: "Short heading goes here",
        button: {
          title: "Button",
          variant: "link-alt",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      },
    },
  ],
};
