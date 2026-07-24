// @ts-nocheck
import { Dialog, DialogContent, DialogTrigger, VideoIframe } from "@relume_io/relume-ui";
import { FaCirclePlay } from "react-icons/fa6";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  image: ImageProps;
  video: string;
};

export type Layout144Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout144 = (props: Layout144Props) => {
  const { heading, description, image, video } = {
    ...Layout144Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <h2 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
              {heading}
            </h2>
            <p className="md:text-md">{description}</p>
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

export const Layout144Defaults: Props = {
  heading: "Long heading is what you see here in this feature section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
};
