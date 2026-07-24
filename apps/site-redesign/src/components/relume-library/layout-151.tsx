// @ts-nocheck
import { Button, ButtonProps, VideoIframe } from "@relume_io/relume-ui";
import { Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  logos: ImageProps[];
  buttons: ButtonProps[];
  video: string;
  image: ImageProps;
};

export type Layout151Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout151 = (props: Layout151Props) => {
  const { tagline, heading, description, buttons, logos, image, video } = {
    ...Layout151Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="mb-12 md:mb-18 lg:mb-20">
            <div className="mx-auto max-w-lg text-center">
              <div className="flex flex-col items-center justify-start">
                <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
                <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                  {heading}
                </h2>
                <p className="md:text-md">{description}</p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 py-2 md:mt-6">
                  {logos.map((logo, index) => (
                    <img key={index} src={logo.src} alt={logo.alt} className="max-h-14" />
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-center gap-4 md:mt-8">
                  {buttons.map((button, index) => (
                    <Button key={index} {...button}>
                      {button.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger className="relative flex w-full items-center justify-center">
              <img src={image.src} alt={image.alt} className="size-full object-cover" />
              <span className="absolute inset-0 z-10 bg-black/50" />
              <FaCirclePlay className="absolute z-20 size-16 text-white" />
            </DialogTrigger>
            <DialogContent>
              <VideoIframe video={video} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export const Layout151Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  logos: [
    { src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg", alt: "Webflow logo 1" },
    { src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg", alt: "Relume logo 1" },
    { src: "https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg", alt: "Webflow logo 2" },
    { src: "https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg", alt: "Relume logo 2" },
  ],
};
