// @ts-nocheck
type Props = {
  heading: string;
  description: string;
};

export type Layout135Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout135 = (props: Layout135Props) => {
  const { heading, description } = {
    ...Layout135Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg text-center">
        <h3 className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">{heading}</h3>
        <p className="mt-5 md:mt-6 md:text-md">{description}</p>
      </div>
    </section>
  );
};

export const Layout135Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
};
