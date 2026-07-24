// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type Props = {
  headingBeforeFirstImage: string;
  firstBgUrl: string;
  heading: string;
  headingBeforeSecondImage: string;
  secondBgUrl: string;
  headingAfterSecondImage: string;
  description: string;
  buttons: ButtonProps[];
};

export type Header105Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header105 = (props: Header105Props) => {
  const {
    headingBeforeFirstImage,
    firstBgUrl,
    heading,
    headingBeforeSecondImage,
    secondBgUrl,
    headingAfterSecondImage,
    description,
    buttons,
  } = {
    ...Header105Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="w-full max-w-xl">
          <h1 className="mb-5 text-3xl font-bold leading-[1.2] sm:text-6xl md:mb-6 md:text-9xl lg:text-[5rem]">
            <span
              className="bg-contain bg-no-repeat pr-16 [background-position-x:100%] [background-position-y:center] sm:pr-[5.75rem] md:pr-[7.5rem] lg:pr-[11.5rem]"
              style={{
                backgroundImage: `url('${firstBgUrl}')`,
              }}
            >
              {headingBeforeFirstImage}
            </span>{" "}
            {heading}{" "}
            <span
              className="bg-contain bg-no-repeat pr-16 [background-position-x:100%] [background-position-y:center] sm:pr-[5.75rem] md:pr-[7.5rem] lg:pr-[11.5rem]"
              style={{
                backgroundImage: `url('${secondBgUrl}')`,
              }}
            >
              {headingBeforeSecondImage}
            </span>{" "}
            {headingAfterSecondImage}
          </h1>
          <p className="md:text-md">{description}</p>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header105Defaults: Props = {
  headingBeforeFirstImage: "Long",
  heading: "heading is what you see here in this",
  headingBeforeSecondImage: "header",
  headingAfterSecondImage: "section",
  firstBgUrl: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
  secondBgUrl: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [
    {
      title: "Button",
    },
    {
      title: "Button",
      variant: "secondary",
    },
  ],
};
