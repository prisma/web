import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 rejects /_next/* requests from any dev origin other than localhost,
  // which breaks the whole app when it's opened over the LAN (e.g. to show
  // someone on the same network). Whitelist the machine's LAN host.
  allowedDevOrigins: ["192.168.0.5"],
};

export default nextConfig;
