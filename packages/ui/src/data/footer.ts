const footerItems = [
  {
    _type: "footerColumnType",
    title: "Product",
    url: "/product",
    links: [
      {
        title: "ORM",
        url: "/orm",
        _type: "footerLinkType",
      },
      {
        title: "Studio",
        url: "/studio",
        _type: "footerLinkType",
      },
      {
        title: "Optimize",
        url: "/optimize",
        _type: "footerLinkType",
        //tag: "Early Access"
      },
      {
        title: "Accelerate",
        url: "/accelerate",
        _type: "footerLinkType",
      },
      {
        _type: "footerLinkType",
        title: "Pricing",
        url: "/pricing",
      },
      {
        _type: "footerLinkType",
        title: "Changelog",
        url: "/changelog",
      },
      {
        _type: "footerLinkType",
        title: "Platform status",
        url: "https://www.prisma-status.com",
      },
    ],
  },
  {
    title: "Resources",
    url: "/resources",
    _type: "footerColumnType",
    links: [
      {
        _type: "footerLinkType",
        title: "Docs",
        url: "/docs",
      },
      {
        _type: "footerLinkType",
        title: "Ecosystem",
        url: "/ecosystem",
      },
      {
        _type: "footerLinkType",
        title: "Customer stories",
        url: "/showcase",
      },
      {
        _type: "footerLinkType",
        title: "Data guide",
        url: "/dataguide",
      },
      {
        _type: "footerLinkType",
        title: "Benchmarks",
        url: "https://benchmarks.prisma.io/",
      },
    ],
  },
  {
    url: "/contact",
    _type: "footerColumnType",
    title: "Contact",
    links: [
      {
        _type: "footerLinkType",
        title: "Community",
        url: "/community",
      },
      {
        _type: "footerLinkType",
        title: "Support",
        url: "/support",
      },
      {
        _type: "footerLinkType",
        title: "Partners",
        url: "/partners",
      },
      {
        _type: "footerLinkType",
        title: "Enterprise",
        url: "/enterprise",
      },
      {
        _type: "footerLinkType",
        title: "OSS Friends",
        url: "/oss-friends",
      },
    ],
  },
  {
    title: "Company",
    url: "/company",
    _type: "footerColumnType",
    links: [
      {
        _type: "footerLinkType",
        title: "About",
        url: "/about",
      },
      {
        _type: "footerLinkType",
        title: "Blog",
        url: "/blog",
      },
      {
        _type: "footerLinkType",
        title: "Data DX",
        url: "https://www.datadx.io/",
      },
      {
        _type: "footerLinkType",
        title: "Careers",
        url: "/careers",
        //tag: "We're hiring"
      },
      {
        _type: "footerDropdownType",
        title: "Legal",
        links: [
          {
            title: "Terms of Service",
            url: "/terms",
          },
          {
            title: "Service Level Agreement",
            url: "/sla",
          },
          {
            title: "Privacy Policy",
            url: "/privacy",
          },
          {
            title: "Event Code of Conduct",
            url: "/event-code-of-conduct",
          },
          {
            title: "Security & Compliance",
            url: "https://trust.prisma.io/",
          },
        ],
      },
    ],
  },
];

const socialIcons = [
  {
    _type: "iconLink",
    title: "Discord",
    icon: "discord",
    url: "https://pris.ly/discord",
  },
  {
    _type: "iconLink",
    title: "Twitter",
    icon: "x-twitter",
    url: "https://twitter.com/prisma",
  },
  {
    _type: "iconLink",
    title: "YouTube",
    icon: "youtube",
    url: "https://www.youtube.com/c/PrismaData",
  },
  {
    _type: "iconLink",
    title: "GitHub",
    icon: "github",
    url: "https://github.com/prisma",
  },
];

const footerData = {
  footerItems,
  socialIcons,
};

export default footerData;
