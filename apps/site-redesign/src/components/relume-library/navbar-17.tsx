// @ts-nocheck
"use client"

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type SocialMediaLink = {
  url: string;
  icon: React.ReactNode;
};

type NavLink = {
  url: string;
  title: string;
  subMenuLinks?: NavLink[];
};

type NavBottom = {
  button: ButtonProps;
  socialMediaLinks: SocialMediaLink[];
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  button: ButtonProps;
  navBottom: NavBottom;
};

export type Navbar17Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar17 = (props: Navbar17Props) => {
  const { logo, navLinks, button, navBottom } = {
    ...Navbar17Defaults,
    ...props,
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <section
      id="relume"
      className="relative z-[999] flex min-h-16 w-full items-center border-b border-b-border-primary bg-background-primary px-[5%] md:min-h-18"
    >
      <div className="mx-auto flex size-full items-center justify-between">
        <a href={logo.url}>
          <img src={logo.src} alt={logo.alt} />
        </a>
        <div className="flex items-center justify-center gap-2 lg:gap-4">
          <Button {...button} className="px-4 py-1 md:px-6 md:py-2">
            {button.title}
          </Button>
          <button
            className="-mr-2 flex size-12 flex-col items-center justify-center justify-self-end lg:mr-0"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="relative flex size-6 flex-col items-center justify-center">
              <motion.span
                className="absolute top-[3px] h-0.5 w-full bg-black"
                animate={isMenuOpen ? "open" : "close"}
                variants={topLineVariants}
              />
              <motion.span
                className="absolute h-0.5 w-full bg-black"
                animate={isMenuOpen ? "open" : "close"}
                variants={middleLineVariants}
              />
              <motion.span
                className="absolute h-0.5 w-full bg-black"
                animate={isMenuOpen ? "openSecond" : "closeSecond"}
                variants={middleLineVariants}
              />
              <motion.span
                className="absolute bottom-[3px] h-0.5 w-full bg-black"
                animate={isMenuOpen ? "open" : "close"}
                variants={bottomLineVariants}
              />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && <Menu isMenuOpen={isMenuOpen} navLinks={navLinks} navBottom={navBottom} />}
      </AnimatePresence>
    </section>
  );
};

const Menu = ({
  navLinks,
  navBottom,
  isMenuOpen,
}: {
  isMenuOpen: boolean;
  navBottom: NavBottom;
  navLinks: NavLink[];
}) => {
  return (
    <div className="absolute inset-x-0 top-full h-[calc(100vh-4rem)] w-full overflow-hidden md:h-[calc(100vh-4.5rem)]">
      <motion.div
        variants={{
          open: { opacity: 1 },
          close: { opacity: 0 },
        }}
        animate={isMenuOpen ? "open" : "close"}
        initial="close"
        exit="close"
        transition={{ duration: 0.2 }}
        className="flex h-full flex-col overflow-auto bg-background-primary"
      >
        <div className="mt-px flex grow flex-col">
          {navLinks.map((navLink, index) => (
            <a
              key={index}
              href={navLink.url}
              className="flex grow items-center justify-end border-t border-border-primary px-[5%] py-4 text-4xl font-bold leading-[1.2] last:border-b last:border-b-black md:py-2 md:text-6xl"
            >
              {navLink.title}
            </a>
          ))}
        </div>
        <div className="flex min-h-18 items-center justify-between gap-x-4 px-[5%]">
          <Button {...navBottom.button} className="text-md underline md:text-xl" asChild>
            <a href={navBottom.button.url}>{navBottom.button.title}</a>
          </Button>
          <div className="flex items-center gap-3">
            {navBottom.socialMediaLinks.map((link, index) => (
              <a key={index} href={link.url}>
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Navbar17Defaults: Props = {
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Relume placeholder logo",
  },
  navLinks: [
    {
      url: "#",
      title: "Link One",
    },
    {
      url: "#",
      title: "Link Two",
    },
    {
      url: "#",
      title: "Link Three",
    },
    {
      url: "#",
      title: "Link Four",
    },
    {
      url: "#",
      title: "Link Five",
    },
    {
      url: "#",
      title: "Link Six",
    },
    {
      url: "#",
      title: "Link Seven",
    },
    {
      url: "#",
      title: "Link Eight",
    },
  ],
  navBottom: {
    button: { title: "Contact", variant: "link", size: "link", url: "#" },
    socialMediaLinks: [
      { url: "#", icon: <BiLogoFacebookCircle className="size-6" /> },
      { url: "#", icon: <BiLogoInstagram className="size-6" /> },
      { url: "#", icon: <FaXTwitter className="size-6" /> },
      { url: "#", icon: <BiLogoLinkedinSquare className="size-6" /> },
      { url: "#", icon: <BiLogoYoutube className="size-6" /> },
    ],
  },
  button: {
    title: "Button",
    size: "sm",
  },
};

const topLineVariants = {
  open: {
    width: 0,
    transition: { duration: 0.1, ease: "easeIn" },
  },
  close: {
    width: "100%",
    transition: { duration: 0.1, delay: 0.3, ease: "linear" },
  },
};

const middleLineVariants = {
  open: {
    rotate: 135,
    transition: { duration: 0.3, delay: 0.1, ease: "easeInOut" },
  },
  close: {
    rotate: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  openSecond: {
    rotate: 45,
    transition: { duration: 0.3, delay: 0.1, ease: "easeInOut" },
  },
  closeSecond: {
    rotate: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const bottomLineVariants = {
  open: {
    width: 0,
    transition: { duration: 0.1, ease: "easeIn" },
  },
  close: {
    width: "100%",
    transition: { duration: 0.1, delay: 0.3, ease: "linear" },
  },
};
