// @ts-nocheck
import { Button, ButtonProps, VideoIframe } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import { Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt?: string;
};

type SubHeadingProps = {
  title: string;
  description: string;
  icon: ImageProps;
};

type Props = {
  tagline: string;
  heading: string;
  subHeadings: SubHeadingProps[];
  description: string;
  image: ImageProps;
  video: string;
  buttons: ButtonProps[];
};

export type Layout99Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout99 = (props: Layout99Props) => {
  const { heading, description, tagline, buttons, image, video, subHeadings } = {
    ...Layout99Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start justify-between gap-x-12 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h3 className="text-5xl font-bold leading-[1.2] md:text-7xl lg:text-8xl">{heading}</h3>
          </div>
          <div>
            <p className="mb-6 md:mb-8 md:text-md">{description}</p>
            <div className="grid grid-cols-1 gap-6 py-2 lg:grid-cols-2">
              {subHeadings.map((subHeading, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex-none self-start">
                    <img src={subHeading.icon.src} className="size-8" alt={subHeading.icon.alt} />
                  </div>
                  <div>
                    <h6 className="mb-3 text-md font-bold leading-[1.4] md:mb-4 md:text-xl">
                      {subHeading.title}
                    </h6>
                    <p>{subHeading.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="relative flex w-full items-center justify-center">
              <img src={image.src} alt={image.alt} className="size-full object-cover" />
              <span className="absolute inset-0 z-10 bg-black/50" />
              <FaCirclePlay className="absolute z-20 size-16 text-white" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <VideoIframe video={video} />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export const Layout99Defaults: Props = {
  tagline: "Tagline",
  heading: "Medium length section heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  subHeadings: [
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 1" },
      title: "Subheading one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
    {
      icon: { src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg", alt: "Relume logo 2" },
      title: "Subheading two",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    },
  ],
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
};
