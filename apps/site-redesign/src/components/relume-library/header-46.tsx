// @ts-nocheck
type Props = {
  heading: string;
  description: string;
};

export type Header46Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header46 = (props: Header46Props) => {
  const { heading, description } = {
    ...Header46Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="w-full max-w-lg">
          <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
        </div>
      </div>
    </section>
  );
};

export const Header46Defaults: Props = {
  heading: "Short heading here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
};
