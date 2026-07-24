// @ts-nocheck
"use client"

import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { FaXTwitter } from "react-icons/fa6";
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from "react-icons/bi";
import { useState } from "react";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Links = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

type ColumnLinks = {
  title: string;
  links: Links[];
};

type FooterLink = {
  title: string;
  url: string;
};

type Props = {
  logo: ImageProps;
  newsletterDescription: string;
  inputPlaceholder?: string;
  button: ButtonProps;
  termsAndConditions: string;
  columnLinks: ColumnLinks[];
  companyImage: ImageProps;
  footerText: string;
  footerLinks: FooterLink[];
};

export type Footer16Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Footer16 = (props: Footer16Props) => {
  const {
    logo,
    newsletterDescription,
    inputPlaceholder,
    button,
    termsAndConditions,
    columnLinks,
    companyImage,
    footerText,
    footerLinks,
  } = {
    ...Footer16Defaults,
    ...props,
  };

  const [emailInput, setEmailInput] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      emailInput,
    });
  };

  return (
    <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[8vw] gap-y-12 pb-8 md:gap-y-16 md:pb-10 lg:grid-cols-[0.75fr_1fr] lg:gap-y-4 lg:pb-12">
          <div className="flex flex-col">
            <a href={logo.url} className="mb-5 md:mb-6">
              <img src={logo.src} alt={logo.alt} className="inline-block" />
            </a>
            <p className="mb-5 md:mb-6">{newsletterDescription}</p>
            <div className="w-full max-w-md">
              <form
                className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] md:gap-y-4"
                onSubmit={handleSubmit}
              >
                <Input
                  id="email"
                  type="email"
                  placeholder={inputPlaceholder}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <Button {...button}>{button.title}</Button>
              </form>
              <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-y-10 sm:grid-cols-3 sm:gap-x-6 md:gap-x-8 md:gap-y-4">
            {columnLinks.map((column, index) => (
              <div key={index} className="flex flex-col items-start justify-start">
                <h2 className="mb-3 font-semibold md:mb-4">{column.title}</h2>
                <ul>
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="py-2 text-sm">
                      <a href={link.url} className="flex items-center gap-3">
                        {link.icon && <span>{link.icon}</span>}
                        <span>{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
          <p className="mt-6 md:mt-0">{footerText}</p>
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

export const Footer16Defaults: Props = {
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
  newsletterDescription: "Join our newsletter to stay up to date on features and releases.",
  inputPlaceholder: "Enter your email",
  button: {
    title: "Subscribe",
    variant: "secondary",
    size: "sm",
  },
  termsAndConditions: `
  <p class='text-xs'>
    By subscribing you agree to with our
    <a href='#' class='underline'>Privacy Policy</a>
    and provide consent to receive updates from our company.
  </p>
  `,
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
      title: "Follow us",
      links: [
        { title: "Facebook", url: "#", icon: <BiLogoFacebookCircle className="size-6" /> },
        { title: "Instagram", url: "#", icon: <BiLogoInstagram className="size-6" /> },
        { title: "X", url: "#", icon: <FaXTwitter className="size-6 p-0.5" /> },
        { title: "LinkedIn", url: "#", icon: <BiLogoLinkedinSquare className="size-6" /> },
        { title: "Youtube", url: "#", icon: <BiLogoYoutube className="size-6" /> },
      ],
    },
  ],
  footerText: "© 2024 Relume. All rights reserved.",
  footerLinks: [
    { title: "Privacy Policy", url: "#" },
    { title: "Terms of Service", url: "#" },
    { title: "Cookies Settings", url: "#" },
  ],
};
