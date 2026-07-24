// @ts-nocheck
"use client"

import React, { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { BiLogoFacebook, BiLogoInstagram, BiLogoLinkedinSquare } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type SocialMediaLink = {
  url: string;
  icon: React.ReactNode;
};

type Props = {
  heading: string;
  description: string;
  logo: ImageProps;
  socialMediaLinks: SocialMediaLink[];
};

export type Banner9Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner9 = (props: Banner9Props) => {
  const { heading, description, logo, socialMediaLinks } = {
    ...Banner9Defaults,
    ...props,
  };

  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      id="relume"
      className="relative border-b border-border-primary  bg-neutral-white px-[5%]"
    >
      <div className="flex flex-col justify-start py-4 md:flex-row md:items-center md:py-3">
        <div className="mb-4 mr-7 flex flex-1 items-start md:mb-0 md:mr-8 md:items-center">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} className="mr-4 hidden size-8 lg:block" />
          </a>
          <div>
            <h2 className="font-semibold">{heading}</h2>
            <p className="text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {socialMediaLinks.map((link, index) => (
            <a key={index} href={link.url}>
              {link.icon}
            </a>
          ))}
        </div>
        <button className="absolute right-2 top-2 ml-4 md:static">
          <RxCross2 className="size-8 p-1" onClick={() => setIsVisible(false)} />
        </button>
      </div>
    </section>
  );
};

export const Banner9Defaults: Props = {
  heading: "Medium length banner heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
    alt: "Relume logo",
  },
  socialMediaLinks: [
    { url: "#", icon: <BiLogoFacebook className="size-6" /> },
    { url: "#", icon: <BiLogoInstagram className="size-6" /> },
    { url: "#", icon: <FaXTwitter className="size-6 p-0.5" /> },
    { url: "#", icon: <BiLogoLinkedinSquare className="size-6" /> },
  ],
};
