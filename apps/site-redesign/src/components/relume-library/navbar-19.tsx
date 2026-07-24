// @ts-nocheck
"use client"

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { RxChevronDown } from "react-icons/rx";

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

type MenuNavigation = {
  title: string;
  links: NavLink[];
};

type Address = {
  phone: string;
  email: string;
  location: string;
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  menuLinks: NavLink[];
  menuNavigation: MenuNavigation[];
  address: Address;
  socialMediaLinks: SocialMediaLink[];
};

export type Navbar19Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar19 = (props: Navbar19Props) => {
  const { logo, navLinks, menuLinks, menuNavigation, address, socialMediaLinks } = {
    ...Navbar19Defaults,
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
        <div
          className={clsx(
            "hidden lg:items-center lg:justify-center lg:overflow-hidden lg:px-0 lg:text-center",
            !isMenuOpen && "lg:flex",
          )}
        >
          {navLinks.map((navLink, index) => (
            <div key={index} className="first:pt-4 lg:first:pt-0">
              {navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
                <SubMenu navLink={navLink} />
              ) : (
                <a href={navLink.url} className="block py-3 text-md lg:px-4 lg:py-2 lg:text-base">
                  {navLink.title}
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 lg:gap-4">
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
        {isMenuOpen && (
          <Menu
            menuLinks={menuLinks}
            menuNavigation={menuNavigation}
            address={address}
            socialMediaLinks={socialMediaLinks}
            isMenuOpen={isMenuOpen}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const SubMenu = ({ navLink }: { navLink: NavLink }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <section
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <button
        className="flex w-full items-center justify-center gap-4 py-3 text-center text-md lg:w-auto lg:flex-none lg:justify-start lg:gap-2 lg:px-4 lg:py-2 lg:text-base"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span>{navLink.title}</span>
        <motion.span
          animate={isDropdownOpen ? "rotated" : "initial"}
          variants={{
            rotated: { rotate: 180 },
            initial: { rotate: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <RxChevronDown />
        </motion.span>
      </button>
      {isDropdownOpen && (
        <AnimatePresence>
          <motion.nav
            animate={isDropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            variants={{
              open: {
                visibility: "visible",
                opacity: "var(--opacity-open, 100%)",
                y: 0,
              },
              close: {
                visibility: "hidden",
                opacity: "var(--opacity-close, 0)",
                y: "var(--y-close, 0%)",
              },
            }}
            transition={{ duration: 0.2 }}
            className="bg-background-primary lg:absolute lg:z-50 lg:border lg:border-border-primary lg:p-2 lg:[--y-close:25%]"
          >
            {navLink.subMenuLinks?.map((subMenuLink, index) => (
              <a
                key={index}
                href={subMenuLink.url}
                className="block py-3 text-center lg:px-4 lg:py-2 lg:text-left"
              >
                {subMenuLink.title}
              </a>
            ))}
          </motion.nav>
        </AnimatePresence>
      )}
    </section>
  );
};

const Menu = ({
  menuLinks,
  menuNavigation,
  address,
  socialMediaLinks,
  isMenuOpen,
}: {
  menuLinks: NavLink[];
  menuNavigation: MenuNavigation[];
  address: Address;
  socialMediaLinks: SocialMediaLink[];
  isMenuOpen: boolean;
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
        className="flex h-full flex-col overflow-auto bg-background-primary px-[5%] pt-px"
      >
        <div className="grid grid-cols-1 gap-y-8 py-4 sm:gap-y-12 md:gap-y-16 md:py-8 lg:my-auto lg:-translate-y-9 lg:grid-cols-2 lg:items-start lg:gap-x-20 lg:gap-y-0 lg:py-18">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:gap-x-10">
            {menuLinks.map((menuLink, index) => (
              <a
                key={index}
                href={menuLink.url}
                className="py-2 text-2xl font-bold leading-[1.2] md:text-6xl"
              >
                {menuLink.title}
              </a>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-2 sm:gap-x-8 sm:gap-y-12 md:gap-x-10 md:gap-y-16 lg:[grid-area:1/2/3/3]">
            {menuNavigation.map((item, index) => (
              <div key={index}>
                <p className="mb-3 font-semibold md:mb-4">{item.title}</p>
                <div className="flex flex-col">
                  {item.links.map((link, index) => (
                    <a key={index} href={link.url} className="py-2 text-sm">
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-y-6 self-end lg:mt-8">
            <div className="flex flex-col gap-y-1.5 text-sm">
              <a href={address.phone} className="underline">
                {address.phone}
              </a>
              <a href={address.email} className="underline">
                {address.email}
              </a>
              <p>{address.location}</p>
            </div>
            <div className="flex items-center gap-3">
              {socialMediaLinks.map((link, index) => (
                <a key={index} href={link.url}>
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Navbar19Defaults: Props = {
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Relume placeholder logo",
  },
  navLinks: [
    { title: "Link One", url: "#" },
    { title: "Link Two", url: "#" },
    { title: "Link Three", url: "#" },
    {
      title: "Link Four",
      url: "#",
      subMenuLinks: [
        { title: "Link Five", url: "#" },
        { title: "Link Six", url: "#" },
        { title: "Link Seven", url: "#" },
      ],
    },
  ],
  menuLinks: [
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
  menuNavigation: [
    {
      title: "Column One",
      links: [
        {
          title: "Link One",
          url: "#",
        },
        {
          title: "Link Two",
          url: "#",
        },
        {
          title: "Link Three",
          url: "#",
        },
        {
          title: "Link Four",
          url: "#",
        },
        {
          title: "Link Five",
          url: "#",
        },
      ],
    },
    {
      title: "Column Two",
      links: [
        {
          title: "Link Six",
          url: "#",
        },
        {
          title: "Link Seven",
          url: "#",
        },
        {
          title: "Link Eight",
          url: "#",
        },
        {
          title: "Link Nine",
          url: "#",
        },
        {
          title: "Link Ten",
          url: "#",
        },
      ],
    },
    {
      title: "Column Three",
      links: [
        {
          title: "Link Eleven",
          url: "#",
        },
        {
          title: "Link Twelve",
          url: "#",
        },
        {
          title: "Link Thirteen",
          url: "#",
        },
        {
          title: "Link Fourteen",
          url: "#",
        },
        {
          title: "Link Fifteen",
          url: "#",
        },
      ],
    },
    {
      title: "Column Four",
      links: [
        {
          title: "Link Sixteen",
          url: "#",
        },
        {
          title: "Link Seventeen",
          url: "#",
        },
        {
          title: "Link Eightteen",
          url: "#",
        },
        {
          title: "Link Nineteen",
          url: "#",
        },
        {
          title: "Link Twenty",
          url: "#",
        },
      ],
    },
  ],
  address: {
    phone: "1800 123 4567",
    email: "info@relume.io",
    location: "Level 1, 12 Sample St, Sydney NSW 2000",
  },
  socialMediaLinks: [
    { url: "#", icon: <BiLogoFacebook className="size-6" /> },
    { url: "#", icon: <BiLogoInstagram className="size-6" /> },
    { url: "#", icon: <FaXTwitter className="size-6 p-0.5" /> },
    { url: "#", icon: <BiLogoLinkedinSquare className="size-6" /> },
    { url: "#", icon: <BiLogoYoutube className="size-6" /> },
  ],
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
