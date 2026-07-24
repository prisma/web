// @ts-nocheck
"use client"

import { Label, Textarea, Checkbox, Button, Input } from "@relume_io/relume-ui";
import { type ButtonProps } from "@relume_io/relume-ui";
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
  socialMediaLinks: SocialMediaLink[];
  getInTouch: GetInTouch;
  contactButton: ButtonProps;
  contactHeading: string;
  contactDescription: string;
  inputMessagePlaceholder: string;
  termsAndConditions: string;
};

export type Navbar22Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar22 = (props: Navbar22Props) => {
  const {
    logo,
    navLinks,
    menuLinks,
    socialMediaLinks,
    getInTouch,
    contactButton,
    contactHeading,
    contactDescription,
    inputMessagePlaceholder,
    termsAndConditions,
  } = {
    ...Navbar22Defaults,
    ...props,
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <section
      id="relume"
      className="sticky top-0 z-[999] flex min-h-16 w-full items-center border-b border-b-border-primary bg-background-primary px-[5%] md:min-h-18"
    >
      <div className="mx-auto flex size-full items-center justify-between">
        <a href={logo.url} className="relative z-50">
          <img src={logo.src} alt={logo.alt} />
        </a>
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:overflow-hidden lg:px-0 lg:text-center">
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
        <div className="relative z-50 flex items-center justify-center gap-2 lg:gap-4">
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
            contactButton={contactButton}
            contactHeading={contactHeading}
            contactDescription={contactDescription}
            inputMessagePlaceholder={inputMessagePlaceholder}
            termsAndConditions={termsAndConditions}
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
  socialMediaLinks,
  getInTouch,
  contactButton,
  contactHeading,
  contactDescription,
  inputMessagePlaceholder,
  termsAndConditions,
  isMenuOpen,
}: {
  menuLinks: NavLink[];
  socialMediaLinks: SocialMediaLink[];
  getInTouch: GetInTouch;
  contactButton: ButtonProps;
  contactHeading: string;
  contactDescription: string;
  inputMessagePlaceholder: string;
  termsAndConditions: string;
  isMenuOpen: boolean;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState<boolean | "indeterminate">(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ name, email, message, acceptTerms });
  };
  return (
    <div className="absolute inset-0 h-screen w-full overflow-auto bg-background-primary">
      <motion.div
        variants={{
          open: { opacity: 1 },
          close: { opacity: 0 },
        }}
        animate={isMenuOpen ? "open" : "close"}
        initial="close"
        exit="close"
        transition={{ duration: 0.2 }}
      >
        <div className="grid grid-cols-1 gap-y-12 py-18 md:gap-y-16 lg:h-screen lg:grid-cols-[1fr_.75fr] lg:gap-x-20 lg:gap-y-0 lg:py-0">
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 px-[5vw] pt-4 sm:grid-cols-2 md:pt-8 lg:self-start lg:py-32 lg:pr-0">
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
          <div className="flex flex-col items-center justify-start bg-background-secondary px-[5vw] py-10 md:py-16 lg:py-32 lg:pl-10">
            <div className="w-full lg:max-w-md">
              <h5 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">{contactHeading}</h5>
              <p className="mb-6 md:mb-8">{contactDescription}</p>
              <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-y-2">
                  <Label htmlFor="m">Message</Label>
                  <Textarea
                    id="message"
                    placeholder={inputMessagePlaceholder}
                    className="min-h-[11.25rem] overflow-auto"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="mb-3 flex items-center md:mb-4">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={setAcceptTerms}
                    className="mr-2"
                  />
                  <Label htmlFor="terms" className="cursor-pointer">
                    <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
                  </Label>
                </div>
                <Button {...contactButton} className="mr-auto">
                  {contactButton.title}
                </Button>
              </form>
            </div>
          </div>
          <div className="flex flex-col gap-y-6 px-[5vw] lg:absolute lg:inset-[auto_auto_3rem_5vw] lg:px-0">
            <div className="flex flex-col gap-y-0.5">
              <a href={getInTouch.phone.url} className="mb-1 block text-sm underline">
                {getInTouch.phone.number}
              </a>
              <a href={getInTouch.phone.url} className="mb-1 block text-sm underline">
                {getInTouch.email.contact}
              </a>
              <p className="text-sm">{getInTouch.address}</p>
              <div className="mt-5 flex items-center gap-3 md:mt-6">
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

export const Navbar22Defaults: Props = {
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
  contactHeading: "Contact",
  contactDescription: "Lorem ipsum dolor sit amet, consectetur.",
  inputMessagePlaceholder: "Type your message...",
  contactButton: { title: "Submit" },
  termsAndConditions: `
	<p class='text-sm'>
		I accept the
		<a href='#' class='underline'>Terms</a>
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
