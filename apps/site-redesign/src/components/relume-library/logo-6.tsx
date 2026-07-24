// @ts-nocheck
type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  logos: ImageProps[];
};

export type Logo6Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Logo6 = (props: Logo6Props) => {
  const { heading, logos } = {
    ...Logo6Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container">
        <h1 className="mx-auto mb-8 w-full max-w-lg text-center text-base font-bold leading-[1.2] md:mb-10 md:text-md md:leading-[1.2] lg:mb-12">
          {heading}
        </h1>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex w-full items-start justify-center justify-self-center bg-neutral-lightest px-4 pb-4 pt-[0.875rem] md:p-[0.875rem]"
            >
              <img src={logo.src} className="max-h-12 md:max-h-14" alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Logo6Defaults: Props = {
  heading: "Used by the world's leading companies",
  logos: [
    { src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg", alt: "Webflow logo 1" },
    { src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg", alt: "Relume logo 1" },
    { src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg", alt: "Webflow logo 2" },
    { src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg", alt: "Relume logo 2" },
    { src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg", alt: "Webflow logo 3" },
    { src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg", alt: "Relume logo 3" },
  ],
};
