import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configs supply arbitrary client-owned image URLs, so any HTTPS host is
    // allowed rather than an allowlist that would need editing per site.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
