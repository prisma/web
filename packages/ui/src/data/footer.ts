const footerItems = [
  {
    _type: "footerColumnType",
    title: "Product",
    url: "https://prisma.io/product",
    links: [
      {
        title: "ORM",
        url: "https://prisma.io/orm",
        _type: "footerLinkType",
      },
      {
        title: "Studio",
        url: "https://prisma.io/studio",
        _type: "footerLinkType",
      },
      {
        title: "Query Insights",
        url: "https://prisma.io/query-insights",
        _type: "footerLinkType",
      },
      {
        _type: "footerLinkType",
        title: "Pricing",
        url: "https://prisma.io/pricing",
      },
      {
        _type: "footerLinkType",
        title: "Changelog",
        url: "https://prisma.io/changelog",
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
    url: "https://prisma.io/resources",
    _type: "footerColumnType",
    links: [
      {
        _type: "footerLinkType",
        title: "Docs",
        url: "https://prisma.io/docs",
      },
      {
        _type: "footerLinkType",
        title: "Ecosystem",
        url: "https://prisma.io/ecosystem",
      },
      {
        _type: "footerLinkType",
        title: "Customer stories",
        url: "https://prisma.io/showcase",
      },
      {
        _type: "footerLinkType",
        title: "Data guide",
        url: "https://prisma.io/dataguide",
      },
      {
        _type: "footerLinkType",
        title: "Benchmarks",
        url: "https://benchmarks.prisma.io/",
      },
    ],
  },
  {
    url: "https://prisma.io/contact",
    _type: "footerColumnType",
    title: "Contact",
    links: [
      {
        _type: "footerLinkType",
        title: "Community",
        url: "https://prisma.io/community",
      },
      {
        _type: "footerLinkType",
        title: "Support",
        url: "https://prisma.io/support",
      },
      {
        _type: "footerLinkType",
        title: "Partners",
        url: "https://prisma.io/partners",
      },
      {
        _type: "footerLinkType",
        title: "Enterprise",
        url: "https://prisma.io/enterprise",
      },
      {
        _type: "footerLinkType",
        title: "OSS Friends",
        url: "https://prisma.io/oss-friends",
      },
    ],
  },
  {
    title: "Company",
    url: "https://prisma.io/company",
    _type: "footerColumnType",
    links: [
      {
        _type: "footerLinkType",
        title: "About",
        url: "https://prisma.io/about",
      },
      {
        _type: "footerLinkType",
        title: "Blog",
        url: "https://prisma.io/blog",
      },
      {
        _type: "footerLinkType",
        title: "Data DX",
        url: "https://www.datadx.io/",
      },
      {
        _type: "footerLinkType",
        title: "Careers",
        url: "https://prisma.io/careers",
        //tag: "We're hiring"
      },
      {
        _type: "footerDropdownType",
        title: "Legal",
        links: [
          {
            title: "Terms of Service",
            url: "https://prisma.io/terms",
          },
          {
            title: "Service Level Agreement",
            url: "https://prisma.io/sla",
          },
          {
            title: "Privacy Policy",
            url: "https://prisma.io/privacy",
          },
          {
            title: "Event Code of Conduct",
            url: "https://prisma.io/event-code-of-conduct",
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
    url: "https://pris.ly/x",
  },
  {
    _type: "iconLink",
    title: "YouTube",
    icon: "youtube",
    url: "https://pris.ly/youtube",
  },
  {
    _type: "iconLink",
    title: "GitHub",
    icon: "github",
    url: "https://github.com/prisma",
  },
];

const shareSocials = [
  {
    label: "LinkedIn",
    icon: "fa-brands fa-square-linkedin",
    url: ({
      current_page,
      text_data,
    }: {
      current_page: string;
      text_data: string;
    }) => `https://www.linkedin.com/sharing/share-offsite/?url=${current_page}`,
  },
  {
    label: "X",
    icon: "fa-brands fa-x-twitter",
    url: ({
      current_page,
      text_data,
      hashtags,
    }: {
      current_page: string;
      text_data: string;
      hashtags: Array<string>;
    }) =>
      `http://x.com/share?text=${text_data}&url=${current_page}${
        hashtags ? `&hashtags=${hashtags.join()}` : ``
      }`,
  },
  {
    label: "Bluesky",
    icon: "fa-brands fa-bluesky",
    url: ({
      current_page,
      text_data,
    }: {
      current_page: string;
      text_data: string;
    }) => `https://bsky.app/intent/compose?text=${text_data}${current_page}`,
  },
  { label: "Copy link", icon: "fa-solid fa-link", copy: true },
];

const footerData = {
  footerItems,
  socialIcons,
  shareSocials,
};

export { footerItems, socialIcons, shareSocials };
export default footerData;
