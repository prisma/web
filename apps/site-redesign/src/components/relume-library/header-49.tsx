// @ts-nocheck
type Props = {
  heading: string;
  description: string;
};

export type Header49Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header49 = (props: Header49Props) => {
  const { heading, description } = {
    ...Header49Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-start gap-x-12 gap-y-5 md:grid-cols-2 lg:gap-x-20 lg:gap-y-16">
          <div>
            <h1 className="text-6xl font-bold md:text-9xl lg:text-10xl">{heading}</h1>
          </div>
          <div>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header49Defaults: Props = {
  heading: "Short heading here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
};
