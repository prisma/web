import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 rejects /_next/* requests from any dev origin other than localhost,
  // which breaks the whole app when it's opened over the LAN (e.g. to show
  // someone on the same network). Whitelist the machine's LAN host.
  allowedDevOrigins: ["192.168.0.5"],

  // Old-site URLs whose content moved in the redesign's IA. Permanent, so
  // search engines carry ranking over at cutover.
  async redirects() {
    return [
      { source: "/about", destination: "/company", permanent: true },
      { source: "/careers", destination: "/company/careers", permanent: true },
      { source: "/case-studies", destination: "/customers", permanent: true },
      { source: "/privacy", destination: "/legal/privacy", permanent: true },
      { source: "/terms", destination: "/legal/terms", permanent: true },
      { source: "/sla", destination: "/legal/sla", permanent: true },
      { source: "/startups", destination: "/programs/startups", permanent: true },
      { source: "/partners", destination: "/programs/partners", permanent: true },
      { source: "/oss-friends", destination: "/programs/oss-friends", permanent: true },
    ];
  },
};

export default nextConfig;
