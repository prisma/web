export const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

export const getRedirectableLink = (link: string, absoluteLinks: boolean) =>
  isAbsoluteUrl(link)
    ? link
    : absoluteLinks
      ? `https://www.prisma.io/${link.replace(/^\/+/, "")}`
      : link;
