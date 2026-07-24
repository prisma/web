// @ts-nocheck
import clsx from "clsx";

type Props = {
  headings: string[];
};

export type Banner11Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner11 = (props: Banner11Props) => {
  const { headings } = {
    ...Banner11Defaults,
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
              className="flex w-screen animate-marquee-left items-center justify-around py-4"
            >
              {headings.map((heading, headingIndex) => (
                <div
                  key={headingIndex}
                  className={clsx(
                    "items-center justify-center px-4",
                    headingIndex >= 2 && headingIndex < 4 && "hidden lg:flex",
                    headingIndex === 4 && "hidden md:flex",
                  )}
                >
                  <h1 className="text-md font-bold md:text-lg">{heading}</h1>
                </div>
              ))}
            </div>
          ))}
      </div>
    </section>
  );
};

export const Banner11Defaults: Props = {
  headings: [
    "Relume Library",
    "Relume Library",
    "Relume Library",
    "Relume Library",
    "Relume Library",
  ],
};
