// @ts-nocheck
import type { ButtonProps } from "@relume_io/relume-ui";
import { Button, Dialog, DialogContent, DialogTrigger, VideoIframe } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  tagline: string;
  description: string;
  buttons: ButtonProps[];
  video: string;
  image: ImageProps;
};

export type Layout154Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout154 = (props: Layout154Props) => {
  const { tagline, description, buttons, video, image } = {
    ...props,
    ...Layout154Defaults,
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <p className="text-lg font-bold leading-[1.4] md:text-2xl">{description}</p>
            <div className="mt-6 flex items-center justify-center gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
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
    </section>
  );
};

export const Layout154Defaults: Props = {
  tagline: "Tagline",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  buttons: [
    {
      title: "Button",
      variant: "secondary",
    },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
};
