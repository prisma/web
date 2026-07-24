// @ts-nocheck
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

type SocialMediaLinks = {
  url: string;
  icon: React.ReactNode;
};

type ColumnLinks = {
  links: Links[];
};

type Address = {
  label: string;
  value: string;
};

type Contact = {
  label: string;
  phone: string;
  email: string;
};

type Props = {
  logo: ImageProps;
  address: Address;
  contact: Contact;
  columnLinks: ColumnLinks[];
  socialMediaLinks: SocialMediaLinks[];
  companyImage: ImageProps;
  footerText?: string;
  footerLinks: Links[];
};

export type Footer15Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Footer15 = (props: Footer15Props) => {
  const {
    logo,
    address,
    contact,
    companyImage,
    columnLinks,
    socialMediaLinks,
    footerText,
    footerLinks,
  } = {
    ...Footer15Defaults,
    ...props,
  };
  return (
    <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[4vw] gap-y-12 pb-10 md:gap-y-16 md:pb-14 lg:grid-cols-[1fr_0.5fr] lg:gap-y-4 lg:pb-16">
          <div>
            <div className="rb-6 mb-6 md:mb-8">
              <a href={logo.url}>
                <img src={logo.src} alt={logo.alt} className="inline-block" />
              </a>
            </div>
            <div className="rb-6 mb-6 md:mb-8">
              <div>
                <p className="mb-1 text-sm font-semibold">{address.label}</p>
                <p className="mb-5 text-sm md:mb-6">{address.value}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{contact.label}</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="block text-sm underline decoration-black underline-offset-1"
                >
                  {contact.phone}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="block text-sm underline decoration-black underline-offset-1"
                >
                  {contact.email}
                </a>
              </div>
            </div>
            <div className="grid grid-flow-col grid-cols-[max-content] items-start justify-start gap-x-3">
              {socialMediaLinks.map((link, index) => (
                <a key={index} href={link.url}>
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-8 md:gap-y-4">
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
        <div className="pb-8 md:pb-10 lg:pb-12">
          <a href={companyImage.url}>
            <img src={companyImage.src} alt={companyImage.alt} className="inline-block" />
          </a>
        </div>
        <div className="h-px w-full bg-black" />
        <div className="flex flex-col-reverse items-start justify-between pb-4 pt-6 text-sm md:flex-row md:items-center md:pb-0 md:pt-8">
          <p className="mt-8 md:mt-0">{footerText}</p>
          <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
            {footerLinks.map((link, index) => (
              <li key={index} className="underline">
                <a href={link.url}>{link.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export const Footer15Defaults: Props = {
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Logo image",
  },
  companyImage: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/company-name.svg",
    alt: "Company image",
  },
  address: {
    label: "Address:",
    value: "Level 1, 12 Sample St, Sydney NSW 2000",
  },
  contact: {
    label: "Contact:",
    phone: "1800 123 4567",
    email: "info@relume.io",
  },
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
  footerLinks: [
    { title: "Privacy Policy", url: "#" },
    { title: "Terms of Service", url: "#" },
    { title: "Cookies Settings", url: "#" },
  ],
};
