// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type HeaderProps = {
  heading: string;
  bgUrl?: string;
};

type Props = {
  headers: HeaderProps[];
  description: string;
  buttons: ButtonProps[];
};

export type Header104Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header104 = (props: Header104Props) => {
  const { headers, description, buttons } = {
    ...Header104Defaults,
    ...props,
  };
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-xl overflow-hidden text-center">
        <h1 className="mb-5 text-3xl font-bold leading-[1.2] sm:text-6xl md:mb-6 md:text-9xl lg:text-[5rem]">
          {headers.map((header, index) => (
            <span key={index}>
              {header.bgUrl ? (
                <span
                  className="bg-contain bg-no-repeat pr-16 [background-position-x:100%] [background-position-y:center] sm:pr-[5.75rem] md:pr-[7.5rem] lg:pr-[11.5rem]"
                  style={{
                    backgroundImage: `url('${header.bgUrl}')`,
                  }}
                >
                  {header.heading}
                </span>
              ) : (
                " " + header.heading + " "
              )}
            </span>
          ))}
        </h1>
        <p className="md:text-md">{description}</p>
        <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
          {buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Header104Defaults: Props = {
  headers: [
    {
      heading: "Long",
      bgUrl: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    },
    {
      heading: "heading is what you see here in this",
    },
    {
      heading: "header",
      bgUrl: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    },
    {
      heading: "section",
    },
  ],
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
