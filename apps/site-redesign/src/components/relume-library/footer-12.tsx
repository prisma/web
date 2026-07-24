// @ts-nocheck
import { FaXTwitter } from "react-icons/fa6";
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from "react-icons/bi";
import { Button, ButtonProps } from "@relume_io/relume-ui";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Links = {
  title: string;
  url: string;
};

type SocialMediaLinks = {
  url: string;
  icon: React.ReactNode;
};

type ColumnLinks = {
  links: Links[];
};

type Props = {
  logo: ImageProps;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  columnLinks: ColumnLinks[];
  socialMediaLinks: SocialMediaLinks[];
  footerText?: string;
  footerImages: ImageProps[];
};

export type Footer12Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Footer12 = (props: Footer12Props) => {
  const {
    logo,
    heading,
    description,
    columnLinks,
    socialMediaLinks,
    footerText,
    footerImages,
    buttons,
  } = {
    ...Footer12Defaults,
    ...props,
  };
  return (
    <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="border-b border-border-primary">
          <div className="mb-12 grid grid-cols-1 gap-x-[8vw] gap-y-12 md:mb-18 md:gap-y-16 lg:mb-20 lg:grid-cols-[1fr_0.5fr] lg:gap-y-20">
            <div className="rb-6 max-w-md">
              <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
                {heading}
              </h1>
              <p>{description}</p>
              <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
                {buttons.map((button, index) => (
                  <Button key={index} {...button}>
                    {button.title}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 sm:grid-cols-2 md:gap-x-8 md:gap-y-4">
              {columnLinks.map((column, index) => (
                <ul key={index}>
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="py-2 text-sm font-semibold">
                      <a href={link.url}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className="rb-6 col-span-1 flex flex-col items-start justify-between pb-6 sm:flex-row sm:items-center md:pb-8 lg:col-span-2">
            <a href={logo.url}>
              <img src={logo.src} alt={logo.alt} className="mb-6 inline-block sm:mb-0" />
            </a>
            <div className="ml-3 flex">
              {footerImages.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  className="relative -ml-3 size-12 min-h-12 min-w-12 rounded-full border-2 border-white object-cover "
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse items-start justify-between pb-4 pt-6 text-sm md:flex-row md:items-center md:pb-0 md:pt-8">
          <p className="mt-5 md:mt-0">{footerText}</p>
          <div className="grid grid-flow-col grid-cols-[max-content] items-start justify-start gap-x-3">
            {socialMediaLinks.map((link, index) => (
              <a key={index} href={link.url}>
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Footer12Defaults: Props = {
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Logo image",
  },
  heading: "Medium length footer heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  columnLinks: [
    {
      links: [
        { title: "Link One", url: "#" },
        { title: "Link Two", url: "#" },
        { title: "Link Three", url: "#" },
        { title: "Link Four", url: "#" },
        { title: "Link Five", url: "#" },
      ],
    },
    {
      links: [
        { title: "Link Six", url: "#" },
        { title: "Link Seven", url: "#" },
        { title: "Link Eight", url: "#" },
        { title: "Link Nine", url: "#" },
        { title: "Link Ten", url: "#" },
      ],
    },
  ],
  socialMediaLinks: [
    { url: "#", icon: <BiLogoFacebookCircle className="size-6" /> },
    { url: "#", icon: <BiLogoInstagram className="size-6" /> },
    { url: "#", icon: <FaXTwitter className="size-6 p-0.5" /> },
    { url: "#", icon: <BiLogoLinkedinSquare className="size-6" /> },
    { url: "#", icon: <BiLogoYoutube className="size-6" /> },
  ],
  footerText: "© 2024 Relume. All rights reserved.",
  footerImages: [
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-small.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-small.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-small.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-small.svg",
      alt: "Relume placeholder image",
    },
    {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-small.svg",
      alt: "Relume placeholder image",
    },
  ],
};
