// @ts-nocheck
type Props = {
  headings: string[];
};

export type Banner12Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner12 = (props: Banner12Props) => {
  const { headings } = {
    ...Banner12Defaults,
    ...props,
  };

  return (
    <section
      id="relume"
      className="flex w-screen max-w-full justify-end overflow-hidden border-b border-border-primary"
    >
      <div className="flex w-[200vw]">
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex w-screen animate-marquee-right items-center justify-around py-4"
            >
              {headings.map((heading, headingIndex) => {
                const hiddenClass =
                  headingIndex >= 2 && headingIndex < 4
                    ? "hidden lg:flex"
                    : headingIndex === 4
                      ? "hidden md:flex"
                      : "flex";
                return (
                  <div
                    key={headingIndex}
                    className={`${hiddenClass} items-center justify-center px-4`}
                  >
                    <h1 className="text-md font-bold md:text-lg">{heading}</h1>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </section>
  );
};

export const Banner12Defaults: Props = {
  headings: [
    "Relume Library",
    "Relume Library",
    "Relume Library",
    "Relume Library",
    "Relume Library",
  ],
};
