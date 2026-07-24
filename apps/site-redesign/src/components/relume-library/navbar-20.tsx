// @ts-nocheck
"use client"

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Input } from "@relume_io/relume-ui";
import { type ButtonProps } from "@relume_io/relume-ui";
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

type GetInTouch = {
  phone: {
    url: string;
    number: string;
  };
  email: {
    url: string;
    contact: string;
  };
  address: string;
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  menuLinks: NavLink[];
  getInTouch: GetInTouch;
  subtitle: string;
  socialMediaLinks: SocialMediaLink[];
  newsletterHeading: string;
  newsletterDescription: string;
  inputPlaceholder?: string;
  button: ButtonProps;
  termsAndConditions: string;
};

export type Navbar20Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar20 = (props: Navbar20Props) => {
  const {
    logo,
    navLinks,
    menuLinks,
    getInTouch,
    subtitle,
    socialMediaLinks,
    newsletterHeading,
    newsletterDescription,
    inputPlaceholder,
    button,
    termsAndConditions,
  } = {
    ...Navbar20Defaults,
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
            getInTouch={getInTouch}
            subtitle={subtitle}
            socialMediaLinks={socialMediaLinks}
            newsletterHeading={newsletterHeading}
            newsletterDescription={newsletterDescription}
            inputPlaceholder={inputPlaceholder}
            button={button}
            termsAndConditions={termsAndConditions}
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
  getInTouch,
  subtitle,
  socialMediaLinks,
  newsletterHeading,
  newsletterDescription,
  inputPlaceholder,
  button,
  termsAndConditions,
  isMenuOpen,
}: {
  menuLinks: NavLink[];
  getInTouch: GetInTouch;
  subtitle: string;
  socialMediaLinks: SocialMediaLink[];
  newsletterHeading: string;
  newsletterDescription: string;
  inputPlaceholder?: string;
  button: ButtonProps;
  termsAndConditions: string;
  isMenuOpen: boolean;
}) => {
  const [emailInput, setEmailInput] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      emailInput,
    });
  };

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
        <div className="grid grid-cols-1 gap-y-12 py-4 md:gap-y-16 md:py-8 lg:my-auto lg:-translate-y-9 lg:grid-cols-[1fr_.75fr] lg:gap-x-20 lg:gap-y-0 lg:py-18">
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
            {menuLinks.map((menuLink, index) => (
              <a
                key={index}
                href={menuLink.url}
                className="py-2 text-2xl font-bold leading-[1.2] md:text-6xl lg:text-8xl"
              >
                {menuLink.title}
              </a>
            ))}
          </div>
          <div className="my-auto">
            <h5 className="mb-2 font-semibold md:text-md">{newsletterHeading}</h5>
            <p className="md:text-md">{newsletterDescription}</p>
            <div className="max-w-sm">
              <form
                className="mb-4 mt-5 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] md:mt-6 md:gap-y-4"
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
            <div className="mt-6 md:mt-8">
              <h5 className="mb-2 font-semibold md:text-md">{subtitle}</h5>
              <a href={getInTouch.phone.url} className="mb-1 block text-sm underline">
                {getInTouch.phone.number}
              </a>
              <a href={getInTouch.phone.url} className="mb-1 block text-sm underline">
                {getInTouch.email.contact}
              </a>
              <p className="text-sm">{getInTouch.address}</p>
              <div className="mt-6 flex items-center gap-3 md:mt-8">
                {socialMediaLinks.map((link, index) => (
                  <a key={index} href={link.url}>
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Navbar20Defaults: Props = {
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
    {
      url: "#",
      title: "Link Nine",
    },
    {
      url: "#",
      title: "Link Ten",
    },
  ],
  subtitle: "Get in touch",
  getInTouch: {
    phone: {
      url: "#",
      number: "1800 123 4567",
    },
    email: {
      url: "#",
      contact: "info@relume.io",
    },
    address: "Level 1, 12 Sample St, Sydney NSW 2000",
  },
  socialMediaLinks: [
    { url: "#", icon: <BiLogoFacebook className="size-6" /> },
    { url: "#", icon: <BiLogoInstagram className="size-6" /> },
    { url: "#", icon: <FaXTwitter className="size-6" /> },
    { url: "#", icon: <BiLogoLinkedinSquare className="size-6" /> },
    { url: "#", icon: <BiLogoYoutube className="size-6" /> },
  ],
  newsletterHeading: "Subscribe",
  newsletterDescription: "Join our newsletter to stay up to date on features and releases.",
  inputPlaceholder: "Enter your email",
  button: {
    title: "Subscribe",
    variant: "secondary",
  },
  termsAndConditions: `
<p class='text-xs'>
	By subscribing you agree to with our
	<a href='#'>Privacy Policy</a>
	and provide consent to receive updates from our company.
</p>
`,
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
