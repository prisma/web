// @ts-nocheck
"use client"

import { Button } from "@relume_io/relume-ui";
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
import { RxChevronDown, RxChevronRight } from "react-icons/rx";

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

type Article = {
  url: string;
  heading: string;
  description: string;
  image: ImageProps;
  linkText: string;
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  menuLinks: NavLink[];
  socialMediaLinks: SocialMediaLink[];
  buttonContact: ButtonProps;
  articleButton: ButtonProps;
  articleHeading: string;
  articles: Article[];
};

export type Navbar21Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar21 = (props: Navbar21Props) => {
  const {
    logo,
    navLinks,
    menuLinks,
    socialMediaLinks,
    buttonContact,
    articleButton,
    articleHeading,
    articles,
  } = {
    ...Navbar21Defaults,
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
            socialMediaLinks={socialMediaLinks}
            articleButton={articleButton}
            articleHeading={articleHeading}
            isMenuOpen={isMenuOpen}
            buttonContact={buttonContact}
            articles={articles}
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
  isMenuOpen,
  buttonContact,
  articleButton,
  articleHeading,
  articles,
}: {
  menuLinks: NavLink[];
  socialMediaLinks: SocialMediaLink[];
  isMenuOpen: boolean;
  buttonContact: ButtonProps;
  articleButton: ButtonProps;
  articleHeading: string;
  articles: Article[];
}) => {
  return (
    <div className="absolute inset-0 h-screen w-full overflow-auto bg-background-secondary lg:bg-background-primary">
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
        <div className="grid grid-cols-1 gap-y-20 py-18 lg:h-screen lg:grid-cols-[1fr_.75fr] lg:gap-x-20 lg:gap-y-0 lg:py-0">
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 px-[5vw] pt-20 sm:grid-cols-2 md:pt-8 lg:self-center lg:py-32 lg:pr-0">
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
          <div className="flex flex-col items-center bg-background-secondary px-[5vw] py-10 md:py-16 lg:justify-center lg:py-32 lg:pl-10">
            <div className="w-full lg:max-w-md">
              <h5 className="mb-3 font-semibold md:mb-4">{articleHeading}</h5>
              <div className="grid grid-cols-1 gap-y-2">
                {articles.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    className="flex flex-col items-start gap-4 py-2 sm:flex-row sm:gap-6"
                  >
                    <div className="sm:flex-[1_0_40%]">
                      <img
                        src={article.image.src}
                        alt={article.image.alt}
                        className="aspect-[12/9] size-full object-cover"
                      />
                    </div>
                    <div className="w-full grow lg:w-auto">
                      <h6 className="mb-1 font-semibold">{article.heading}</h6>
                      <p className="text-sm">{article.description}</p>
                      <p className="mt-2 text-sm underline">{article.linkText}</p>
                    </div>
                  </a>
                ))}
              </div>
              <Button {...articleButton} className="mt-3 md:mt-4">
                {articleButton.title}
              </Button>
            </div>
          </div>
          <div className="bottom-0 left-0 flex w-full items-center justify-between gap-x-4 px-[5vw] lg:absolute lg:min-h-18">
            <Button {...buttonContact} className="text-md underline md:text-xl" asChild>
              <a href={buttonContact.url}>{buttonContact.title}</a>
            </Button>
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

export const Navbar21Defaults: Props = {
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
  socialMediaLinks: [
    { url: "#", icon: <BiLogoFacebook className="size-6" /> },
    { url: "#", icon: <BiLogoInstagram className="size-6" /> },
    { url: "#", icon: <FaXTwitter className="size-6" /> },
    { url: "#", icon: <BiLogoLinkedinSquare className="size-6" /> },
    { url: "#", icon: <BiLogoYoutube className="size-6" /> },
  ],
  buttonContact: { title: "Contact", variant: "link", size: "link", url: "#" },
  articleHeading: "Featured from Blog",
  articleButton: {
    title: "See all articles",
    variant: "link",
    size: "link",
    iconRight: <RxChevronRight />,
  },
  articles: [
    {
      url: "#",
      heading: "Article Title",
      description: "Lorem ipsum dolor sit amet consectetur elit",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Placeholder image 1",
      },
      linkText: "Read more",
    },
    {
      url: "#",
      heading: "Article Title",
      description: "Lorem ipsum dolor sit amet consectetur elit",
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Placeholder image 2",
      },
      linkText: "Read more",
    },
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
