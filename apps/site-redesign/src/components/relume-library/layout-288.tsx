// @ts-nocheck
import { Button, ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";

type SectionProps = {
  heading: string;
  description: string;
  button: ButtonProps;
};

type Props = {
  sections: SectionProps[];
};

export type Layout288Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout288 = (props: Layout288Props) => {
  const { sections } = {
    ...Layout288Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-start justify-items-center gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4">
          {sections.map((section, index) => (
            <div key={index} className="w-full text-center">
              <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">{section.heading}</h3>
              <p>{section.description}</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
                <Button {...section.button}>{section.button.title}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Layout288Defaults: Props = {
  sections: [
    {
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      button: {
        title: "Button",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      button: {
        title: "Button",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      button: {
        title: "Button",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      heading: "Medium length section heading goes here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      button: {
        title: "Button",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
  ],
};
