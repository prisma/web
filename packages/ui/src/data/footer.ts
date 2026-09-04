// Footer link data shared by the site, blog and docs chrome.
//
// Same-site destinations are root-relative. The apex host (prisma.io) 301s to
// www on every request, and the consumer renders these as plain `<a>` tags
// served from www.prisma.io, so a path avoids both that hop and any basePath
// the consuming app might otherwise prepend. Values are the URL that returns
// 200 today, not one that redirects again.
const footerItems = [
  {
    _type: "footerColumnType",
    title: "Product",
    url: "/product",
    links: [
      {
        title: "ORM",
        url: "/docs/orm",
        _type: "footerLinkType",
      },
      {
        title: "Prisma Postgres",
        url: "/postgres",
        _type: "footerLinkType",
      },
      {
        title: "Prisma Compute",
        url: "/compute",
        _type: "footerLinkType",
      },
      {
        title: "Studio",
        url: "/studio",
        _type: "footerLinkType",
      },
      {
        title: "Query Insights",
        url: "/query-insights",
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
        url: "/customers",
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
        url: "/programs/partners",
      },
      {
        _type: "footerLinkType",
        title: "Enterprise",
        url: "/enterprise",
      },
      {
        _type: "footerLinkType",
        title: "OSS Friends",
        url: "/programs/oss-friends",
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
        url: "/company",
      },
      {
        _type: "footerLinkType",
        title: "Blog",
        url: "/blog",
      },
      {
        _type: "footerLinkType",
        title: "Careers",
        url: "/company/careers",
        //tag: "We're hiring"
      },
      {
        _type: "footerDropdownType",
        title: "Legal",
        links: [
          {
            title: "Terms of Service",
            url: "/legal/terms",
          },
          {
            title: "Service Level Agreement",
            url: "/legal/sla",
          },
          {
            title: "Privacy Policy",
            url: "/legal/privacy",
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
    url: ({ current_page, text_data }: { current_page: string; text_data: string }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${current_page}`,
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
    url: ({ current_page, text_data }: { current_page: string; text_data: string }) =>
      `https://bsky.app/intent/compose?text=${text_data}${current_page}`,
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
