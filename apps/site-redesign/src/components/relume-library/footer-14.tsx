// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { FaXTwitter } from "react-icons/fa6";
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from "react-icons/bi";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Links = {
  title: string;
  url: string;
};

type ColumnLinks = {
  title: string;
  links: Links[];
};

type SocialMediaLinks = {
  url: string;
  icon: React.ReactNode;
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

export type Footer14Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Footer14 = (props: Footer14Props) => {
  const {
    logo,
    heading,
    description,
    buttons,
    footerImages,
    columnLinks,
    socialMediaLinks,
    footerText,
  } = {
    ...Footer14Defaults,
    ...props,
  };

  return (
    <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="lg:flex lg:items-start lg:justify-between">
          <div className="rb-6 max-w-lg">
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">{heading}</h1>
            <p>{description}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-8 lg:mt-0">
            {buttons.map((button, index) => (
              <Button key={index} {...button}>
                {button.title}
              </Button>
            ))}
          </div>
        </div>
        <div className="py-12 md:py-18 lg:py-20">
          <div className="h-px w-full bg-black" />
        </div>
        <div className="rb-12 mb-12 grid grid-cols-1 items-start gap-x-8 gap-y-10 sm:grid-cols-3 md:mb-18 md:gap-y-12 lg:mb-20 lg:grid-cols-6">
          {columnLinks.map((column, index) => (
            <div key={index} className="flex flex-col items-start justify-start">
              <h2 className="mb-2 font-semibold">{column.title}</h2>
              <ul>
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="py-2 text-sm">
                    <a href={link.url} className="flex items-center gap-3">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
                className="-ml-3 size-12 min-h-12 min-w-12 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-black" />
        <div className="flex flex-col-reverse items-start gap-4 pb-4 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between md:pb-0 md:pt-8">
          <div className="flex flex-col-reverse items-start md:flex-row md:gap-6 lg:items-center">
            <p>{footerText}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
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

export const Footer14Defaults: Props = {
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
      title: "Column One",
      links: [
        { title: "Link One", url: "#" },
        { title: "Link Two", url: "#" },
        { title: "Link Three", url: "#" },
        { title: "Link Four", url: "#" },
        { title: "Link Five", url: "#" },
      ],
    },
    {
      title: "Column Two",
      links: [
        { title: "Link Six", url: "#" },
        { title: "Link Seven", url: "#" },
        { title: "Link Eight", url: "#" },
        { title: "Link Nine", url: "#" },
        { title: "Link Ten", url: "#" },
      ],
    },
    {
      title: "Column Three",
      links: [
        { title: "Link Eleven", url: "#" },
        { title: "Link Twelve", url: "#" },
        { title: "Link Thirteen", url: "#" },
        { title: "Link Fourteen", url: "#" },
        { title: "Link Fifteen", url: "#" },
      ],
    },
    {
      title: "Column Four",
      links: [
        { title: "Link Sixteen", url: "#" },
        { title: "Link Seventeen", url: "#" },
        { title: "Link Eighteen", url: "#" },
        { title: "Link Nineteen", url: "#" },
        { title: "Link Twenty", url: "#" },
      ],
    },
    {
      title: "Column Five",
      links: [
        { title: "Link Twenty One", url: "#" },
        { title: "Link Twenty Two", url: "#" },
        { title: "Link Twenty Three", url: "#" },
        { title: "Link Twenty Four", url: "#" },
        { title: "Link Twenty Five", url: "#" },
      ],
    },
    {
      title: "Column Six",
      links: [
        { title: "Link Twenty Six", url: "#" },
        { title: "Link Twenty Seven", url: "#" },
        { title: "Link Twenty Eight", url: "#" },
        { title: "Link Twenty Nine", url: "#" },
        { title: "Link Thirty", url: "#" },
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
