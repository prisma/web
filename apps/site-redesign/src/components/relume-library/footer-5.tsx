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
};

type ColumnLinks = {
  title: string;
  links: Links[];
};

type SocialMediaLinks = {
  url: string;
  icon: React.ReactNode;
};

type FooterLink = {
  title: string;
  url: string;
};

type Props = {
  logo: ImageProps;
  newsletterHeading: string;
  newsletterDescription: string;
  inputPlaceholder?: string;
  button: ButtonProps;
  termsAndConditions: string;
  columnLinks: ColumnLinks[];
  socialMediaLinks: SocialMediaLinks[];
  footerText?: string;
  footerLinks: FooterLink[];
};

export type Footer5Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Footer5 = (props: Footer5Props) => {
  const {
    logo,
    newsletterHeading,
    newsletterDescription,
    inputPlaceholder,
    button,
    termsAndConditions,
    columnLinks,
    socialMediaLinks,
    footerText,
    footerLinks,
  } = {
    ...Footer5Defaults,
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
        <div className="rb-12 mb-12 block items-start justify-between md:mb-18 lg:mb-20 lg:flex">
          <div className="rb-6 mb-6 lg:mb-0">
            <h1 className="font-semibold md:text-md">{newsletterHeading}</h1>
            <p>{newsletterDescription}</p>
          </div>
          <div className="max-w-md lg:min-w-[25rem]">
            <form
              className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-y-4 md:gap-4"
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
        <div className="rb-12 mb-12 grid grid-cols-1 items-start gap-x-8 gap-y-10 sm:grid-cols-3 md:mb-18 md:gap-y-12 lg:mb-20 lg:grid-cols-6">
          <a
            href={logo.url}
            className="sm:col-start-1 sm:col-end-4 sm:row-start-1 sm:row-end-2 lg:col-start-auto lg:col-end-auto lg:row-start-auto lg:row-end-auto"
          >
            <img src={logo.src} alt={logo.alt} />
          </a>
          {columnLinks.map((column, index) => (
            <div key={index} className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4">{column.title}</h2>
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
        <div className="h-px w-full bg-black" />
        <div className="flex flex-col-reverse items-start pb-4 pt-6 text-sm md:justify-start md:pb-0 md:pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col-reverse items-start md:flex-row md:gap-6 lg:items-center">
            <p className="mt-8 md:mt-0">{footerText}</p>
            <div className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 md:grid-flow-col md:justify-center md:gap-x-6 md:gap-y-0 lg:text-left">
              {footerLinks.map((link, index) => (
                <p key={index} className="underline">
                  <a href={link.url}>{link.title}</a>
                </p>
              ))}
            </div>
          </div>
          <div className="mb-8 flex items-center justify-center gap-3 lg:mb-0">
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

export const Footer5Defaults: Props = {
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Logo image",
  },
  newsletterHeading: "Join our newsletter",
  newsletterDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  inputPlaceholder: "Enter your email",
  button: {
    title: "Subscribe",
    variant: "secondary",
    size: "sm",
  },
  termsAndConditions: `
  <p class='text-xs'>
    By subscribing you agree to with our 
    <a href='#' class='underline'>Privacy Policy</a>.
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
