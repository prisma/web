// @ts-nocheck
type Props = {
  heading: string;
  description: string;
};

export type Layout36Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout36 = (props: Layout36Props) => {
  const { heading, description } = {
    ...Layout36Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="w-full max-w-md">
          <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
            {heading}
          </h3>
          <p className="md:text-md">{description}</p>
        </div>
      </div>
    </section>
  );
};

export const Layout36Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
};
